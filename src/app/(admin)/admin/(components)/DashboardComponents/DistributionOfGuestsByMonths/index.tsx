'use client'

import { BlogStatistics } from "@/types/statistics"
import { BarChart } from "@mui/x-charts/BarChart"
import clsx from "clsx"

export default function DistributionOfGuestsByMonths(
    { statistics } : { statistics: BlogStatistics }
) {
    const chartSetting = {
        yAxis: [
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
                dataset={statistics.distributionOfGuestsByMonths.map(x => ({
                    month: x.month, num: x.sum
                }))}
                series={[{ dataKey: 'num', label: 'Aylara göre ziyaretçi sayısı' }]}
                layout="vertical"
                grid={{ vertical: true }}
                xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                {...chartSetting}
            />
        </section>
    )
}