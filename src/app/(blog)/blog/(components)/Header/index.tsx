import { MdOutlineSearch } from 'react-icons/md'
import { FaHashnode, FaInstagram, FaYoutube, FaLinkedin, FaGithub } from 'react-icons/fa6'
import { leagueSpartan, firaCode, caveat } from '@/app/fonts'
import ColorModeButton from './components/ColorModeButton'
import Link from 'next/link'
import { routeMap } from '@/app/(admin)/routeMap'
import UserButton from './components/UserButton'

const HEADER_ICON_SIZE = 36
const SOCIAL_ICON_SIZE = 24

export default function Header() {
    return (
        <header>
            <div className="flex justify-between items-center p-4">
                <div className="flex justify-between items-center gap-4">
                    <MdOutlineSearch size={HEADER_ICON_SIZE} className='dark:text-white' />
                    <ColorModeButton />
                </div>
                <UserButton />
            </div>
            <Link href={routeMap.blog.root}>
                <h1 className={`${leagueSpartan.className} text-center text-4xl p-8 dark:text-white`}>Caner Demirci</h1>
            </Link>
            <div className="flex justify-center gap-4">
                <Link href="https://canerdemirciblog.hashnode.dev/" target='_blank'>
                    <FaHashnode size={SOCIAL_ICON_SIZE} className='dark:text-white cursor-pointer hover:text-blue-500' />
                </Link>
                <Link href="https://www.instagram.com/cnrdmrcinst/" target='_blank'>
                    <FaInstagram size={SOCIAL_ICON_SIZE} className='dark:text-white cursor-pointer hover:text-orange-500' />
                </Link>
                <Link href="https://github.com/canerdemirci" target='_blank'>
                    <FaGithub size={SOCIAL_ICON_SIZE} className='dark:text-white cursor-pointer hover:text-green-500' />
                </Link>
                <Link href="https://www.linkedin.com/in/caner-demirci-12a587113/" target='_blank'>
                    <FaLinkedin size={SOCIAL_ICON_SIZE} className='dark:text-white cursor-pointer hover:text-blue-500' />
                </Link>
                <Link href="https://www.youtube.com/channel/UCPRYzHxfP8DWbxnxI4X2WeA" target='_blank'>
                    <FaYoutube size={SOCIAL_ICON_SIZE} className='dark:text-white cursor-pointer hover:text-red-500' />
                </Link>
            </div>
            <div>
                <Link href="#" className='dark:text-white'>Anasayfa</Link>
                <Link href="#" className='dark:text-white'>Hakkımda</Link>
            </div>
            <div className="mt-9 p-4 border-y-8 border-[#FF4C4C]">
                <p className={`${firaCode.className} text-2xl text-center dark:text-white`}>&#123;Biraz Yazılım&#125;</p>
                <p className={`${caveat.className} text-2xl text-center dark:text-white`}>Biraz Her Şeyden</p>
            </div>
        </header>
    )
}