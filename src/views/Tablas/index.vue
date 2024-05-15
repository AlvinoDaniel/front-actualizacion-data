<template>
  <v-container
    id="tablas"
    fluid
    tag="section"
    class="pa-0"
  >
      <div class="d-flex">
        <v-navigation-drawer
          class=""
          width="25%"
          permanent
          style="height:100%; min-height:100vh"
        >
          <h3 class="black--text px-4 py-3">
            Gestión de Tablas
          </h3>
          <div class="px-4 py-2">
            <search-expand v-model="search" />
          </div>
          <v-list>
            <v-list-item
              v-for="item in tables"
              :key="item.name"
              @click="setComponent(item.component)"
              link
            >
              <v-list-item-icon class="mr-2">
                <v-icon>mdi-table</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <component
          :is="currentComponent"
        />
      </div>
  </v-container>
</template>
<script>

import Nucleos from './Nivel_Instruccion/index.vue'
export default {
  name: 'Nucleos',
  data: () => ({
    currentComponent: null,
    search: '',
    tables: [
      {
        name: 'Nivel de Instrucción',
        component: Nucleos,
      }
    ]
  }),
  methods: {
    setComponent(componente){
      this.currentComponent = componente;
    }
  },
}
</script>

