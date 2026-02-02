import React from 'react';

interface NeoCardProps {
    children: React.ReactNode;
    className?: string;
    bgColor?: string;
    onClick?: () => void;
    title?: string;
}

const NeoCard: React.FC<NeoCardProps> = ({
    children,
    className = '',
    bgColor = 'bg-white',
    onClick,
    title
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        relative 
        border-4 border-black 
        ${bgColor} 
        shadow-neo 
        hover:shadow-neo-hover 
        hover:translate-x-1 
        hover:translate-y-1 
        transition-all 
        duration-200 
        p-6 
        ${onClick ? 'cursor-pointer active:translate-x-1.5 active:translate-y-1.5 active:shadow-none' : ''}
        ${className}
      `}
        >
            {title && (
                <div className="border-b-4 border-black -mx-6 -mt-6 p-4 mb-6 bg-black text-white font-bold uppercase tracking-wider">
                    {title}
                </div>
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default NeoCard;
