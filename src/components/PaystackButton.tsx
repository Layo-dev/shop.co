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

  // Cleanup effect to remove body class and styles on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('paystack-open');
      // Clean up any injected styles
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
    // Clean up nuclear styles
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
    // Remove mobile body class
    document.body.classList.remove('paystack-open');
    // Clean up nuclear styles
    const nuclearStyle = document.getElementById('nuclear-paystack-fix');
    if (nuclearStyle) nuclearStyle.remove();
    const paystackStyle = document.getElementById('paystack-mobile-fix');
    if (paystackStyle) paystackStyle.remove();
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
    
    // Aggressive CSS injection to force Paystack modal to be interactive
    const injectPaystackCSS = () => {
      // Remove any existing Paystack styles to avoid conflicts
      const existingStyle = document.getElementById('paystack-mobile-fix');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      const style = document.createElement('style');
      style.id = 'paystack-mobile-fix';
      style.textContent = `
        /* Force all Paystack elements to be interactive */
        .paystack-modal, 
        [data-paystack-modal], 
        .paystack-form,
        .paystack-checkout,
        .paystack-checkout-modal,
        iframe[src*="paystack"],
        .paystack-iframe {
          z-index: 99999 !important;
          pointer-events: auto !important;
        }
        
        /* Remove any blocking overlays */
        .paystack-modal::before,
        .paystack-modal::after,
        [data-paystack-modal]::before,
        [data-paystack-modal]::after {
          display: none !important;
        }
        
        /* Force all buttons and interactive elements to work */
        .paystack-modal *,
        [data-paystack-modal] *,
        iframe[src*="paystack"] * {
          pointer-events: auto !important;
          touch-action: manipulation !important;
          z-index: 100000 !important;
        }
        
        /* Specific fixes for mobile */
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
            z-index: 99999 !important;
            pointer-events: auto !important;
          }
          
          /* Force iframe to be interactive */
          iframe[src*="paystack"] {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 99999 !important;
            pointer-events: auto !important;
            border: none !important;
          }
          
          /* Override any blocking styles */
          .paystack-modal button,
          .paystack-modal .payment-method,
          .paystack-modal [role="button"],
          .paystack-modal .btn,
          .paystack-modal input[type="button"],
          .paystack-modal input[type="submit"],
          .paystack-modal .payment-option,
          .paystack-modal .channel-option,
          .paystack-modal .method-option,
          .paystack-modal a,
          .paystack-modal div[onclick] {
            touch-action: manipulation !important;
            pointer-events: auto !important;
            z-index: 100000 !important;
            position: relative !important;
            cursor: pointer !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      console.log('Aggressive Paystack mobile CSS injected');
    };
    
    // Inject CSS with multiple attempts to ensure it's applied
    setTimeout(injectPaystackCSS, 100);
    setTimeout(injectPaystackCSS, 500);
    setTimeout(injectPaystackCSS, 1000);
    
    // Aggressive DOM manipulation to force Paystack modal to be interactive
    const forcePaystackInteractive = () => {
      // Wait for Paystack modal to be fully loaded
      const checkForPaystackModal = () => {
        const paystackModal = document.querySelector('.paystack-modal, [data-paystack-modal], .paystack-checkout, .paystack-form, iframe[src*="paystack"]');
        if (paystackModal) {
          console.log('Paystack modal found:', paystackModal);
          
          // Remove any blocking overlays or elements
          const blockingElements = document.querySelectorAll('[style*="pointer-events: none"], [style*="z-index"], .overlay, .backdrop');
          blockingElements.forEach(element => {
            const el = element as HTMLElement;
            if (el.style.zIndex && parseInt(el.style.zIndex) < 99999) {
              console.log('Removing blocking element:', el);
              el.style.display = 'none';
            }
          });
          
          // Force the modal to be interactive
          const modalElement = paystackModal as HTMLElement;
          modalElement.style.pointerEvents = 'auto';
          modalElement.style.zIndex = '99999';
          modalElement.style.position = 'fixed';
          modalElement.style.top = '0';
          modalElement.style.left = '0';
          modalElement.style.width = '100vw';
          modalElement.style.height = '100vh';
          
          // Find and force all interactive elements
          const allElements = paystackModal.querySelectorAll('*');
          console.log('Found elements in Paystack modal:', allElements.length);
          
          allElements.forEach((element, index) => {
            const el = element as HTMLElement;
            
            // Force all elements to be interactive
            el.style.pointerEvents = 'auto';
            el.style.touchAction = 'manipulation';
            el.style.zIndex = '100000';
            
            // If it's a button or clickable element, make sure it's visible and clickable
            if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || el.onclick || el.getAttribute('onclick')) {
              el.style.cursor = 'pointer';
              el.style.opacity = '1';
              el.style.visibility = 'visible';
              el.style.display = 'block';
              
              console.log(`Making element ${index} clickable:`, el);
              
              // Add click event listener for debugging
              el.addEventListener('click', (e) => {
                console.log('Element clicked:', el, e);
              }, true);
            }
          });
          
          // Add global click listener to catch any missed clicks
          paystackModal.addEventListener('click', (e) => {
            console.log('Click detected in Paystack modal:', e.target, e);
          }, true);
          
          // Force iframe to be interactive if it exists
          const iframe = paystackModal.querySelector('iframe');
          if (iframe) {
            console.log('Found iframe, making it interactive');
            const iframeElement = iframe as HTMLIFrameElement;
            iframeElement.style.pointerEvents = 'auto';
            iframeElement.style.zIndex = '99999';
            iframeElement.style.position = 'fixed';
            iframeElement.style.top = '0';
            iframeElement.style.left = '0';
            iframeElement.style.width = '100vw';
            iframeElement.style.height = '100vh';
            iframeElement.style.border = 'none';
          }
          
          return true;
        }
        return false;
      };
      
      // Check for modal with retries
      let attempts = 0;
      const maxAttempts = 30;
      const checkInterval = setInterval(() => {
        attempts++;
        if (checkForPaystackModal() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          if (attempts >= maxAttempts) {
            console.log('Paystack modal not found after', maxAttempts, 'attempts');
          }
        }
      }, 100);
    };
    
    // Start aggressive DOM manipulation after a delay
    setTimeout(forcePaystackInteractive, 500);
    
    // Nuclear option - force everything to be clickable
    const nuclearOption = () => {
      console.log('Applying nuclear option - forcing all elements to be clickable');
      
      // Override ALL styles that might block interactions
      const nuclearStyle = document.createElement('style');
      nuclearStyle.id = 'nuclear-paystack-fix';
      nuclearStyle.textContent = `
        * {
          pointer-events: auto !important;
          touch-action: manipulation !important;
        }
        
        .paystack-modal *,
        [data-paystack-modal] *,
        iframe[src*="paystack"] *,
        iframe[src*="paystack"] {
          pointer-events: auto !important;
          touch-action: manipulation !important;
          z-index: 999999 !important;
          position: relative !important;
        }
        
        /* Force all buttons to be clickable */
        button, [role="button"], .btn, input[type="button"], input[type="submit"] {
          pointer-events: auto !important;
          touch-action: manipulation !important;
          cursor: pointer !important;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
          z-index: 999999 !important;
        }
      `;
      document.head.appendChild(nuclearStyle);
      
      // Remove any existing nuclear style
      const existingNuclear = document.getElementById('nuclear-paystack-fix');
      if (existingNuclear && existingNuclear !== nuclearStyle) {
        existingNuclear.remove();
      }
    };
    
    // Apply nuclear option with multiple attempts
    setTimeout(nuclearOption, 200);
    setTimeout(nuclearOption, 1000);
    setTimeout(nuclearOption, 2000);
    
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
