// Utilities
import { make } from 'vuex-pathify'
import api from '../../util/request'
import * as cookies from '../../util/auth_user'
import { resetRouter } from '@/router'

const state = {
  info:{},
  token: cookies.GET_TOKEN(),
}

const mutations = {
  ...make.mutations(state),
  RESET_INFO (state) {
    state.info  = {};
    state.token = null;
  }
}

const actions = {
  async getInfo ({commit}) {
    const { data } = await api.get('auth/me');
    commit('info', data.data.user);
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
      uni_admin: unidades.length > 0 ? unidades.map(item => item?.codigo_unidad_admin).join(', ') : 'S/R',
      uni_ejec: unidades.length > 0 ? unidades.map(item => item?.codigo_unidad_ejec).join(', ') : 'S/R',
      nucleo: state.info?.personal?.nucleo?.nombre,
      cedula: state.info?.personal?.cedula_identidad,
      nombres_apellidos: state.info?.personal?.nombres_apellidos,
      cargo_jefe: state.info?.personal?.cargo_jefe ?? 'S/R',
      cargo_opsu: state.info?.personal?.cargo_opsu ?? 'S/R',
      personal: state.info?.personal,
    } : null
    return data;

  },
  departamento (state) {
    const { departamento } = state.info

    return state.info.id
      ? {
          id: departamento.id,
          nombre: departamento.nombre,
          siglas: departamento.siglas,
          jefe: departamento.jefe ? departamento.jefe.nombres_apellidos : 'Jefe del Departamento',
          cargo_jefe: departamento.jefe ? departamento.jefe.descripcion_cargo : '',
        }
      : ''
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
