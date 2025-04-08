import { dynamicRoutes } from '@/router'
import { dispatch } from 'vuex-pathify'


/**
 * Usa meta.p para determinar si el modulo tiene permiso
 * @param permisos
 * @param route
 */
function hasPermission(is_admin, route) {
  if (route.meta && route.meta.is_admin) {
    return is_admin
  } else {
    return true
  }
}

/**
 * Filtrar todas las rutas por recursividad
 * @param routes asyncRoutes
 * @param permisos
 */
export function filterAsyncRoutes(routes, is_admin) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(is_admin, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permisos)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
  }
}

const actions = {
  generateRoutes({ commit, rootGetters }, is_admin) {
    const menuGenerated = filterAsyncRoutes(rootGetters['app/items'], is_admin)
    dispatch('app/setMenuApp', menuGenerated)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
