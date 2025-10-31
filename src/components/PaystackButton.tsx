import React, { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

type Bearer = 'account' | 'subaccount';

interface PaystackButtonProps {
  amount: number; // Amount in Naira
  email: string;
  publicKey: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
  onBeforeOpen?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  metadata?: Record<string, any>;
  currency?: string;
  plan?: string;
  quantity?: number;
  channels?: string[];
  split_code?: string;
  subaccount?: string;
  transaction_charge?: number;
  bearer?: Bearer;
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
  amount,
  email,
  publicKey,
  onSuccess,
  onClose,
  onBeforeOpen,
  disabled = false,
  className = '',
  children,
  metadata = {},
  currency = 'NGN',
  plan,
  quantity,
  channels = ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
  split_code,
  subaccount,
  transaction_charge,
  bearer = 'account' as const,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup effect to remove body class and styles on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('paystack-open');
      const nuclearStyle = document.getElementById('nuclear-paystack-fix');
      if (nuclearStyle) nuclearStyle.remove();
      const paystackStyle = document.getElementById('paystack-mobile-fix');
      if (paystackStyle) paystackStyle.remove();
    };
  }, []);
  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo
    publicKey,
    currency,
    channels: channels && channels.length > 0 ? channels : ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
    metadata: {
      custom_fields: [
        {
          display_name: 'Payment for',
          variable_name: 'payment_for',
          value: 'Glassify Store',
        },
        ...Object.entries(metadata).map(([key, value]) => ({
          display_name: key,
          variable_name: key,
          value: value.toString(),
        })),
      ],
    },
    // Only include optional parameters if they have valid values
    ...(plan && { plan }),
    ...(quantity && quantity > 0 && { quantity }),
    ...(split_code && { split_code }),
    ...(subaccount && { subaccount }),
    ...(transaction_charge && transaction_charge > 0 && { transaction_charge }),
    ...(bearer && { bearer }),
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccessCallback = (reference: string) => {
    setIsLoading(false);
    document.body.classList.remove('paystack-open');
    const nuclearStyle = document.getElementById('nuclear-paystack-fix');
    if (nuclearStyle) nuclearStyle.remove();
    const paystackStyle = document.getElementById('paystack-mobile-fix');
    if (paystackStyle) paystackStyle.remove();
    toast.success('Payment successful!', {
      description: `Transaction reference: ${reference}`,
    });
    onSuccess?.(reference);
  };

  const onCloseCallback = () => {
    setIsLoading(false);
    document.body.classList.remove('paystack-open');
    const nuclearStyle = document.getElementById('nuclear-paystack-fix');
    if (nuclearStyle) nuclearStyle.remove();
    const paystackStyle = document.getElementById('paystack-mobile-fix');
    if (paystackStyle) paystackStyle.remove();
    toast.error('Payment cancelled');
    onClose?.();
  };

  const handlePayment = () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    
    // Add mobile body class to prevent scroll issues
    document.body.classList.add('paystack-open');

    try {
      // Allow parent (e.g., Sheet) to close before Paystack mounts its overlay
      onBeforeOpen?.();
      setTimeout(() => {
        initializePayment({
          onSuccess: onSuccessCallback,
          onClose: onCloseCallback,
        });
      }, 100);
    } catch (error) {
      setIsLoading(false);
      document.body.classList.remove('paystack-open');
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`relative ${className}`}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || `Pay ₦${amount.toLocaleString()}`}
        </>
      )}
    </Button>
  );
};

export default PaystackButton;
