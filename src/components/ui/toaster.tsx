import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

const getToastIcon = (variant?: string) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "destructive":
      return <XCircle className="h-5 w-5 text-red-600" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-600" />
    case "info":
      return <Info className="h-5 w-5 text-blue-600" />
    default:
      return null
  }
}

const iconContainerStyles: Record<string, string> = {
  success: "bg-green-100",
  destructive: "bg-red-100",
  warning: "bg-amber-100",
  info: "bg-blue-100",
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            {variant && variant !== "default" && (
              <div className={`flex-shrink-0 rounded-full p-2 ${iconContainerStyles[variant] || ""}`}>
                {getToastIcon(variant)}
              </div>
            )}
            <div className="flex-1 grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
