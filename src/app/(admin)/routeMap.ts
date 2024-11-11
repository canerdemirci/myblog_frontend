// Next js internal api routes
const api_login = '/auth/login'
const api_logout = '/auth/logout'
const api_refreshLogin = '/auth/refresh'

const admin = '/admin'
const admin_login = '/login'
const admin_posts = '/posts'
const admin_upsertPost = '/upsert_post'
const admin_tags = '/tags'
const admin_comments = '/comments'

const blog = '/blog'
const blog_post = '/posts'

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
        tags: {
            root: `${admin + admin_tags}`,
        },
        comments: {
            root: `${admin + admin_comments}`
        }
    },
    blog: {
        root: `${blog}`,
        posts: {
            root: '/',
            postById: (id: string) => `${blog + blog_post + '/' + id}`
        }
    }
}