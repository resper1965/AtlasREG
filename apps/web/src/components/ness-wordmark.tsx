/**
 * ness. Wordmark Component
 * 
 * Componente oficial para exibir o branding ness.
 * Garante que o ponto final é SEMPRE #00ADE8
 */

import { cn } from '@/lib/utils';

interface NessWordmarkProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',       // 12px
  sm: 'text-sm',       // 14px
  md: 'text-base',     // 16px
  lg: 'text-2xl',      // 24px
  xl: 'text-5xl',      // 48px
  '2xl': 'text-6xl'    // 60px
};

export function NessWordmark({ size = 'md', className }: NessWordmarkProps) {
  return (
    <span className={cn('ness-wordmark', sizeClasses[size], className)}>
      ness<span className="ness-dot">.</span>
    </span>
  );
}

/**
 * Variante com produto (ex: "ness. | AtlasReg")
 */
interface NessWithProductProps {
  product: string;
  size?: NessWordmarkProps['size'];
  className?: string;
}

export function NessWithProduct({ product, size = 'md', className }: NessWithProductProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <NessWordmark size={size} />
      <span className={cn('text-muted-foreground', sizeClasses[size])}>|</span>
      <span className={cn('text-foreground', sizeClasses[size])}>{product}</span>
    </div>
  );
}

/**
 * Apenas o ponto (para uso inline)
 */
export function NessDot() {
  return <span className="ness-dot">.</span>;
}
