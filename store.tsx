
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Salon, StoreContextType, Appointment, PlanType, BlockedPeriod, Client, SaaSPlan, Coupon, Transaction, Product, Service, Professional, Review } from './types';
import { supabase } from './services/supabaseClient';

// Simple mock UUID generator (fallback)
const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_PLANS: SaaSPlan[] = [
    {
        id: 'professional',
        name: 'Profissional',
        price: 29.00,
        perProfessionalPrice: 10,
        maxProfessionals: 99,
        isRecommended: true,
        features: ['Agenda Ilimitada', 'Controle Financeiro', 'Gestão de Estoque', 'Site Próprio', 'Marketing IA', 'Suporte Prioritário']
    }
];

// Dados removidos - sistema carrega do Supabase
const INITIAL_SALONS: Salon[] = [];



const INITIAL_COUPONS: Coupon[] = [];

const INITIAL_CLIENTS: Client[] = [];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State initialization
    const [salons, setSalons] = useState<Salon[]>(INITIAL_SALONS);
    const [saasPlans, setSaasPlans] = useState<SaaSPlan[]>(INITIAL_PLANS);
    const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);

    const [currentSalonId, setCurrentSalonId] = useState<string | null>(null);
    const saasRevenueGoal = 5000;
    const [trialDays, setTrialDays] = useState<number>(30);
    const [isLoading, setIsLoading] = useState(true);

    // --- SUPABASE DATA FETCHING ---
    const loadDataFromSupabase = async () => {
        if (!supabase) return false;

        try {
            // Fetch base tables
            const { data: salonsData } = await supabase.from('salons').select('*');
            const { data: servicesData } = await supabase.from('services').select('*');
            const { data: professionalsData } = await supabase.from('professionals').select('*');
            const { data: appointmentsData } = await supabase.from('appointments').select('*');
            const { data: productsData } = await supabase.from('products').select('*');
            const { data: transactionsData } = await supabase.from('transactions').select('*');
            const { data: clientsData } = await supabase.from('clients').select('*');

            // Reconstruct nested Salon objects
            if (salonsData) {
                const fullSalons: Salon[] = salonsData.map(s => ({
                    ...s,
                    services: servicesData?.filter(svc => svc.salon_id === s.id) || [],
                    professionals: professionalsData?.filter(p => p.salon_id === s.id) || [],
                    appointments: appointmentsData?.filter(a => a.salon_id === s.id) || [],
                    products: productsData?.filter(p => p.salon_id === s.id) || [],
                    transactions: transactionsData?.filter(t => t.salon_id === s.id) || [],
                    blockedPeriods: [],
                    allowClientCancellation: true // Default if column doesn't exist
                }));
                setSalons(fullSalons);
            }

            if (clientsData) {
                // Map back snake_case to camelCase
                const mappedClients = clientsData.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    phone: c.phone,
                    birthDate: c.birth_date
                }));
                setClients(mappedClients);
            }

            return true;
        } catch (error) {
            console.error("Supabase load error:", error);
            return false;
        }
    };

    // --- PERSISTENCE ---
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const connected = await loadDataFromSupabase();

            if (!connected) {
                // Fallback to LocalStorage if Supabase is not configured or fails
                const savedSalons = localStorage.getItem('salons');
                if (savedSalons) setSalons(JSON.parse(savedSalons));

                const savedPlans = localStorage.getItem('saasPlans');
                if (savedPlans) setSaasPlans(JSON.parse(savedPlans));

                const savedClients = localStorage.getItem('clients');
                if (savedClients) setClients(JSON.parse(savedClients));
            }
            setIsLoading(false);
        };
        init();
    }, []);

    // Sync to LocalStorage (Backup for Hybrid mode)
    useEffect(() => {
        if (!supabase) {
            localStorage.setItem('salons', JSON.stringify(salons));
            localStorage.setItem('saasPlans', JSON.stringify(saasPlans));
            localStorage.setItem('coupons', JSON.stringify(coupons));
            localStorage.setItem('clients', JSON.stringify(clients));
        }
    }, [salons, saasPlans, coupons, clients]);

    // --- ACTIONS ---

    const updateSalon = async (updatedSalon: Salon) => {
        // Optimistic Update
        setSalons(prev => prev.map(s => s.id === updatedSalon.id ? updatedSalon : s));

        if (supabase) {
            const { id, name, description, address, openTime, closeTime, coverImage, aboutUs, revenueGoal } = updatedSalon;
            await supabase.from('salons').update({
                name, description, address, open_time: openTime, close_time: closeTime, cover_image: coverImage, about_us: aboutUs, revenue_goal: revenueGoal
            }).eq('id', id);
        }
    };

    const createSalon = async (name: string, plan: PlanType, address: string, ownerName?: string, email?: string, password?: string, couponCode?: string) => {
        const selectedPlan = saasPlans.find(p => p.id === plan);
        let fee = selectedPlan?.price || 0;

        if (couponCode) {
            const coupon = coupons.find(c => c.code === couponCode && c.active);
            if (coupon) {
                fee = fee - ((fee * coupon.discountPercent) / 100);
            }
        }

        const newSalon: Salon = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            name,
            ownerEmail: email || `admin@${name.toLowerCase().replace(/\s+/g, '')}.com`,
            password: password || '123',
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            description: 'Novo salão.',
            plan,
            address: address, // Using passed address
            services: [],
            professionals: [],
            appointments: [],
            transactions: [],
            products: [],
            category: 'Salão',
            openTime: '09:00',
            closeTime: '18:00',
            slotInterval: 30,
            blockedPeriods: [],
            subscriptionStatus: 'trial',
            monthlyFee: fee,
            appliedCoupon: couponCode,
            nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString(),
            revenueGoal: 5000,
            allowClientCancellation: true
        };

        setSalons(prev => [...prev, newSalon]);

        if (supabase) {
            // Map to DB columns
            await supabase.from('salons').insert([{
                id: newSalon.id,
                created_at: newSalon.createdAt,
                name: newSalon.name,
                plan: newSalon.plan,
                address: newSalon.address,
                monthly_fee: newSalon.monthlyFee,
                subscription_status: 'trial',
                owner_email: newSalon.ownerEmail,
                password: newSalon.password
            }]);
        }
    };

    const addAppointment = async (salonId: string, appointment: Appointment) => {
        setSalons(prev => prev.map(s => {
            if (s.id === salonId) {
                let totalAmount = appointment.price;
                if (appointment.products) {
                    totalAmount += appointment.products.reduce((acc, p) => acc + (p.salePrice || 0), 0);
                }

                const newTransaction: Transaction = {
                    id: generateId(),
                    description: `Agendamento: ${appointment.clientName}`,
                    amount: totalAmount,
                    type: 'income',
                    date: appointment.date.split('T')[0],
                    category: 'Serviços',
                    paymentMethod: 'cash',
                    isAutoGenerated: true
                };

                return {
                    ...s,
                    appointments: [...s.appointments, { ...appointment, price: totalAmount }],
                    transactions: [...s.transactions, newTransaction]
                };
            }
            return s;
        }));

        if (supabase) {
            // Insert into appointments table
            await supabase.from('appointments').insert([{
                salon_id: salonId,
                client_name: appointment.clientName,
                client_phone: appointment.clientPhone,
                date: appointment.date,
                service_id: appointment.serviceId,
                professional_id: appointment.professionalId,
                price: appointment.price,
                status: 'scheduled',
                products: appointment.products // Stores JSONB for products
            }]);
        }
    };

    const cancelAppointment = (salonId: string, appointmentId: string) => {
        setSalons(prev => prev.map(s => {
            if (s.id === salonId) {
                return {
                    ...s,
                    appointments: s.appointments.map(a =>
                        a.id === appointmentId ? { ...a, status: 'cancelled' } : a
                    )
                };
            }
            return s;
        }));
        if (supabase) {
            supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appointmentId);
        }
    };

    const addProduct = async (salonId: string, product: Product) => {
        setSalons(prev => prev.map(s => {
            if (s.id === salonId) {
                return { ...s, products: [...s.products, product] };
            }
            return s;
        }));

        if (supabase) {
            await supabase.from('products').insert([{
                id: product.id, // Ensure UUID or let DB generate
                salon_id: salonId,
                name: product.name,
                quantity: product.quantity,
                sale_price: product.salePrice,
                cost_price: product.costPrice,
                is_for_sale: product.isForSale,
                image: product.image
            }]);
        }
    };

    const updateProduct = (salonId: string, productId: string, quantity: number) => {
        setSalons(prev => prev.map(s => {
            if (s.id === salonId) {
                return {
                    ...s,
                    products: s.products.map(p => p.id === productId ? { ...p, quantity } : p)
                };
            }
            return s;
        }));
        if (supabase) {
            supabase.from('products').update({ quantity }).eq('id', productId);
        }
    };

    const addBlockedPeriod = (salonId: string, blockedPeriod: BlockedPeriod) => {
        setSalons(prev => prev.map(s => {
            if (s.id === salonId) {
                return { ...s, blockedPeriods: [...(s.blockedPeriods || []), blockedPeriod] };
            }
            return s;
        }));
    };

    const saveClient = (client: Client) => {
        setClients(prev => {
            if (prev.some(c => c.phone === client.phone)) return prev;
            return [...prev, client];
        });
        if (supabase) {
            supabase.from('clients').insert([{
                id: client.id,
                name: client.name,
                phone: client.phone,
                birth_date: client.birthDate
            }]).then(r => {
                if (r.error) console.error("Client save error", r.error);
            });
        }
    };

    const getClientByPhone = (phone: string) => {
        return clients.find(c => c.phone === phone);
    };

    const addTransaction = (salonId: string, transaction: Transaction) => {
        setSalons(prev => prev.map(s => {
            if (s.id !== salonId) return s;
            return { ...s, transactions: [...s.transactions, transaction] };
        }));
        if (supabase) {
            supabase.from('transactions').insert([{
                salon_id: salonId,
                description: transaction.description,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                date: transaction.date,
                payment_method: transaction.paymentMethod
            }]);
        }
    };

    const updateSaaSPlan = (updatedPlan: SaaSPlan) => {
        setSaasPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    };

    const addSaaSPlan = (plan: SaaSPlan) => {
        setSaasPlans(prev => [...prev, plan]);
    };

    const deleteSaaSPlan = (planId: string) => {
        setSaasPlans(prev => prev.filter(p => p.id !== planId));
    };

    const createCoupon = (code: string, percent: number) => {
        setCoupons(prev => [...prev, {
            id: generateId(),
            code: code.toUpperCase(),
            discountPercent: percent,
            active: true,
            uses: 0
        }]);
    };

    const toggleSalonStatus = (salonId: string) => {
        setSalons(prev => prev.map(s => {
            if (s.id === salonId) {
                const newStatus = s.subscriptionStatus === 'active' ? 'late' : 'active';
                if (supabase) {
                    supabase.from('salons').update({ subscription_status: newStatus }).eq('id', salonId);
                }
                return {
                    ...s,
                    subscriptionStatus: newStatus
                };
            }
            return s;
        }));
    };

    const exemptSalon = (salonId: string) => {
        setSalons(prev => prev.map(s => {
            if (s.id === salonId) {
                const newStatus = s.subscriptionStatus === 'exempt' ? 'active' : 'exempt';
                if (supabase) {
                    supabase.from('salons').update({ subscription_status: newStatus }).eq('id', salonId);
                }
                return {
                    ...s,
                    subscriptionStatus: newStatus,
                    monthlyFee: newStatus === 'exempt' ? 0 : s.monthlyFee
                };
            }
            return s;
        }));
    };

    const addReview = (salonId: string, review: Review) => {
        setSalons(prev => prev.map(s => {
            if (s.id === salonId) {
                return { ...s, reviews: [...(s.reviews || []), review] };
            }
            return s;
        }));
        // Mock Supabase Sync
        if (supabase) {
            // supabase.from('reviews').insert(...) 
        }
    };

    return (
        <StoreContext.Provider value={{
            salons, saasPlans, coupons, clients, saasRevenueGoal, trialDays, currentSalonId,
            setCurrentSalonId, setTrialDays, updateSalon, addAppointment, createSalon,
            addBlockedPeriod, saveClient, getClientByPhone, cancelAppointment,
            addTransaction, updateSaaSPlan, addSaaSPlan, deleteSaaSPlan, createCoupon, toggleSalonStatus, exemptSalon,
            addProduct, updateProduct, addReview
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within StoreProvider");
    return context;
};
