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
        badge: null,
      },
    },
    {
      title: 'Mi Personal',
      icon: 'mdi-account-group-outline',
      to: '/usuarios',
      meta: {
        badge: null,
      },
    },

  ],
  statusClient:{
    rojo: '#FF353E',
    amarillo: '#FB8C00',
    verde: '#009B35'
  }
}

const mutations = {
  ...make.mutations(state),
  NEW_DOCUMENTS(state, news){
    let { meta } = state.items[0]
    meta.badge = news
  },

  NEW_DOCUMENTS_CORRECT(state, news){
    let { meta } = state.items[2]
    meta.badge = news
  }

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
