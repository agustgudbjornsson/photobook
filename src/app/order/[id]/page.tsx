'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAlbum, createOrder } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ChevronLeft,
    ChevronRight,
    Check,
    Truck,
    CreditCard,
    Box,
    Store,
    Layout
} from 'lucide-react';

export default function OrderPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [album, setAlbum] = useState<any>(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [orderData, setOrderData] = useState({
        paperStyle: 'Glossy',
        deliveryMethod: 'postbox',
        customerName: '',
        address: '',
        city: '',
        zipCode: '',
        country: 'Iceland',
    });

    useEffect(() => {
        async function load() {
            const data = await getAlbum(id);
            if (data) setAlbum(data);
            setLoading(false);
        }
        load();
    }, [id]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setSubmitting(true);
        const res = await createOrder({
            albumId: id,
            ...orderData,
            totalAmount: 49.99 // Mock price
        });
        if (res.success) {
            router.push('/dashboard?ordered=true');
        } else {
            alert('Error placing order');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading order details...</div>;
    if (!album) return <div className="p-8 text-center">Album not found.</div>;

    const steps = [
        { id: 1, title: 'Paper Style', icon: <Box size={18} /> },
        { id: 2, title: 'Delivery Info', icon: <Truck size={18} /> },
        { id: 3, title: 'Payment', icon: <CreditCard size={18} /> },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href={`/editor/${id}`} style={{ color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                        <ChevronLeft size={16} /> Back to Editor
                    </Link>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Order Print</h1>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0' }}>{album.title}</p>
                </div>
                <div style={{ width: '100px' }}></div>
            </header>

            {/* Progress Bar */}
            <div style={{ maxWidth: '600px', margin: '2rem auto', width: '100%', padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#222', zIndex: 0, transform: 'translateY(-50%)' }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                        height: '2px',
                        background: 'var(--primary)',
                        zIndex: 1,
                        transform: 'translateY(-50%)',
                        transition: 'width 0.3s ease'
                    }} />

                    {steps.map((s) => (
                        <div key={s.id} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: step >= s.id ? 'var(--primary)' : '#222',
                                color: step >= s.id ? 'white' : '#444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                border: step === s.id ? '2px solid white' : 'none'
                            }}>
                                {step > s.id ? <Check size={18} /> : s.icon}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: step >= s.id ? 'white' : '#444', fontWeight: step === s.id ? '600' : '400' }}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <main style={{ flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0 1rem 4rem' }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
                        >
                            <div
                                onClick={() => setOrderData(prev => ({ ...prev, paperStyle: 'Glossy' }))}
                                style={{
                                    background: '#111',
                                    border: `2px solid ${orderData.paperStyle === 'Glossy' ? 'var(--primary)' : '#222'}`,
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{ aspectRatio: '4/3', background: 'linear-gradient(45deg, #333, #555)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}>✨</span>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Premium Glossy</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Vibrant colors and high shine. Perfect for photography.</p>
                                </div>
                                {orderData.paperStyle === 'Glossy' && (
                                    <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        <Check size={16} /> Selected
                                    </div>
                                )}
                            </div>

                            <div
                                onClick={() => setOrderData(prev => ({ ...prev, paperStyle: 'Matt' }))}
                                style={{
                                    background: '#111',
                                    border: `2px solid ${orderData.paperStyle === 'Matt' ? 'var(--primary)' : '#222'}`,
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{ aspectRatio: '4/3', background: 'linear-gradient(45deg, #222, #444)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '2rem', opacity: 0.7 }}>📄</span>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Classic Matt</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Deep colors and zero glare. Sophisticated feel.</p>
                                </div>
                                {orderData.paperStyle === 'Matt' && (
                                    <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        <Check size={16} /> Selected
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222' }}
                        >
                            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Where should we send your photobook?</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div
                                    onClick={() => setOrderData(prev => ({ ...prev, deliveryMethod: 'postbox' }))}
                                    style={{
                                        padding: '1rem',
                                        background: orderData.deliveryMethod === 'postbox' ? '#1a1a1a' : 'transparent',
                                        border: `1px solid ${orderData.deliveryMethod === 'postbox' ? 'var(--primary)' : '#333'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    <Truck size={20} color={orderData.deliveryMethod === 'postbox' ? 'var(--primary)' : '#666'} />
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Direct to Postbox</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Standard delivery (3-5 days)</div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setOrderData(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
                                    style={{
                                        padding: '1rem',
                                        background: orderData.deliveryMethod === 'pickup' ? '#1a1a1a' : 'transparent',
                                        border: `1px solid ${orderData.deliveryMethod === 'pickup' ? 'var(--primary)' : '#333'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    <Store size={20} color={orderData.deliveryMethod === 'pickup' ? 'var(--primary)' : '#666'} />
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Local Pickup</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Ready in 24 hours</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={orderData.customerName}
                                        onChange={(e) => setOrderData(prev => ({ ...prev, customerName: e.target.value }))}
                                        placeholder="John Doe"
                                        style={{ width: '100%', padding: '0.75rem', background: '#222', border: '1px solid #333', borderRadius: '4px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Street Address</label>
                                    <input
                                        type="text"
                                        value={orderData.address}
                                        onChange={(e) => setOrderData(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder="123 Creative Way"
                                        style={{ width: '100%', padding: '0.75rem', background: '#222', border: '1px solid #333', borderRadius: '4px', color: 'white' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>City</label>
                                        <input
                                            type="text"
                                            value={orderData.city}
                                            onChange={(e) => setOrderData(prev => ({ ...prev, city: e.target.value }))}
                                            placeholder="Reykjavík"
                                            style={{ width: '100%', padding: '0.75rem', background: '#222', border: '1px solid #333', borderRadius: '4px', color: 'white' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Zip Code</label>
                                        <input
                                            type="text"
                                            value={orderData.zipCode}
                                            onChange={(e) => setOrderData(prev => ({ ...prev, zipCode: e.target.value }))}
                                            placeholder="101"
                                            style={{ width: '100%', padding: '0.75rem', background: '#222', border: '1px solid #333', borderRadius: '4px', color: 'white' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222' }}
                        >
                            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Select Payment Method</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{
                                    padding: '1.5rem',
                                    background: '#1a1a1a',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <CreditCard size={24} color="var(--primary)" />
                                        <div>
                                            <div style={{ fontWeight: '600' }}>Stripe Checkout</div>
                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Visa, MasterCard, Amex</div>
                                        </div>
                                    </div>
                                    <Check size={20} color="var(--primary)" />
                                </div>

                                <div style={{
                                    padding: '1.5rem',
                                    background: 'transparent',
                                    border: '1px solid #333',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    opacity: 0.5
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>🅿️</span>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>PayPal</div>
                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Pay with your PayPal balance</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#666' }}>Photobook ({album.format.name})</span>
                                    <span>$39.99</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <span style={{ color: '#666' }}>Shipping ({orderData.deliveryMethod})</span>
                                    <span>$10.00</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    <span>Total</span>
                                    <span>$49.99</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Buttons */}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                    {step > 1 ? (
                        <button onClick={handleBack} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ChevronLeft size={18} /> Back
                        </button>
                    ) : <div />}

                    {step < steps.length ? (
                        <button
                            onClick={handleNext}
                            className="btn btn-primary"
                            disabled={step === 2 && (!orderData.customerName || !orderData.address)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            Continue <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            disabled={submitting}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 2rem' }}
                        >
                            {submitting ? 'Placing Order...' : <>Complete Purchase <Check size={18} /></>}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
