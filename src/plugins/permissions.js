import router, {AdminRoute} from '../router'
import store from '../store'
import { trailingSlash } from '@/util/helpers'
import api from '../util/request'

router.beforeEach(async (to, from, next) => {
  const hasToken = store.getters['user/authenticated'];

  if(hasToken) {
    if(to.path === '/auth/login/') {
      next({ path: '/' })
    }
    else {
      api.defaults.headers.common['Authorization'] = 'Bearer ' + store.getters['user/token'];

      const hasUser = Object.values(store.getters['user/info']).length > 0;
      if(hasUser) {
        const hasUpdate = store.getters['user/hasUpdate']
        if(hasUpdate || to.path === '/'){
          return next();
        } else {
          store.dispatch('app/setAlert', true);
          next({ path: '/' })
        }
      }
      else {
        try {
          store.dispatch('app/setOverlay', true);
          const { is_admin = false } = await store.dispatch('user/getInfo');
          if(is_admin){
            router.addRoute(AdminRoute)
          }
          router.addRoute({ path: '*', redirect: '/404' })
          store.dispatch('permissions/generateRoutes', is_admin)
          return  next({...to, replace: true})
        } catch (e) {
          console.log('error', e)
          await store.dispatch('user/logout');
          next({ path: '/auth/login/' })
        }
      }
    }
  }
  else {
    if(to.matched.length > 0 && !to.matched.some(record => record.meta.auth)) {
      return next()
    }
    else {
      next({ path: '/auth/login/' })
    }
  }
})

router.afterEach(() => {
  setTimeout(() => {
    store.dispatch('app/setOverlay', false);
  }, 2000);
})
