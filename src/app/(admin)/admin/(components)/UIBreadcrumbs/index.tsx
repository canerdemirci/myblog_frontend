import Link from '@mui/material/Link'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'

import HomeIcon from '@mui/icons-material/Home'

import { routeMap } from '../../../../../utils/routeMap'
import { clsx } from 'clsx'

/**
 * Mui Breadcrumbs based component
 */
export default function UIBreadcrumbs({ pageName }: { pageName: string }) {
    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
                marginLeft: '4rem', marginTop: '4rem', position: 'fixed', width: '100%',
                zIndex: '10'
            }}
            className={clsx(["bg-slate-100", "p-4", "drop-shadow-md"])}
        >
            <Link
                underline="hover"
                color="inherit"
                href={routeMap.admin.root}
                className={clsx(['flex', 'items-center', 'gap-2'])}
            >
                <HomeIcon /> Anasayfa
            </Link>
            <Typography
                sx={{ color: 'text.primary' }}
            >
                {pageName}
            </Typography>
        </Breadcrumbs>
    )
}