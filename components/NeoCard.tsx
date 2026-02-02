import React from 'react';

interface NeoCardProps {
    children: React.ReactNode;
    className?: string;
    bgColor?: string;
    onClick?: () => void;
    title?: string;
    variant?: 'standard' | 'playful';
    animateOnHover?: boolean;
}

const NeoCard: React.FC<NeoCardProps> = ({
    children,
    className = '',
    bgColor = 'bg-white',
    onClick,
    title,
    variant = 'standard',
    animateOnHover = false
}) => {
    const isPlayful = variant === 'playful';

    return (
        <div
            onClick={onClick}
            className={`
        relative 
        border-4 border-black 
        ${bgColor} 
        ${isPlayful ? 'rounded-3xl shadow-neo' : 'shadow-neo'}
        ${animateOnHover ? 'hover:animate-wiggle' : ''}
        hover:shadow-neo-hover 
        hover:-translate-x-1 
        hover:-translate-y-1 
        transition-all 
        duration-200 
        p-6 
        ${onClick ? 'cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none' : ''}
        ${className}
      `}
        >
            {title && (
                <div className={`
                    border-b-4 border-black -mx-6 -mt-6 p-4 mb-6 font-black uppercase tracking-wider
                    ${isPlayful ? 'bg-neo-yellow text-black rounded-t-[20px]' : 'bg-black text-white'}
                `}>
                    {title}
                </div>
            )}
            <div className={`relative z-10 ${isPlayful ? 'font-mono' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default NeoCard;
