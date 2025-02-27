'use client'

import { getStatistics } from "@/blog_api_actions"

import { MdArticle, MdComment, MdFavorite, MdNote, MdPerson, MdPerson2, MdShare, MdTag }
    from "react-icons/md"
import { IoMdEye } from "react-icons/io"

import NumberCard from "../NumberCard"
import DistributionOfPostsByTags from "../DistributionOfPostsByTags"
import DistributionOfUsersByMonths from "../DistributionOfUsersByMonths"
import DistributionOfGuestsByMonths from "../DistributionOfGuestsByMonths"
import StaggeredContent from "@/app/(components)/StaggeredContent"
import UISkeleton from "../../UISkeleton"
import ErrorElement from "../../ErrorElement"

import { useEffect, useState } from "react"
import { ApiError } from "@/lib/custom_fetch"
import clsx from "clsx"

import type { BlogStatistics } from "@/types/statistics"

export default function Statistics() {
    const [statistics, setStatistics] = useState<BlogStatistics | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<ApiError | null>(null)

    useEffect(() => {
        setLoading(true)
        getStatistics()
            .then(s => setStatistics(s))
            .catch(e => setError(e))
            .finally(() => setLoading(false))
    }, [])

    return (
        <section>
            <StaggeredContent
                error={{
                    status: error !== null,
                    content: (<ErrorElement />)
                }}
                loading={{
                    status: loading,
                    content: (<UISkeleton format={3} />)
                }}
                content={{
                    content: (
                        statistics && <>
                            <h2 className={clsx([
                                'font-bold', 'text-2xl', 'text-gray-600', 'mb-4',
                                'border-l-8', 'border-gray-600', 'p-2', 'bg-gray-100'
                            ])}>GENEL İSTATİSTİKLER</h2>
                            <div className={clsx([
                                'grid', 'grid-cols-5', 'gap-8'
                            ])}>
                                <NumberCard
                                    caption="Makale"
                                    icon={<MdArticle size={30} className="text-gray-600" />}
                                    num={statistics.postCount}
                                />
                                <NumberCard
                                    caption='Not'
                                    num={statistics.noteCount}
                                    icon={<MdNote size={30} className="text-gray-600" />}
                                />
                                <NumberCard
                                    caption='Üye'
                                    num={statistics.userCount}
                                    icon={<MdPerson size={30} className="text-gray-600" />}
                                />
                                <NumberCard
                                    caption='Ziyaretçi'
                                    num={statistics.guestCount}
                                    icon={<MdPerson2 size={30} className="text-gray-600" />}
                                />
                                <NumberCard
                                    caption='Etiket'
                                    num={statistics.tagCount}
                                    icon={<MdTag size={30} className="text-gray-600" />}
                                />
                            </div>
                            <h2 className={clsx([
                                'font-bold', 'text-2xl', 'text-gray-600', 'mt-8', 'mb-4',
                                'border-l-8', 'border-gray-600', 'p-2', 'bg-gray-100'
                            ])}>MAKALE İSTATİSTİKLERİ</h2>
                            <div className={clsx([
                                'grid', 'grid-cols-4', 'gap-8'
                            ])}>
                                <NumberCard
                                    caption='Yorum'
                                    num={statistics.postCommentCount}
                                    icon={<MdComment size={30} className="text-gray-600" />}
                                />
                                <NumberCard
                                    caption='Beğeni'
                                    num={statistics.postLikeCount}
                                    icon={<MdFavorite size={30} className="text-gray-600" />}
                                />
                                <NumberCard
                                    caption='Paylaşım'
                                    num={statistics.postShareCount}
                                    icon={<MdShare size={30} className="text-gray-600" />}
                                />
                                <NumberCard
                                    caption='Görüntülenme'
                                    num={statistics.postViewCount}
                                    icon={<IoMdEye size={30} className="text-gray-600" />}
                                />
                            </div>
                            <h2 className={clsx([
                                'font-bold', 'text-2xl', 'text-gray-600', 'mt-8', 'mb-4',
                                'border-l-8', 'border-gray-600', 'p-2', 'bg-gray-100'
                            ])}>NOT İSTATİSTİKLERİ</h2>
                            <div className={clsx([
                                'grid', 'grid-cols-4', 'gap-8'
                            ])}>
                                <NumberCard
                                    caption='Beğeni'
                                    num={statistics.noteLikeCount}
                                    icon={<MdFavorite size={30} className="text-gray-600" />}
                                />
                                <NumberCard
                                    caption='Paylaşım'
                                    num={statistics.noteShareCount}
                                    icon={<MdShare size={30} className="text-gray-600" />}
                                />
                                <NumberCard
                                    caption='Görüntülenme'
                                    num={statistics.noteViewCount}
                                    icon={<IoMdEye size={30} className="text-gray-600" />}
                                />
                            </div>
                            <h2 className={clsx([
                                'font-bold', 'text-2xl', 'text-gray-600', 'mt-8', 'mb-4',
                                'border-l-8', 'border-gray-600', 'p-2', 'bg-gray-100'
                            ])}>MAKALELERİN ETİKETLERE GÖRE DAĞILIMI (İLK 15)</h2>
                            {
                                statistics.distributionOfPostsByTags !== undefined
                                && statistics!.distributionOfPostsByTags.length > 0
                                && <DistributionOfPostsByTags statistics={statistics!} />
                            }
                            <h2 className={clsx([
                                'font-bold', 'text-2xl', 'text-gray-600', 'mt-8', 'mb-4',
                                'border-l-8', 'border-gray-600', 'p-2', 'bg-gray-100'
                            ])}>AYLARA GÖRE YENİ ÜYE SAYISI</h2>
                            {
                                statistics!.distributionOfUsersByMonths !== undefined
                                && statistics!.distributionOfUsersByMonths.length > 0
                                && <DistributionOfUsersByMonths statistics={statistics!} />
                            }
                            <h2 className={clsx([
                                'font-bold', 'text-2xl', 'text-gray-600', 'mt-8', 'mb-4',
                                'border-l-8', 'border-gray-600', 'p-2', 'bg-gray-100'
                            ])}>AYLARA GÖRE ZİYARETÇİ SAYISI</h2>
                            {
                                statistics!.distributionOfGuestsByMonths !== undefined &&
                                statistics!.distributionOfGuestsByMonths.length > 0
                                && <DistributionOfGuestsByMonths statistics={statistics!} />
                            }
                        </>
                    )
                }}
            />
        </section>
    )
}