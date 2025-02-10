import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Skeleton from "@mui/material/Skeleton"

/**
 * A component for showing user that process is continue
 */
export default function UISkeleton({ format } : { format: number }) {
    switch(format) {
        case 2:
            return (
                <Container maxWidth="xl"
                    sx={{display: 'flex', flexDirection: 'column', gap: '.8rem'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '.5rem'}}>
                        <Skeleton variant="rounded" height={25} sx={{width: '100%'}} />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                    </Box>
                </Container>
            )
        case 3:
            return (
                <Container maxWidth="xl"
                    sx={{display: 'flex', flexDirection: 'column', gap: '.8rem'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: '.5rem'}}>
                        <Skeleton variant="text" />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                        <Skeleton variant="text" />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                        <Skeleton variant="text" />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                        <Skeleton variant="text" />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                        <Skeleton variant="text" />
                        <Skeleton variant="rounded" height={50} sx={{width: '100%'}} />
                    </Box>
                </Container>
            )
        default: return (
            <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column', gap: '.8rem'}}>
                <Box sx={{display: "flex", justifyContent: 'space-between', gap: "1rem"}}>
                    <Skeleton variant="circular" height={30} width={30} />
                    <Skeleton variant="text"
                        sx={{ fontSize: '1rem', width: '200px' }} />
                    <Skeleton variant="text"
                        sx={{ fontSize: '1rem', width: '400px' }} />
                    <Skeleton variant="circular" height={30} width={30} />
                    <Skeleton variant="circular" height={30} width={30} />
                    <Skeleton variant="circular" height={30} width={30} />
                    <Skeleton variant="circular" height={30} width={30} />
                    <Skeleton variant="circular" height={30} width={30} />
                    <Skeleton variant="circular" height={30} width={30} />
                    <Skeleton variant="circular" height={30} width={30} />
                </Box>
                <Skeleton variant="text"
                    sx={{ fontSize: '1rem', width: '100%' }} />
                <Box sx={{display: "flex", justifyContent: 'space-between', gap: "1rem"}}>
                    <Skeleton variant="circular" height={30} width={30} />
                    <Box>
                        <Skeleton variant="rectangular" width={200} height={112.5} />
                        <Skeleton variant="text"
                            sx={{ fontSize: '1rem', width: '100%' }} />
                    </Box>
                    <Box>
                        <Skeleton variant="rectangular" sx={{ width: '400px', height: '25px' }} />
                        <br/>
                        <Box sx={{display: "flex", gap: "1rem"}}>
                            <Skeleton variant="rounded" width={80} height={40} />
                            <Skeleton variant="rounded" width={80} height={40} />
                            <Skeleton variant="rounded" width={80} height={40} />
                        </Box>
                    </Box>
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                </Box>
                <Box sx={{display: "flex", justifyContent: 'space-between', gap: "1rem"}}>
                    <Skeleton variant="circular" height={30} width={30} />
                    <Box>
                        <Skeleton variant="rectangular" width={200} height={112.5} />
                        <Skeleton variant="text"
                            sx={{ fontSize: '1rem', width: '100%' }} />
                    </Box>
                    <Box>
                        <Skeleton variant="rectangular" sx={{ width: '400px', height: '25px' }} />
                        <br/>
                        <Box sx={{display: "flex", gap: "1rem"}}>
                            <Skeleton variant="rounded" width={80} height={40} />
                            <Skeleton variant="rounded" width={80} height={40} />
                            <Skeleton variant="rounded" width={80} height={40} />
                        </Box>
                    </Box>
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                        <Skeleton variant="circular" height={30} width={30} />
                </Box>
            </Container>
        )
    }
}