'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { nextApi } from '@/lib/axios'
import { routeMap } from '../../../routeMap'

// Material icons
import MenuIcon from '@mui/icons-material/Menu'
import ArticleIcon from '@mui/icons-material/Article'
import NoteIcon from '@mui/icons-material/Note'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import TagIcon from '@mui/icons-material/Tag'
import CommentIcon from '@mui/icons-material/Comment'
import CreateIcon from '@mui/icons-material/Article'
import ExitIcon from '@mui/icons-material/ExitToApp'
import ListItemIcon from '@mui/material/ListItemIcon'

// Material components
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Link from '@mui/material/Link'

export default function Header() {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [logOutProcess, setLogOutProcess] = useState<boolean>(false)

    const menuData = [
        {
            title: 'Makaleler',
            href: routeMap.admin.posts.root,
            icon: <ArticleIcon />
        },
        {
            title: 'Notlar',
            href: routeMap.admin.notes.root,
            icon: <NoteIcon />
        },
        {
            title: 'Yeni Not',
            href: routeMap.admin.notes.createNote,
            icon: <NoteAddIcon />
        },
        {
            title: 'Etiketler',
            href: routeMap.admin.tags.root,
            icon: <TagIcon />
        },
        {
            title: 'Yorumlar',
            href: routeMap.admin.comments.root,
            icon: <CommentIcon />
        },
    ]

    function toggleDrawer(newOpen: boolean) {
        setMenuOpen(newOpen)
    }

    async function handleLogout() {
        setLogOutProcess(true)
        nextApi.get(routeMap.api.logOut.root)
            .then(_ => router.push(routeMap.admin.login.root))
            .catch(_ => alert('Sunucu hatası!'))
            .finally(() => setLogOutProcess(false))
    }

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
            <List>
                {menuData.map((d, i) => (
                    <Link key={i} color='inherit' underline='none' href={d.href}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {d.icon}
                                </ListItemIcon>
                                <ListItemText primary={d.title} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Blog Yönetici Paneli
                </Typography>
                <Box display="flex" gap="1rem">
                    <Link color='inherit' underline='none' href={routeMap.admin.posts.upsertPost()}>
                        <Button color='inherit' endIcon={<CreateIcon />}>Yeni Makale</Button>
                    </Link>
                    <Button color="inherit" endIcon={<ExitIcon />}
                        disabled={logOutProcess}
                        onClick={handleLogout}>Güvenli Çıkış</Button>
                </Box>
                <Drawer open={menuOpen} onClose={() => toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>
            </Toolbar>
        </AppBar>
    )
}
