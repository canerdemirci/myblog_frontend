import { MdOutlineSearch, MdMenu } from 'react-icons/md'
import { FaHashnode, FaInstagram, FaYoutube, FaLinkedin, FaGithub } from 'react-icons/fa6'
import { leagueSpartan, firaCode, caveat } from '@/app/fonts'
import ColorModeButton from './components/ColorModeButton'

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
                <MdMenu size={HEADER_ICON_SIZE} className='dark:text-white' />
            </div>
            <h1 className={`${leagueSpartan.className} text-center text-4xl p-8 dark:text-white`}>Caner Demirci</h1>
            <div className="flex justify-center gap-4">
                <FaHashnode size={SOCIAL_ICON_SIZE} className='dark:text-white' />
                <FaInstagram size={SOCIAL_ICON_SIZE} className='dark:text-white' />
                <FaGithub size={SOCIAL_ICON_SIZE} className='dark:text-white' />
                <FaLinkedin size={SOCIAL_ICON_SIZE} className='dark:text-white' />
                <FaYoutube size={SOCIAL_ICON_SIZE} className='dark:text-white' />
            </div>
            <div className="mt-9 p-4 border-y-8 border-[#FF4C4C]">
                <p className={`${firaCode.className} text-2xl text-center dark:text-white`}>&#123;Biraz Yazılım&#125;</p>
                <p className={`${caveat.className} text-2xl text-center dark:text-white`}>Biraz Her Şeyden</p>
            </div>
        </header>
    )
}