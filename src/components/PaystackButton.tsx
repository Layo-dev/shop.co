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
  channels = ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
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
    channels: channels.length > 0 ? channels : ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
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
    
    // Enhanced debugging and CSS injection for Paystack modal
    const injectPaystackCSS = () => {
      // Remove any existing Paystack styles to avoid conflicts
      const existingStyle = document.getElementById('paystack-mobile-fix');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      const style = document.createElement('style');
      style.id = 'paystack-mobile-fix';
      style.textContent = `
        /* Paystack modal fixes */
        .paystack-modal, 
        [data-paystack-modal], 
        .paystack-form,
        .paystack-checkout,
        .paystack-checkout-modal {
          z-index: 9999 !important;
        }
        
        @media (max-width: 768px) {
          .paystack-modal, 
          [data-paystack-modal], 
          .paystack-form,
          .paystack-checkout,
          .paystack-checkout-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
          }
          
          /* Ensure payment method buttons are clickable */
          .paystack-modal button,
          .paystack-modal .payment-method,
          .paystack-modal [role="button"],
          .paystack-modal .btn,
          .paystack-modal input[type="button"],
          .paystack-modal input[type="submit"] {
            touch-action: manipulation !important;
            pointer-events: auto !important;
            z-index: 10000 !important;
            position: relative !important;
          }
          
          /* Fix for payment method selection */
          .paystack-modal .payment-option,
          .paystack-modal .channel-option,
          .paystack-modal .method-option {
            touch-action: manipulation !important;
            pointer-events: auto !important;
            cursor: pointer !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      console.log('Paystack mobile CSS injected');
    };
    
    // Inject CSS with multiple attempts to ensure it's applied
    setTimeout(injectPaystackCSS, 100);
    setTimeout(injectPaystackCSS, 500);
    setTimeout(injectPaystackCSS, 1000);
    
    // Add comprehensive debugging for Paystack modal
    const addPaystackDebugging = () => {
      // Wait for Paystack modal to be fully loaded
      const checkForPaystackModal = () => {
        const paystackModal = document.querySelector('.paystack-modal, [data-paystack-modal], .paystack-checkout, .paystack-form');
        if (paystackModal) {
          console.log('Paystack modal found:', paystackModal);
          
          // Add click event listeners to all buttons in the modal
          const buttons = paystackModal.querySelectorAll('button, [role="button"], .btn, input[type="button"], input[type="submit"], .payment-method, .payment-option, .channel-option, .method-option');
          console.log('Found buttons in Paystack modal:', buttons.length);
          
          buttons.forEach((button, index) => {
            console.log(`Button ${index}:`, button);
            
            // Add click event listener for debugging
            button.addEventListener('click', (e) => {
              console.log('Button clicked:', button, e);
            }, true);
            
            // Ensure button is clickable
            const buttonElement = button as HTMLElement;
            buttonElement.style.pointerEvents = 'auto';
            buttonElement.style.touchAction = 'manipulation';
            buttonElement.style.zIndex = '10000';
            buttonElement.style.position = 'relative';
          });
          
          // Add global click listener to catch any missed clicks
          paystackModal.addEventListener('click', (e) => {
            console.log('Click detected in Paystack modal:', e.target, e);
          }, true);
          
          return true;
        }
        return false;
      };
      
      // Check for modal with retries
      let attempts = 0;
      const maxAttempts = 20;
      const checkInterval = setInterval(() => {
        attempts++;
        if (checkForPaystackModal() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          if (attempts >= maxAttempts) {
            console.log('Paystack modal not found after', maxAttempts, 'attempts');
          }
        }
      }, 200);
    };
    
    // Start debugging after a delay
    setTimeout(addPaystackDebugging, 500);
    
    try {
      console.log('Attempting to initialize payment with config:', config);
      initializePayment({
        onSuccess: onSuccessCallback,
        onClose: onCloseCallback,
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      
      // Try fallback approach without channels
      try {
        console.log('Trying fallback payment initialization without channels');
        const fallbackConfig = {
          ...config,
          channels: ['card'] // Only card as fallback
        };
        
        const fallbackInitializePayment = usePaystackPayment(fallbackConfig);
        fallbackInitializePayment({
          onSuccess: onSuccessCallback,
          onClose: onCloseCallback,
        });
      } catch (fallbackError) {
        console.error('Fallback payment initialization also failed:', fallbackError);
        setIsLoading(false);
        // Remove mobile body class on error
        document.body.classList.remove('paystack-open');
        toast.error('Failed to initialize payment. Please try again.');
      }
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
