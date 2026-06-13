import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = "transition-all active:scale-[0.97] flex items-center justify-center";
  
  const variants = {
    primary: "w-full h-[58px] rounded-full bg-[#1C1C1E] text-white font-bold text-[14px] tracking-[0.2em] shadow-lg uppercase mt-2",
    secondary: "w-full h-[58px] rounded-full bg-white border border-gray-200 text-[#1C1C1E] font-bold text-[13px] tracking-widest shadow-sm uppercase mt-2",
    icon: "w-10 h-10 bg-white/50 backdrop-blur-md rounded-full border border-white shadow-sm text-[#1C1C1E]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}