// Static routes
const static_base = process.env.NEXT_PUBLIC_BLOG_API_BASE_URL + '/static'

// Next js internal api routes
const api_login = '/auth/login'
const api_logout = '/auth/logout'
const api_refreshLogin = '/auth/refresh'
const api_usertoken = '/auth/usertoken'
const api_admintoken = '/auth/admintoken'

// Admin panel routes
const admin = '/admin'
const admin_login = '/login'
const admin_posts = '/posts'
const admin_upsertPost = '/upsert_post'
const admin_notes = '/notes'
const admin_createNote = '/create_note'
const admin_tags = '/tags'
const admin_comments = '/comments'
const admin_users = '/users'
const admin_settings = '/settings'

// Blog routes
const blog = '/blog'
const blog_posts = '/posts'
const blog_notes = '/notes'

export const routeMap = {
    root: `/`,
    api: {
        login: {
            root: api_login,
        },
        refreshLogin: {
            root: api_refreshLogin,
        },
        logOut: {
            root: api_logout,
        },
        usertoken: {
            root: api_usertoken,
        },
        admintoken: {
            root: api_admintoken,
        }
    },
    admin: {
        root: `${admin}`,
        login: {
            root: `${admin + admin_login}`
        },
        posts: {
            root: `${admin + admin_posts}`,
            upsertPost: (id?: string) => `${admin + admin_posts + admin_upsertPost}`
                + (id !== undefined ? `?id=${id}` : ''),
        },
        notes: {
            root: `${admin + admin_notes}`,
            createNote: `${admin + admin_notes + admin_createNote}`,
        },
        tags: {
            root: `${admin + admin_tags}`,
        },
        comments: {
            root: `${admin + admin_comments}`
        },
        users: {
            root: `${admin + admin_users}`
        },
        settings: {
            root: `${admin + admin_settings}`
        },
    },
    blog: {
        root: `${blog}`,
        posts: {
            root: '/',
            postById: (id: string) => `${blog + blog_posts + '/' + id}`
        },
        notes: {
            root: `${blog + blog_notes}`,
            noteById: (id: string) => `${blog + blog_notes + '/' + id}`
        },
        users: {
            register: {
                root: `${blog + '/register'}`
            },
            profile: {
                root: `${blog + '/users/profile'}`
            },
            signin: `${'/api/auth/signin'}`
        }
    },
    static: {
        root: static_base
    }
}