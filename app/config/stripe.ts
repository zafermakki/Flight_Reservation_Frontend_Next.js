// تكوين Stripe للاختبار
export const STRIPE_CONFIG = {
  // مفتاح عام وهمي للاختبار
  publishableKey: 'pk_test_51RuFTr62sqNfqvYPPGVPR39QLcocUJ87IHx93hUEucBoziacZm4OLezY42u6qJ0qS2OdLaTiCGuZ6U43yBE1cUmV00bsp9qeWx',
  
  
  // إعدادات الدفع
  paymentSettings: {
    currency: 'usd',
    paymentMethodTypes: ['card'],
    mode: 'payment'
  }
};

// دوال مساعدة للدفع
export const calculateStripeAmount = (amount: number): number => {
  // Stripe يتعامل بالسنتات
  return Math.round(amount * 100);
};

export const formatStripeAmount = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`;
};
