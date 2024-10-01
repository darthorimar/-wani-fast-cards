import { ReactNode } from 'react'

export function Center(
    { children }: { children: ReactNode }
) {
    return <div className='flex items-center justify-center mt-12' style={{ minHeight: '85dvh' }}>
        <div>
            {children}
        </div>
    </div>
}