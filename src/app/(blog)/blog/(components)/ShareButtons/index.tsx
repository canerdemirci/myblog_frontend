import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share"
import { clsx } from 'clsx'

interface Props {
    onShare: () => void
    url: string
    title: string
}

export default function ShareButtons({ onShare, url, title }: Props) {
    return (
        <div
            className={clsx([
                "absolute", "hidden", "rounded-md", "p-2", "justify-center", "items-center",
                "gap-2", "bg-white", "shadow-lg", "left-[-4.5rem]",
                // group-hover
                "group-hover:flex",
                // dark
                "dark:bg-gray-900"
            ])}
        >
            <FacebookShareButton
                title={title}
                hashtag="#canerinblogu"
                url={url}
                onShareWindowClose={onShare}
            >
                <FacebookIcon
                    size={36}
                    className={clsx(["rounded-full", "hover:brightness-75"])}
                />
            </FacebookShareButton>
            <LinkedinShareButton
                title={title}
                summary="Not"
                source="Caner's blog"
                url={url}
                onShareWindowClose={onShare}
            >
                <LinkedinIcon
                    size={36}
                    className={clsx(["rounded-full", "hover:brightness-75"])}
                />
            </LinkedinShareButton>
            <TwitterShareButton
                title={title}
                hashtags={['canerinblogu']}
                related={['related']}
                url={url}
                onShareWindowClose={onShare}
            >
                <TwitterIcon
                    size={36}
                    className={clsx(["rounded-full", "hover:brightness-75"])}
                />
            </TwitterShareButton>
            <WhatsappShareButton
                title={title}
                url={url}
                onShareWindowClose={onShare}
            >
                <WhatsappIcon
                    size={36}
                    className={clsx(["rounded-full", "hover:brightness-75"])}
                />
            </WhatsappShareButton>
        </div>
    )
}