'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { routeMap } from '../../../../utils/routeMap'
import { clsx } from 'clsx'

import { fetchNextAPI } from '@/lib/custom_fetch'

// Material UI Components
import Container from "@mui/material/Container"
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography"

// PinField component and its styles
import PinField from 'react-pin-field'
import './styles.scss'

export default function LoginPage() {
    const router = useRouter()
    const pinRef = useRef<HTMLInputElement[]>([])
    
    const [error, setError] = useState<boolean>(false)
    const [pending, setPending] = useState<boolean>(false)

    function handleLogin(pin: string) {
        setPending(true)
        
        fetchNextAPI(
            routeMap.api.login.root,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin })
            }
        )
            .then(_ => router.push(routeMap.admin.root))
            .catch(_ => {
                setError(true)
                setPending(false)
                pinRef.current?.forEach(input => (input.value = ""));
                pinRef && pinRef.current && pinRef.current[0].focus()
            })
    }

    return (
        <Container
            maxWidth="sm"
            sx={{ textAlign: 'center' }}
        >
            <Box
                sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    gap: '2rem', flexDirection: 'column', paddingTop: '4rem'
                }}
            >
                    <Typography variant="h4" align="center">
                        Yönetici Paneli Girişi
                    </Typography>
                    <Typography variant="h6" align="center">
                        Pin Giriniz
                    </Typography>
                    <Box>
                        <PinField
                            ref={pinRef}
                            autoFocus={true}
                            type="password"
                            className={clsx(["pin-field", "pin-code"])}
                            length={6}
                            validate="0123456789"
                            inputMode='numeric'
                            onComplete={handleLogin}
                            disabled={pending}
                        />
                    </Box>
                    {
                        error && <Typography variant="body1" color='error' align="center">
                            HATALI PİN!
                        </Typography>
                    }
            </Box>
        </Container>
    )
}