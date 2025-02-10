'use client'

import { BlogStatistics } from "@/types/statistics"
import { BarChart } from "@mui/x-charts/BarChart"
import clsx from "clsx"

export default function DistributionOfPostsByTags(
    { statistics } : { statistics: BlogStatistics }
) {
    const chartSetting = {
        xAxis: [
            {
                label: 'Adet',
            },
        ],
        width: 1000,
        height: 400,
    }
    return (
        <section className={clsx(['flex', 'justify-center', 'items-center'])}>
            <BarChart
                dataset={statistics.distributionOfPostsByTags.map(x => ({
                    tag: x.name, num: x.sum
                }))}
                yAxis={[{ scaleType: 'band', dataKey: 'tag' }]}
                series={[{ dataKey: 'num', label: 'Etiketlere göre makaleler' }]}
                layout="horizontal"
                grid={{ vertical: true }}
                {...chartSetting}
            />
        </section>
    )
}