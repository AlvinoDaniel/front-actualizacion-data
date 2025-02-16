// Imports
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// VARIABLE QUE CONTIENE TODAS LAS RUTAS DEL USUARIO LOGUEADO
export const dynamicRoutes = []

export const CoreRoute = {}

const createRouter = () => new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '',
      component: () => import(
        /* webpackChunkName: "layout-[request]" */
        '@/layouts/default/Index'
      ),
      // redirect: { name: 'Usuarios' },
      children: [
        {
          name: 'Principal',
          path: '/',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Dashboard'
          ),
        },
        {
          name: 'Usuarios',
          path: '/usuarios',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Usuarios/index'
          ),
        },
        {
          name: 'Seguridad',
          path: '/seguridad/gestion-de-usuario',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Auth/ResetPassword'
          ),
        },
        {
          name: 'Error-permission',
          path: '/403',
          meta:{
            auth: true,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/AccessDenied.vue'
          ),
        },
      ],
    },
    {
      name: 'Auth',
      path: '/auth',
      meta:{
        auth: false,
      },
      component: () => import(
        /* webpackChunkName: "views-[request]" */
        '@/layouts/Auth/Index'
      ),
      children: [
        {
          name: 'Login',
          path: 'login',
          meta:{
            auth: false,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Auth/Login'
          ),
        },
        {
          name: 'Registrar',
          path: 'registrar',
          meta:{
            auth: false,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Auth/Register'
          ),
        },
        {
          name: 'Manual',
          path: 'manual-usuario',
          meta:{
            auth: false,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Auth/UserGuide'
          ),
        },
        {
          name: 'Recuperar',
          path: 'recuperar-clave',
          meta:{
            auth: false,
          },
          component: () => import(
            /* webpackChunkName: "views-[request]" */
            '@/views/Auth/RecoveryPassword'
          ),
        },
      ],
    },
    {
      name: 'Error',
      path: '/404',
      component: () => import(
        /* webpackChunkName: "views-[request]" */
        '@/views/Error.vue'
      ),
    },
    { path: '*', redirect: '/404' },
  ],
})

const router = createRouter()

export default router

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}
