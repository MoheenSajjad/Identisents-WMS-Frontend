import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/utils/helpers";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  duration = 5000,
  action,
  onClose,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  // Auto-dismiss functionality
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200); // Animation duration
  };

  if (!isVisible) return null;

  // Icon mapping
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];

  // Color classes
  const colorClasses = {
    success: {
      container: "bg-green-50 border-green-200",
      icon: "text-green-400",
      title: "text-green-800",
      message: "text-green-700",
    },
    error: {
      container: "bg-red-50 border-red-200",
      icon: "text-red-400",
      title: "text-red-800",
      message: "text-red-700",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-400",
      title: "text-yellow-800",
      message: "text-yellow-700",
    },
    info: {
      container: "bg-blue-50 border-blue-200",
      icon: "text-blue-400",
      title: "text-blue-800",
      message: "text-blue-700",
    },
  };

  const colors = colorClasses[type];

  return (
    <div
      className={cn(
        "max-w-md w-full border rounded-lg shadow-lg pointer-events-auto transition-all duration-200",
        colors.container,
        isLeaving ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0",
        "animate-slide-in-down",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={cn("h-5 w-5", colors.icon)} />
          </div>

          {/* Content */}
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={cn("text-sm font-medium", colors.title)}>{title}</p>
            )}
            <p className={cn("text-sm", title ? "mt-1" : "", colors.message)}>
              {message}
            </p>

            {/* Action button */}
            {action && (
              <div className="mt-3">
                {/* <Button
                  variant="link"
                  size="sm"
                  onClick={action.onClick}
                  className={cn("p-0 h-auto", colors.title)}
                >
                  {action.label}
                </Button> */}
              </div>
            )}
          </div>

          {/* Close button */}
          <div className="ml-4 flex-shrink-0 flex">
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className={cn(
                "p-1 h-auto rounded-md transition-colors",
                colors.message,
                "hover:bg-white/20"
              )}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </div>
      </div>

      {/* Progress bar for timed toasts */}
      {duration > 0 && (
        <div className="h-1 bg-black/10 rounded-b-lg overflow-hidden">
          <div
            className={cn(
              "h-full transition-all ease-linear",
              type === "success" && "bg-green-400",
              type === "error" && "bg-red-400",
              type === "warning" && "bg-yellow-400",
              type === "info" && "bg-blue-400"
            )}
            style={{
              width: "100%",
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};
