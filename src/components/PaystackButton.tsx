import React, { useState, useEffect } from 'react';
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

  // Cleanup effect to remove body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('paystack-open');
    };
  }, []);

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo
    publicKey,
    currency,
    channels: channels.length > 0 ? channels : ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
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
    // Remove mobile body class
    document.body.classList.remove('paystack-open');
    toast.success('Payment successful!', {
      description: `Transaction reference: ${reference}`,
    });
    onSuccess?.(reference);
  };

  const onCloseCallback = () => {
    setIsLoading(false);
    // Remove mobile body class
    document.body.classList.remove('paystack-open');
    toast.error('Payment cancelled');
    onClose?.();
  };

  const handlePayment = () => {
    if (disabled || isLoading) return;
    
    // Validate required fields
    if (!publicKey) {
      toast.error('Payment configuration error: Missing public key');
      return;
    }
    
    if (!email) {
      toast.error('Payment configuration error: Missing email address');
      return;
    }
    
    if (amount <= 0) {
      toast.error('Payment configuration error: Invalid amount');
      return;
    }
    
    console.log('Initializing Paystack payment with config:', {
      ...config,
      publicKey: publicKey.substring(0, 10) + '...', // Log partial key for security
    });
    
    setIsLoading(true);
    
    // Add mobile body class to prevent scroll issues
    document.body.classList.add('paystack-open');
    
    // Inject CSS fixes for Paystack modal on mobile
    const injectPaystackCSS = () => {
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          .paystack-modal, [data-paystack-modal], .paystack-form {
            z-index: 9999 !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
          .paystack-modal *, [data-paystack-modal] * {
            touch-action: manipulation !important;
          }
        }
      `;
      document.head.appendChild(style);
    };
    
    // Inject CSS after a short delay to ensure Paystack modal is loaded
    setTimeout(injectPaystackCSS, 100);
    
    try {
      initializePayment({
        onSuccess: onSuccessCallback,
        onClose: onCloseCallback,
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      setIsLoading(false);
      // Remove mobile body class on error
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
          {children || `Pay ₦${(amount / 100).toLocaleString()}`}
        </>
      )}
    </Button>
  );
};

export default PaystackButton;
