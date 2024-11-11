import Link from '@mui/material/Link'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import HomeIcon from '@mui/icons-material/Home'
import { routeMap } from '../../../routeMap'

export default function UIBreadcrumbs({ pageName }: { pageName: string }) {
    return (
        <Breadcrumbs aria-label="breadcrumb" className="bg-slate-100 p-4">
            <Link underline="hover" color="inherit" href={routeMap.admin.root} className='flex items-center gap-2'>
                <HomeIcon /> Anasayfa
            </Link>
            <Typography sx={{ color: 'text.primary' }}>
                {pageName}
            </Typography>
        </Breadcrumbs>
    )
}