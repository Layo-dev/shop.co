import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

type Bearer = 'account' | 'subaccount';

interface PaystackButtonProps {
  amount: number; // Amount in kobo (smallest currency unit)
  email: string;
  publicKey: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
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
  disabled = false,
  className = '',
  children,
  metadata = {},
  currency = 'NGN',
  plan,
  quantity,
  channels = ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
  split_code,
  subaccount,
  transaction_charge,
  bearer = 'account' as const,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo
    publicKey,
    currency,
    channels,
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
    ...(plan && { plan }),
    ...(quantity && { quantity }),
    ...(split_code && { split_code }),
    ...(subaccount && { subaccount }),
    ...(transaction_charge && { transaction_charge }),
    ...(bearer && { bearer }),
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccessCallback = (reference: string) => {
    setIsLoading(false);
    toast.success('Payment successful!', {
      description: `Transaction reference: ${reference}`,
    });
    onSuccess?.(reference);
  };

  const onCloseCallback = () => {
    setIsLoading(false);
    toast.error('Payment cancelled');
    onClose?.();
  };

  const handlePayment = () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    initializePayment({
      onSuccess: onSuccessCallback,
      onClose: onCloseCallback,
    });
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
          {children || `Pay ₦${(amount / 100).toLocaleString()}`}
        </>
      )}
    </Button>
  );
};

export default PaystackButton;
