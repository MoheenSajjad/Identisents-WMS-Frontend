import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { CheckCircle, AlertCircle, Info, XCircle, X as CloseIcon } from 'lucide-react';

export type AlertStatus = 'success' | 'error' | 'info' | 'warning';

export interface AlertProps {
  status?: AlertStatus;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-green-700',
    bg: 'bg-green-50',
  },
  error: {
    icon: XCircle,
    color: 'bg-red-500',
    border: 'border-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
  },
  warning: {
    icon: AlertCircle,
    color: 'bg-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
    bg: 'bg-yellow-50',
  },
  info: {
    icon: Info,
    color: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
  },
};

export const Alert = ({
  status = 'info',
  title,
  message,
  duration = 2800,
  onClose,
  className,
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => setIsVisible(false), duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={cn(
            'fixed top-4 right-4 z-[60] max-w-md overflow-hidden rounded-lg border p-4 shadow-sm',
            config.bg,
            config.border,
            className
          )}
        >
          {/* Progress Bar with Framer Motion */}
          <motion.div
            className={cn('absolute top-0 left-0 h-1', config.color)}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />

          <div className="flex items-start gap-3">
            <Icon className={cn('mt-0.5 h-5 w-5', config.text)} />

            <div className="flex-1">
              <h4 className={cn('mb-1 text-sm font-medium', config.text)}>{title}</h4>
              {message && <p className={cn('text-sm', config.text)}>{message}</p>}
            </div>

            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 400);
              }}
              className={cn('opacity-70 transition-opacity hover:opacity-100', config.text)}
            >
              <CloseIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// custom compnenet without framer motion

// import { useEffect, useState, useRef } from "react";
// import { cn } from "@/lib/utils";
// import {
//   CheckCircle,
//   AlertCircle,
//   Info,
//   XCircle,
//   X as CloseIcon,
// } from "lucide-react";

// export type AlertStatus = "success" | "error" | "info" | "warning";

// export interface AlertProps {
//   status?: AlertStatus;
//   title: string;
//   message?: string;
//   duration?: number;
//   onClose?: () => void;
//   className?: string;
// }

// const statusConfig = {
//   success: {
//     icon: CheckCircle,
//     color: "bg-green-500",
//     border: "border-green-500",
//     text: "text-green-700",
//     bg: "bg-green-50",
//   },
//   error: {
//     icon: XCircle,
//     color: "bg-red-500",
//     border: "border-red-500",
//     text: "text-red-700",
//     bg: "bg-red-50",
//   },
//   warning: {
//     icon: AlertCircle,
//     color: "bg-yellow-500",
//     border: "border-yellow-500",
//     text: "text-yellow-700",
//     bg: "bg-yellow-50",
//   },
//   info: {
//     icon: Info,
//     color: "bg-blue-500",
//     border: "border-blue-500",
//     text: "text-blue-700",
//     bg: "bg-blue-50",
//   },
// };

// export const Alert = ({
//   status = "info",
//   title,
//   message,
//   duration = 2800,
//   onClose,
//   className,
// }: AlertProps) => {
//   const [isVisible, setIsVisible] = useState(true);
//   const [progress, setProgress] = useState(100);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const config = statusConfig[status];
//   const Icon = config.icon;

//   useEffect(() => {
//     if (!duration) return;

//     const interval = 50; // Update every 50ms for smooth progress
//     const step = (interval / duration) * 100;

//     timerRef.current = setInterval(() => {
//       setProgress((prev) => {
//         const newProgress = prev - step;
//         if (newProgress <= 0) {
//           clearInterval(timerRef.current!);
//           setIsVisible(false);
//           onClose?.();
//           return 0;
//         }
//         return newProgress;
//       });
//     }, interval);

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [duration, onClose]);

//   if (!isVisible) return null;

//   return (
//     <div
//       className={cn(
//         "fixed top-4 right-2 z-[60] overflow-hidden rounded-lg border p-4 max-w-md shadow-sm",
//         config.bg,
//         config.border,
//         className
//       )}
//     >
//       {/* Progress Bar */}
//       <div
//         className={cn("absolute top-0 left-0 h-1", config.color)}
//         style={{ width: `${progress}%`, transition: "width 50ms linear" }}
//       />

//       <div className="flex items-start gap-3">
//         <Icon className={cn("h-5 w-5 mt-0.5", config.text)} />

//         <div className="flex-1">
//           <h4 className={cn("text-sm font-medium mb-1", config.text)}>
//             {title}
//           </h4>
//           <p className={cn("text-sm", config.text)}>{message}</p>
//         </div>

//         <button
//           onClick={() => {
//             setIsVisible(false);
//             if (timerRef.current) clearInterval(timerRef.current);
//             onClose?.();
//           }}
//           className={cn(
//             "opacity-70 hover:opacity-100 transition-opacity",
//             config.text
//           )}
//         >
//           <CloseIcon className="h-4 w-4" />
//           <span className="sr-only">Close</span>
//         </button>
//       </div>
//     </div>
//   );
// };
