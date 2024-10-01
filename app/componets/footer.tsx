import { FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa'

export function Footer() {
    return <footer className='mx-auto p-4 text-default-400'>
        <p className='text-center'>Created by <a href='https://darthorimar.github.io' target='_blank'>Darthorimar</a></p>
        <div className='flex gap-2 items-center justify-center mt-2'>
            <a href='https://darthorimar.github.io' target='_blank'>
                <FaGlobe color='hsl(var(--nextui-default-400))' />
            </a>
            <a href='https://github.com/darthorimar' target='_blank' >
                <FaGithub color='hsl(var(--nextui-default-400))' />
            </a>
            <a href='https://www.linkedin.com/in/ilia-kirillov/' target='_blank' >
                <FaLinkedin color='hsl(var(--nextui-default-400))' />
            </a>
        </div>
    </footer>
}