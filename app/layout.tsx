import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'OVIRA - Cancer Risk Assessment',
  description: 'An evidence-based health risk assessment tool for ovarian, breast, and endometrial cancer screening',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative isolate min-h-screen overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-float" />
              <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-secondary/20 rounded-full blur-[100px] animate-float [animation-delay:-5s]" />
              <div className="absolute top-[20%] right-[15%] w-[25%] h-[25%] bg-accent/15 rounded-full blur-[80px] animate-float [animation-delay:-12s]" />
            </div>

            {children}
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

