import { ReactNode } from 'react'

import type { Metadata } from 'next'
// TEMPORÁRIO: Google Fonts comentado devido a problemas de rede no build
// Veja PROBLEMA_BUILD.md para soluções permanentes
// import { Montserrat } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { getPreference } from '@/server/server-actions'
import { PreferencesStoreProvider } from '@/stores/preferences/preferences-provider'
import {
  THEME_MODE_VALUES,
  THEME_PRESET_VALUES,
  type ThemePreset,
  type ThemeMode,
} from '@/types/preferences/theme'

import './globals.css'

// TEMPORÁRIO: Usando fonte do sistema
// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ['400', '500', '600'],
//   variable: '--font-montserrat'
// });

export const metadata: Metadata = {
  title: 'AtlasReg by ness. | Inteligência de Mercado para Transmissão de Energia',
  description: 'Plataforma de IA para monitoramento automático e análise do setor de transmissão de energia elétrica brasileiro. Desenvolvido por resper@ness.com.br - Powered by ness.',
  keywords: ['energia elétrica', 'transmissão', 'ANEEL', 'ONS', 'SIGEL', 'inteligência de mercado', 'ness'],
  authors: [{ name: 'Ricardo Esper' }],
  creator: 'ness.',
  publisher: 'ness.',
  openGraph: {
    title: 'AtlasReg by ness.',
    description: 'Inteligência de Mercado para Transmissão de Energia',
    type: 'website',
    locale: 'pt_BR',
  }
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const themeMode = await getPreference<ThemeMode>(
    'theme_mode',
    THEME_MODE_VALUES,
    'light'
  )
  const themePreset = await getPreference<ThemePreset>(
    'theme_preset',
    THEME_PRESET_VALUES,
    'default'
  )

  return (
    <html
      lang="pt-BR"
      className={themeMode === 'dark' ? 'dark' : ''}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased font-sans">{/* TEMPORÁRIO: font-sans até configurar Montserrat */}
        <PreferencesStoreProvider
          themeMode={themeMode}
          themePreset={themePreset}
        >
          {children}
          <Toaster />
        </PreferencesStoreProvider>
      </body>
    </html>
  )
}
