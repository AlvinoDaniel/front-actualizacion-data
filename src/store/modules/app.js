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
        is_admin: false
      },
    },
    {
      title: 'Mi Personal',
      icon: 'mdi-account-group-outline',
      to: '/usuarios',
      meta: {
        is_admin: false
      },
    },
    {
      title: 'Reporte',
      icon: 'mdi-note-text-outline',
      to: '/administrator/report',
      meta: {
        is_admin: true
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
