import type { Metadata } from 'next'
import './globals.css'
import { ReactNode } from 'react'
import { Inter as FontSans } from 'next/font/google'
import clsx from 'clsx'
import { Providers } from '@/providers'

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
})


export const metadata: Metadata = {
    title: 'WaniKani Kanji Cards'
}

export default function RootLayout(
    { children }: { children: ReactNode }
) {
    return (
        <html lang='en'
            className={clsx(
                'bg-background font-sans antialiased',
                fontSans.variable,
            )}>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
