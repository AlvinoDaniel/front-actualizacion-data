// Utilities
import { make } from 'vuex-pathify'
import api from '../../util/request'
import * as cookies from '../../util/auth_user'
import { resetRouter } from '@/router'

const state = {
  info:{},
  token: cookies.GET_TOKEN(),
  hasUpdate: false,
}

const mutations = {
  ...make.mutations(state),
  RESET_INFO (state) {
    state.info  = {};
    state.token = null;
    state.hasUpdate = false;
  }
}

const actions = {
  async getInfo ({commit}) {
    const { data } = await api.get('auth/me');
    commit('info', data.data.user);
    commit('hasUpdate', data.data.user?.personal?.has_update ?? false)
    return data.data.user;
  },
  async login ({ commit }, credentials) {
    const response = await api.post('auth/login', credentials)

    cookies.SET_TOKEN(response.data.data.token)
    commit('token', response.data.data.token)
    // commit('info', response.data.user);
  },
  async logout ({ commit, dispatch }) {
    dispatch('app/setOverlay', true, { root: true});
    try {
      await api.get('auth/logout');
      cookies.REMOVE_USER();
    } catch (error) {
      cookies.REMOVE_USER();
    }
    resetRouter();
    commit('RESET_INFO');
    // dispatch('app/setMenuApp', [], { root: true});
    // dispatch('permissions/SET_ROUTES', [], { root: true});
  },

  closeSession ({commit}) {
    cookies.REMOVE_USER();
    commit('RESET_INFO');
    resetRouter();
  },

  deleteInfo ({commit}) {
    commit('info', {});
    resetRouter();
  },

  updateStatusDataUser ({commit}, value) {
    commit('hasUpdate', value);
  }
}

const getters = {
  ...make.getters(state),
  authenticated (state) {
    return state.token !== null
  },
  infoBasic (state) {
    const {unidades = [] } = state.info.personal;
    const data = state.info.id ? {
      uni_admin: unidades.length > 0 ?  `${unidades[0]?.entidad?.descripcion_unidad_admin}` : 'S/R',
      uni_ejec: unidades.length > 0 ?  `${unidades[0]?.entidad?.descripcion_unidad_ejec}` : 'S/R',
      escuela: unidades.length > 0 ?  unidades[0]?.entidad?.descripcion_escuela : 'S/R',
      correo_dependencia: unidades.length > 0 ?  unidades[0]?.entidad?.correo_dependencia ?? '' : 'S/R',
      nucleo: state.info?.personal?.nucleo?.nombre,
      cod_nucleo: state.info?.personal?.nucleo?.codigo_concatenado,
      cedula: state.info?.personal?.cedula_identidad,
      nombres_apellidos: state.info?.personal?.nombres_apellidos,
      cargo_jefe: state.info?.personal?.cargo_jefe ?? 'S/R',
      cargo_opsu: state.info?.personal?.cargo_opsu ?? 'S/R',
      has_update: state.info?.pesonal?.has_update ?? false,
      tipo_personal: state.info?.personal?.tipo_personal?.descripcion,
      personal: state.info?.personal,
      unidades,
      permissions: state.info.permissions
    } : null
    return data;
  },
  permissions (state){
     const {permissions = [] } = state.info;
     return permissions
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
