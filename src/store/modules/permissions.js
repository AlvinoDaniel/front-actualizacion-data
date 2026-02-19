import { dynamicRoutes } from '@/router'
import { dispatch } from 'vuex-pathify'


/**
 * Usa meta.p para determinar si el modulo tiene permiso
 * @param permisos
 * @param route
 */
function hasPermission(permisos, route) {
  if (route.meta && !route.meta.default) {
    return permisos.some((item) => item === route.meta?.permission)
  } else {
    return true
  }
}

/**
 * Filtrar todas las rutas por recursividad
 * @param routes asyncRoutes
 * @param permisos
 */
export function filterAsyncRoutes(routes, permisos, issa) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permisos, tmp) || issa) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permisos, issa)
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
  generateRoutes({ commit, rootGetters }, {permissions, issa = false}) {
    return new Promise(resolve => {
      let accessedRoutes = filterAsyncRoutes(dynamicRoutes, permissions, issa)
      const menuGenerated = filterAsyncRoutes(rootGetters['app/items'], permissions, issa)
      dispatch('app/setMenuApp', menuGenerated)
      resolve(accessedRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
