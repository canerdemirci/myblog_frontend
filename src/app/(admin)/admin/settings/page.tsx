'use client'

import clsx from "clsx"
import AdminPanelPage from "../(components)/AdminPanelPage"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import TableContainer from "@mui/material/TableContainer"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { StyledTableCell, StyledTableCell2, StyledTableRow }
    from "../(components)/StyledTableComponents"
import TableBody from "@mui/material/TableBody"
import DeleteIcon from "@mui/icons-material/Delete"
import CleanIcon from "@mui/icons-material/Check"
import Image from 'next/image'
import { useState } from "react"
import { getUnusedPostCovers, getUnusedPostImages } from "@/blog_api_actions/post_repo"
import { routeMap } from "@/utils/routeMap"
import { deleteCover, deleteNoteImage, deletePostImage } from "@/blog_api_actions"
import { getUnusedNoteImages } from "@/blog_api_actions/note_repo"

export default function Settings() {
    // For unused post covers
    const [unusedCovers, setUnusedCovers] = useState<string[]>([])
    const [unusedCoversScanning, setUnusedCoversScanning] = useState(false)
    const [unusedCoverDeletingId, setUnusedCoversDeletingId] = useState(-1)
    const [cleanUnusedCovers, setCleanUnusedCovers] = useState(false)

    // For unused post content images
    const [unusedPostImages, setUnusedPostImages] = useState<string[]>([])
    const [unusedPostImagesScanning, setUnusedPostImagesScanning] = useState(false)
    const [unusedPostImageDeletingId, setUnusedPostImageDeletingId] = useState(-1)
    const [cleanUnusedPostImages, setCleanUnusedPostImages] = useState(false)

    // For unused note content images
    const [unusedNoteImages, setUnusedNoteImages] = useState<string[]>([])
    const [unusedNoteImagesScanning, setUnusedNoteImagesScanning] = useState(false)
    const [unusedNoteImageDeletingId, setUnusedNoteImageDeletingId] = useState(-1)
    const [cleanUnusedNoteImages, setCleanUnusedNoteImages] = useState(false)

    function handleUnusedCoversScanBtnClick() {
        setUnusedCoversScanning(true)

        getUnusedPostCovers()
            .then(c => {
                setUnusedCovers(c)

                if (c.length === 0) {
                    setCleanUnusedCovers(true)
                } else {
                    setCleanUnusedCovers(false)
                }
            })
            .catch(_ => alert('Bir hata oluştu.'))
            .finally(() => setUnusedCoversScanning(false))
    }

    function handleUnusedCoverDelete(fileName: string) {
        deleteCover(fileName)
            .then(_ => setUnusedCovers(c => c.filter(f => f !== fileName)))
            .catch(_ => alert('Bir hata oluştu.'))
            .finally(() => setUnusedCoversDeletingId(-1))
    }

    function handleUnusedPostImagesScanBtnClick() {
        setUnusedPostImagesScanning(true)

        getUnusedPostImages()
            .then(c => {
                setUnusedPostImages(c)

                if (c.length === 0) {
                    setCleanUnusedPostImages(true)
                } else {
                    setCleanUnusedPostImages(false)
                }
            })
            .catch(_ => alert('Bir hata oluştu.'))
            .finally(() => setUnusedPostImagesScanning(false))
    }

    function handleUnusedPostImageDelete(fileName: string) {
        deletePostImage(fileName)
            .then(_ => setUnusedPostImages(p => p.filter(f => f !== fileName)))
            .catch(_ => alert('Bir hata oluştu.'))
            .finally(() => setUnusedPostImageDeletingId(-1))
    }

    function handleUnusedNoteImagesScanBtnClick() {
        setUnusedNoteImagesScanning(true)

        getUnusedNoteImages()
            .then(c => {
                setUnusedNoteImages(c)

                if (c.length === 0) {
                    setCleanUnusedNoteImages(true)
                } else {
                    setCleanUnusedNoteImages(false)
                }
            })
            .catch(_ => alert('Bir hata oluştu.'))
            .finally(() => setUnusedNoteImagesScanning(false))
    }

    function handleUnusedNoteImageDelete(fileName: string) {
        deleteNoteImage(fileName)
            .then(_ => setUnusedNoteImages(p => p.filter(f => f !== fileName)))
            .catch(_ => alert('Bir hata oluştu.'))
            .finally(() => setUnusedNoteImageDeletingId(-1))
    }
    
    return (
        <AdminPanelPage pageName="Bakım ve Ayarlar">
            {/* Unused post covers scanning section */}
            <section className={clsx([
                'bg-white', 'rounded-lg', 'border', 'border-gray-300', 'shadow-md', 'my-8'
            ])}
            >
                <div className={clsx(['p-4', 'border-b', 'border-gray-300'])}>
                    <Typography
                        variant="h4"
                        className={clsx(['font-bold', 'text-gray-700'])}
                    >
                        Atıl makale kapak fotoğraflarını sil
                    </Typography>
                    <Typography variant="body2">
                        Bu bölüm makalelerde kullanılmayan <b>kapak</b> fotoğraflarını tespit etmesi ve silinerek gereksiz dosya birikimini önlemesi için tasarlanmıştır. Makale silme sırasında oluşabilecek hatalar veya yeni makale oluşturma sırasında yüklenmiş resimlerin silinmeyi unutulması gibi durumlar gereksiz dosya birikimine yol açabilir. Bu bölümü kullanarak gereksiz dosyaları temizleyebilirsiniz.
                    </Typography>
                </div>
                <div className="p-4">
                    <Button
                        variant="contained"
                        color="success"
                        sx={{width: '100%'}}
                        onClick={handleUnusedCoversScanBtnClick}
                        disabled={unusedCoversScanning}
                    >
                        {unusedCoversScanning ? 'TARANIYOR...' : 'TARAMAYA BAŞLA'}
                    </Button>
                </div>
                {cleanUnusedCovers
                    ? <div className="text-center m-4">
                        <CleanIcon color="success" sx={{fontSize: '6rem'}} />
                    </div>
                    : unusedCovers.length > 0 && <div className="p-4">
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell2 sx={{backgroundColor:'purple'}}>
                                            #
                                        </StyledTableCell2>
                                        <StyledTableCell2>Kapak</StyledTableCell2>
                                        <StyledTableCell2>Dosya</StyledTableCell2>
                                        <StyledTableCell2><DeleteIcon /></StyledTableCell2>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unusedCovers.map((cover, i) => <StyledTableRow key={i}>
                                        <StyledTableCell>
                                            <Typography variant="body1">
                                                {i + 1}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Image
                                                src={`${routeMap.static.root}/${cover}`}
                                                width={200}
                                                height={105}
                                                style={{width: '200px', height: '105px'}}
                                                alt="Makale Kapağı"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                        <Typography variant="body1">
                                            {`.../uploads/${cover}`}
                                        </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    setUnusedCoversDeletingId(i)
                                                    handleUnusedCoverDelete(cover)
                                                }}
                                                disabled={unusedCoverDeletingId === i}
                                            >
                                                Sil
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                </div>}
            </section>
            {/* Unused post content images scanning section */}
            <section className={clsx([
                'bg-white', 'rounded-lg', 'border', 'border-gray-300', 'shadow-md', 'my-8'
            ])}
            >
                <div className={clsx(['p-4', 'border-b', 'border-gray-300'])}>
                    <Typography
                        variant="h4"
                        className={clsx(['font-bold', 'text-gray-700'])}
                    >
                        Atıl makale içerik fotoğraflarını sil
                    </Typography>
                    <Typography variant="body2">
                        Bu bölüm makalelerde kullanılmayan <b>içerik</b> fotoğraflarını tespit etmesi ve silinerek gereksiz dosya birikimini önlemesi için tasarlanmıştır. Makale silme sırasında oluşabilecek hatalar veya yeni makale oluşturma sırasında yüklenmiş resimlerin silinmeyi unutulması gibi durumlar gereksiz dosya birikimine yol açabilir. Bu bölümü kullanarak gereksiz dosyaları temizleyebilirsiniz.
                    </Typography>
                </div>
                <div className="p-4">
                    <Button
                        variant="contained"
                        color="success"
                        sx={{width: '100%'}}
                        onClick={handleUnusedPostImagesScanBtnClick}
                        disabled={unusedPostImagesScanning}
                    >
                        {unusedPostImagesScanning ? 'TARANIYOR...' : 'TARAMAYA BAŞLA'}
                    </Button>
                </div>
                {cleanUnusedPostImages
                    ? <div className="text-center m-4">
                        <CleanIcon color="success" sx={{fontSize: '6rem'}} />
                    </div>
                    : unusedPostImages.length > 0 && <div className="p-4">
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell2 sx={{backgroundColor:'purple'}}>
                                            #
                                        </StyledTableCell2>
                                        <StyledTableCell2>Kapak</StyledTableCell2>
                                        <StyledTableCell2>Dosya</StyledTableCell2>
                                        <StyledTableCell2><DeleteIcon /></StyledTableCell2>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unusedPostImages.map((image, i) => <StyledTableRow key={i}>
                                        <StyledTableCell>
                                            <Typography variant="body1">
                                                {i + 1}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Image
                                                src={
                                                    routeMap.static.root
                                                    + '/images_of_posts/'
                                                    + image
                                                }
                                                width={200}
                                                height={105}
                                                style={{width: '200px', height: '105px'}}
                                                alt="Makale İçerik Resmi"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                        <Typography variant="body1">
                                            {`.../uploads/images_of_posts/${image}`}
                                        </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    setUnusedPostImageDeletingId(i)
                                                    handleUnusedPostImageDelete(image)
                                                }}
                                                disabled={unusedPostImageDeletingId === i}
                                            >
                                                Sil
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                </div>}
            </section>
            {/* Unused note content images scanning section */}
            <section className={clsx([
                'bg-white', 'rounded-lg', 'border', 'border-gray-300', 'shadow-md', 'my-8'
            ])}
            >
                <div className={clsx(['p-4', 'border-b', 'border-gray-300'])}>
                    <Typography
                        variant="h4"
                        className={clsx(['font-bold', 'text-gray-700'])}
                    >
                        Atıl not içerik fotoğraflarını sil
                    </Typography>
                    <Typography variant="body2">
                        Bu bölüm <b>notlarda</b> kullanılmayan <b>içerik</b> fotoğraflarını tespit etmesi ve silinerek gereksiz dosya birikimini önlemesi için tasarlanmıştır. Makale silme sırasında oluşabilecek hatalar veya yeni makale oluşturma sırasında yüklenmiş resimlerin silinmeyi unutulması gibi durumlar gereksiz dosya birikimine yol açabilir. Bu bölümü kullanarak gereksiz dosyaları temizleyebilirsiniz.
                    </Typography>
                </div>
                <div className="p-4">
                    <Button
                        variant="contained"
                        color="success"
                        sx={{width: '100%'}}
                        onClick={handleUnusedNoteImagesScanBtnClick}
                        disabled={unusedNoteImagesScanning}
                    >
                        {unusedNoteImagesScanning ? 'TARANIYOR...' : 'TARAMAYA BAŞLA'}
                    </Button>
                </div>
                {cleanUnusedNoteImages
                    ? <div className="text-center m-4">
                        <CleanIcon color="success" sx={{fontSize: '6rem'}} />
                    </div>
                    : unusedNoteImages.length > 0 && <div className="p-4">
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell2 sx={{backgroundColor:'purple'}}>
                                            #
                                        </StyledTableCell2>
                                        <StyledTableCell2>Kapak</StyledTableCell2>
                                        <StyledTableCell2>Dosya</StyledTableCell2>
                                        <StyledTableCell2><DeleteIcon /></StyledTableCell2>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unusedNoteImages.map((image, i) => <StyledTableRow key={i}>
                                        <StyledTableCell>
                                            <Typography variant="body1">
                                                {i + 1}
                                            </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Image
                                                src={
                                                    routeMap.static.root
                                                    + '/images_of_notes/'
                                                    + image
                                                }
                                                width={200}
                                                height={105}
                                                style={{width: '200px', height: '105px'}}
                                                alt="Not içerik resmi"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                        <Typography variant="body1">
                                            {`.../uploads/images_of_notes/${image}`}
                                        </Typography>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => {
                                                    setUnusedNoteImageDeletingId(i)
                                                    handleUnusedNoteImageDelete(image)
                                                }}
                                                disabled={unusedNoteImageDeletingId === i}
                                            >
                                                Sil
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                </div>}
            </section>
        </AdminPanelPage>
    )
}