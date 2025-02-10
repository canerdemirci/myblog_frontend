'use client'

import { routeMap } from '@/utils/routeMap'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { fetchNextAPI } from '@/lib/custom_fetch'

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'

// Material Components
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'

// Material icons
import MenuIcon from '@mui/icons-material/Menu'
import ArticleIcon from '@mui/icons-material/Article'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NoteIcon from '@mui/icons-material/Note'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TagIcon from '@mui/icons-material/Tag'
import CommentIcon from '@mui/icons-material/Comment'
import UserIcon from '@mui/icons-material/AccountBox'
import AddBoxIcon from '@mui/icons-material/AddBox'
import HomeIcon from '@mui/icons-material/Home'
import ExitIcon from '@mui/icons-material/ExitToApp'
import ListItemIcon from '@mui/material/ListItemIcon'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MaintenanceIcon from '@mui/icons-material/Settings'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
})

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
    open?: boolean
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
)

export default function Header() {
    const theme = useTheme()
    const router = useRouter()
    
    const [open, setOpen] = useState(false);
    const [logOutProcess, setLogOutProcess] = useState<boolean>(false)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    async function handleLogout() {
        setLogOutProcess(true)

        fetchNextAPI(routeMap.api.logOut.root)
            .then(_ => router.push(routeMap.admin.login.root))
            .catch(_ => alert('Sunucu hatası!'))
            .finally(() => setLogOutProcess(false))
    }

    const menuData = [
        {
            title: 'Ana Panel',
            href: routeMap.admin.root,
            icon: <Tooltip title="Ana Panel" enterDelay={750}><DashboardIcon /></Tooltip>
        },
        {
            title: 'Makaleler',
            href: routeMap.admin.posts.root,
            icon: <Tooltip title="Makaleler" enterDelay={750}><ArticleIcon /></Tooltip>
        },
        {
            title: 'Notlar',
            href: routeMap.admin.notes.root,
            icon: <Tooltip title="Notlar" enterDelay={750}><NoteIcon /></Tooltip>
        },
        {
            title: 'Etiketler',
            href: routeMap.admin.tags.root,
            icon: <Tooltip title="Etiketler" enterDelay={750}><TagIcon /></Tooltip>
        },
        {
            title: 'Yorumlar',
            href: routeMap.admin.comments.root,
            icon: <Tooltip title="Yorumlar" enterDelay={750}><CommentIcon /></Tooltip>
        },
        {
            title: 'Üyeler',
            href: routeMap.admin.users.root,
            icon: <Tooltip title="Üyeler" enterDelay={750}><UserIcon /></Tooltip>
        },
        {
            divider: true,
        },
        {
            title: 'Yeni Makale',
            href: routeMap.admin.posts.upsertPost(),
            icon: <Tooltip title="Yeni Makale" enterDelay={750}><AddBoxIcon /></Tooltip>
        },
        {
            title: 'Yeni Not',
            href: routeMap.admin.notes.createNote,
            icon: <Tooltip title="Yeni Not" enterDelay={750}><NoteAddIcon /></Tooltip>
        },
        {
            divider: true,
        },
        {
            title: 'Bakım ve Ayarlar',
            href: routeMap.admin.settings.root,
            icon: <Tooltip title="Bakım ve Ayarlar" enterDelay={750}><MaintenanceIcon /></Tooltip>
        },
        {
            divider: true,
        },
        {
            title: 'Güvenli Çıkış',
            href: '#',
            icon: <Tooltip title="Güvenli Çıkış" enterDelay={750}><ExitIcon /></Tooltip>
        },
    ]

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* Appbar */}
            <AppBar position="fixed" sx={{backgroundColor: '#212121'}} open={open}>
                <Toolbar>
                    {/* Appbar Menu Button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            open && { display: 'none' },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* Appbar title */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Blog Yönetici Paneli
                    </Typography>
                    {/* Appbar actions */}
                    <Box display="flex" gap="1rem">
                        <Link
                            color='inherit'
                            underline='none'
                            href={routeMap.blog.posts.root}
                            target="_blank"
                        >
                            <Button color='inherit' endIcon={<HomeIcon />}>BLOG'A GİT</Button>
                        </Link>
                        <Link
                            color='inherit'
                            underline='none'
                            href={routeMap.admin.posts.upsertPost()}
                        >
                            <Button color='inherit' endIcon={<AddBoxIcon />}>Yeni Makale</Button>
                        </Link>
                        <Link
                            color='inherit'
                            underline='none'
                            href={routeMap.admin.notes.createNote}
                        >
                            <Button color='inherit' endIcon={<NoteAddIcon />}>Yeni Not</Button>
                        </Link>
                        <Button
                            color="inherit"
                            endIcon={<ExitIcon />}
                            disabled={logOutProcess}
                            onClick={handleLogout}
                        >
                            Güvenli Çıkış
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Drawer */}
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {
                        menuData.map((menu, index) => (
                            menu.divider
                                ? <Divider key={index} />
                                : <Link
                                    key={index}
                                    color='inherit'
                                    underline='none'
                                    href={menu.href}
                                    onClick={() => {
                                        if (menu.href === '#') {
                                            handleLogout()
                                        }
                                    }}
                                >
                                    <ListItem disablePadding sx={{ display: 'block' }}>
                                        <ListItemButton
                                            sx={[
                                                {
                                                    minHeight: 48,
                                                    px: 2.5,
                                                },
                                                open
                                                    ? {
                                                        justifyContent: 'initial',
                                                    }
                                                    : {
                                                        justifyContent: 'center',
                                                    },
                                            ]}
                                        >
                                            <ListItemIcon
                                                sx={[
                                                    {
                                                        minWidth: 0,
                                                        justifyContent: 'center',
                                                    },
                                                    open
                                                        ? {
                                                            mr: 3,
                                                        }
                                                        : {
                                                            mr: 'auto',
                                                        },
                                                ]}
                                            >
                                                {menu.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={menu.title}
                                                sx={[
                                                    open
                                                        ? {
                                                            opacity: 1,
                                                        }
                                                        : {
                                                            opacity: 0,
                                                        },
                                                ]}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            )
                        )
                    }
                </List>
            </Drawer>
        </Box>
    )
}