import { routeMap } from "@/utils/routeMap"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import clsx from "clsx"
import DeleteIcon from "@mui/icons-material/Delete"
import CopyIcon from "@mui/icons-material/FileCopy"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import styled from "@emotion/styled"

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function ImageUploadBar(
    key: any,
    subFolder: string,
    handleRemoveImage: (image: string) => void,
    handleUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void,
    url?: string)
{
    const urlString = url
        ? `![image](${routeMap.static.root}/${subFolder}/${url})`
        : '![image](url)'
        
    return (
        <div
            key={key}
            className={clsx([
                'border', 'border-gray-300', 'p-4', 'rounded-md', 'flex',
                'justify-between', 'items-center', 'my-4'
            ])}
        >
            {!url && <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                YÜKLE
                <VisuallyHiddenInput
                    type="file"
                    name="coverImage"
                    alt="Makale kapak fotoğrafı seçin"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    onChange={handleUploadImage}
                />
            </Button>}
            <span>
                {urlString}
            </span>
            <div className={clsx(['flex', 'gap-4'])}>
                {url && <Button
                    variant="contained"
                    color="info"
                    startIcon={<CopyIcon />}
                    onClick={() => navigator.clipboard.writeText(urlString)}
                >
                        KOPYALA
                </Button>}
                {url && <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleRemoveImage(url)}
                >
                        KALDIR
                </Button>}
            </div>
        </div>
    )
}

interface Props {
    title: string
    images: string[]
    subFolder: string
    handleRemoveImage: (image: string) => void,
    handleUploadImage: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export default function ImageUploader({
    title,
    images,
    subFolder,
    handleRemoveImage,
    handleUploadImage
}: Props) {
    return (
        <section>
            <Typography variant="h6">{title}</Typography>
            <div>
                {images.map((pi, index) =>
                    ImageUploadBar(index, subFolder, handleRemoveImage, handleUploadImage, pi))}
                {ImageUploadBar(
                    undefined, subFolder, handleRemoveImage, handleUploadImage, undefined)}
                <div>
                    <Typography variant="body1" color="warning">
                        * Jpeg, png, gif formatlarına izin verilir. 5 MB tan fazla dosya kabul edilmez.
                    </Typography>
                </div>
            </div>
        </section>
    )
}