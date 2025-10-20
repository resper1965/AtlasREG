/**
 * ness. Wordmark Component
 * 
 * Componente oficial para exibir o branding ness.
 * Garante que o ponto final é SEMPRE #00ADE8
 * 
 * Baseado nas especificações oficiais do design system ness.
 */

import { cn } from '@/lib/utils';

interface NessWordmarkProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  xs: 'text-xs',       // 12px - Badges, inline
  sm: 'text-sm',       // 14px - Footer pequeno
  md: 'text-base',     // 16px - Inline text
  lg: 'text-2xl',      // 24px - Topbar, Header
  xl: 'text-5xl',      // 48px - Login page, Hero
  '2xl': 'text-6xl'    // 60px - Landing page, Marketing
};

export function NessWordmark({ size = 'md', className }: NessWordmarkProps) {
  return (
    <span className={cn('ness-wordmark', sizeClasses[size], className)}>
      ness<span className="ness-dot">.</span>
    </span>
  );
}

/**
 * Uso:
 * 
 * // Topbar/Header
 * <NessWordmark size="lg" />
 * 
 * // Footer
 * <div className="text-muted-foreground">
 *   Powered by <NessWordmark size="sm" /> © 2025
 * </div>
 * 
 * // Login Page (Hero)
 * <div className="text-center">
 *   <NessWordmark size="xl" />
 *   <p className="text-muted-foreground mt-2">AtlasReg Platform</p>
 * </div>
 * 
 * // Com classes adicionais
 * <NessWordmark size="lg" className="hover:opacity-80 transition-opacity" />
 * 
 * // Inline em texto
 * <p>
 *   Plataforma desenvolvida pela <NessWordmark size="sm" />
 * </p>
 */

/**
 * Variante inline para uso em meio de texto
 */
export function NessDot() {
  return <span className="ness-dot">.</span>;
}

/**
 * Variante com produto (ex: "ness. AtlasReg")
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
 * Uso:
 * <NessWithProduct product="AtlasReg" size="lg" />
 * Resultado: ness. | AtlasReg
 */

