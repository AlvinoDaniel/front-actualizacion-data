// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  gutters: true,
  overlay: false,
  alert: false,
  menuApp: [],
  items: [
    {
      title: 'Principal',
      icon: 'mdi-home-outline',
      to: '/',
      meta: {
        is_admin: false,
        default: true
      },
    },
    {
      title: 'Mi Personal',
      icon: 'mdi-account-group-outline',
      to: '/mi-personal',
      meta: {
        is_admin: false,
        default: true
      },
    },
    {
      title: 'Personal Rezagado',
      icon: 'mdi-account-switch-outline',
      to: '/personal-rezagados',
      meta: {
        is_admin: false,
        default: false,
        permission: 'registrar-personal-rezagado'
      },
    },
    {
      title: 'Reporte',
      icon: 'mdi-note-text-outline',
      to: '/report',
      meta: {
        is_admin: true,
        default: false,
        permission: 'reporte-general'
      },
    },
    {
      title: 'Gestion de Jefes',
      icon: 'mdi-account-tie-outline',
      to: '/adminitrator/gestion-jefes',
      meta: {
        is_admin: true,
        default: false,
        permission: 'gestionar-jefe'
      },
    },
    {
      title: 'Gestion de Núcleos',
      icon: 'mdi-home-assistant',
      to: '/adminitrator/nucleos',
      meta: {
        is_admin: true,
        default: false,
        permission: 'gestion-nucleos'
      },
    },
    {
      title: 'Unidad Ejecutora',
      icon: 'mdi-home-export-outline',
      to: '/adminitrator/unidad-ejecutora',
      meta: {
        is_admin: true,
        default: false,
        permission: 'gestion-unidad-ejecutora'
      },
    },
    {
      title: 'Unidad Administrativa',
      icon: 'mdi-home-city-outline',
      to: '/adminitrator/unidad-administrativa',
      meta: {
        is_admin: true,
        default: false,
        permission: 'gestion-unidad-administrativa'
      },
    }
  ],
  statusClient:{
    rojo: '#FF353E',
    amarillo: '#FB8C00',
    verde: '#009B35'
  }
}

const mutations = {
  ...make.mutations(state),
}

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    //
  },
}

const getters = {
  overlay(state){
    return state.overlay;
  },
  alert(state){
    return state.alert;
  },
  items(state){
    return state.items;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
