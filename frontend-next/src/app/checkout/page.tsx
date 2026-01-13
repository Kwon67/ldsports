'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CartItem } from '@/types';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cep: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    cep: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitInfo = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async (): Promise<void> => {
    if (!paymentMethod) {
      alert('Selecione uma forma de pagamento');
      return;
    }

    setLoading(true);

    const orderDetails = items
      .map(
        (item: CartItem) =>
          `👕 *${item.name}*\n  Tam: ${item.size} | Qtd: ${item.quantity} | R$ ${item.price.toFixed(2)}\n  🖼️ Foto: ${item.image || 'N/A'}`
      )
      .join('\n\n');

    const totalFinal = paymentMethod === 'pix' ? total * 0.9 : total;
    const paymentLabel = paymentMethod === 'pix' ? 'PIX (10% OFF)' : 'Dinheiro (Na Entrega)';

    const message =
      `*🛒 NOVO PEDIDO - LD SPORTS*\n` +
      `--------------------------------\n` +
      `*CLIENTE:* ${formData.name}\n` +
      `*TEL:* ${formData.phone}\n` +
      `*END:* ${formData.address}, ${formData.city} - ${formData.cep}\n\n` +
      `*PRODUTOS:*\n${orderDetails}\n\n` +
      `*FORMA DE PAGAMENTO:* ${paymentLabel}\n` +
      `*VALOR TOTAL:* R$ ${totalFinal.toFixed(2)}\n` +
      `--------------------------------\n` +
      `_Pedido gerado via site LDSports_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5582982105170?text=${encodedMessage}`;

    await new Promise(r => setTimeout(r, 1000));

    const newOrderNumber = Date.now().toString(36).toUpperCase().slice(-9);
    setOrderNumber(newOrderNumber);

    window.open(whatsappUrl, '_blank');

    setLoading(false);
    setStep(3);
    clearCart();
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50 },
  };

  const paymentMethods: PaymentMethod[] = [
    { id: 'pix', name: 'PIX', icon: '⚡', desc: 'Pagamento instantâneo' },
    { id: 'money', name: 'Dinheiro', icon: '💵', desc: 'Pagar na entrega do pedido' },
  ];

  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Carrinho vazio</h2>
          <p className="text-gray-500 mb-6">Adicione produtos para continuar</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="bg-black text-white px-8 py-3 font-bold uppercase"
          >
            Voltar às Compras
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-black text-xl">
            LD<span className="text-yellow-500">SPORTS</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center">
                <motion.div
                  animate={{
                    backgroundColor: step >= s ? '#000' : '#e5e7eb',
                    color: step >= s ? '#fff' : '#9ca3af',
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                >
                  {s === 3 && step === 3 ? '✓' : s}
                </motion.div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-black' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-xl font-bold mb-6">Informações de Entrega</h2>
                  <form onSubmit={handleSubmitInfo} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Nome completo</label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">E-mail</label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Telefone</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Endereço</label>
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Cidade</label>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">CEP</label>
                        <input
                          name="cep"
                          value={formData.cep}
                          onChange={handleInputChange}
                          required
                          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-black text-white py-4 font-bold uppercase mt-6"
                    >
                      Continuar para Pagamento
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setStep(1)} className="text-gray-400 hover:text-black">
                      ← Voltar
                    </button>
                    <h2 className="text-xl font-bold">Forma de Pagamento</h2>
                  </div>

                  <div className="space-y-3">
                    {paymentMethods.map(method => (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                          paymentMethod === method.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-3xl">{method.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 ${
                            paymentMethod === method.id
                              ? 'border-black bg-black'
                              : 'border-gray-300'
                          }`}
                        >
                          {paymentMethod === method.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full flex items-center justify-center text-white text-xs"
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {paymentMethod === 'pix' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
                    >
                      <p className="text-sm text-green-800">
                        🎉 <strong>10% de desconto</strong> no pagamento via PIX!
                      </p>
                    </motion.div>
                  )}

                  <motion.button
                    onClick={handlePayment}
                    disabled={loading || !paymentMethod}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full bg-black text-white py-4 font-bold uppercase mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Processando...
                      </>
                    ) : (
                      `Pagar R$ ${(paymentMethod === 'pix' ? total * 0.9 : total).toFixed(2)}`
                    )}
                  </motion.button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-8 shadow-sm text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <span className="text-4xl text-white">✓</span>
                  </motion.div>

                  <h2 className="text-2xl font-bold mb-2">Pedido Confirmado!</h2>
                  <p className="text-gray-500 mb-6">
                    Obrigado pela sua compra. Você receberá um e-mail com os detalhes.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600">Número do pedido</p>
                    <p className="text-xl font-bold font-mono">#{orderNumber}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/')}
                    className="bg-black text-white px-8 py-3 font-bold uppercase"
                  >
                    Continuar Comprando
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step !== 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-20"
            >
              <h3 className="font-bold mb-4">Resumo do Pedido</h3>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">👕</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Tam: {item.size} • Qtd: {item.quantity}
                      </p>
                      <p className="text-sm font-bold">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                {paymentMethod === 'pix' && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto PIX (10%)</span>
                    <span>-R$ {(total * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>R$ {(paymentMethod === 'pix' ? total * 0.9 : total).toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
