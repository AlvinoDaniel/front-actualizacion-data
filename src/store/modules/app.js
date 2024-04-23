// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  drawer: null,
  drawerImage: true,
  mini: false,
  gutters: true,
  overlay: false,
  menuApp: [],
  items: [
    {
      title: 'Usuarios',
      icon: 'mdi-account-group-outline',
      to: '/usuarios',
      meta: {
        badge: null,
      },
    },
    {
      title: 'Departamentos',
      icon: 'mdi-home-city-outline',
      to: '/departamentos',
    },
    // {
    //   title: 'Personal',
    //   meta: {
    //     badge: null,
    //   },
    //   icon: 'mdi-account-cog-outline',
    //   to: '/por-corregir',
    // },
    {
      title: 'Nucleos',
      icon: 'mdi-home-assistant',
      to: '/nucleos',
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
