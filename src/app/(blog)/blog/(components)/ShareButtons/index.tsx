import { routeMap } from "@/app/(admin)/routeMap"
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share"

interface Props {
    onShare: () => void,
    url: string
}

export default function ShareButtons({ onShare, url }: Props) {
    return (
        <div className="absolute hidden rounded-md p-2 justify-center items-center gap-2 bg-white shadow-lg left-[-4.5rem] group-hover:flex dark:bg-gray-900">
            <FacebookShareButton
                title="Caner'in bloğundan bir not"
                hashtag="not"
                url={url}
                onShareWindowClose={onShare}
            >
                <FacebookIcon size={36} className="rounded-full hover:brightness-75" />
            </FacebookShareButton>
            <LinkedinShareButton
                title="Caner'in bloğundan bir not"
                summary="Not"
                source="Caner's blog"
                url={url}
                onShareWindowClose={onShare}
            >
                <LinkedinIcon size={36} className="rounded-full hover:brightness-75" />
            </LinkedinShareButton>
            <TwitterShareButton
                title="Caner'in bloğundan bir not"
                hashtags={['canerinblogu']}
                related={['related']}
                url={url}
                onShareWindowClose={onShare}
            >
                <TwitterIcon size={36} className="rounded-full hover:brightness-75" />
            </TwitterShareButton>
            <WhatsappShareButton
                title="Caner'in bloğundan bir not"
                url={url}
                onShareWindowClose={onShare}
            >
                <WhatsappIcon size={36} className="rounded-full hover:brightness-75" />
            </WhatsappShareButton>
        </div>
    )
}