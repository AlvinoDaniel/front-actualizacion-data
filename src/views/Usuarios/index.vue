<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0">
      <v-col cols="12" sm="7" md="6" class="pt-1 d-flex align-center">
        <h3 class="blue-grey--text">Usuarios</h3>
        <!-- <v-tabs>
          <v-tab :ripple="false" @click="assignFilter('')"><strong>Todos</strong>({{data.length}})</v-tab>
          <v-tab :ripple="false" @click="assignFilter('oficio')">
            <v-icon color="info">mdi-circle-medium</v-icon>
           <strong>Oficio</strong>({{cantOficios}})
          </v-tab>
          <v-tab :ripple="false" @click="assignFilter('circular')">
            <v-icon color="tertiary">mdi-circle-medium</v-icon>
           <strong>Circular</strong>({{cantCopias}})
          </v-tab>
        </v-tabs> -->
      </v-col>
      <v-col cols="12" sm="5" md="6" class="pt-1 d-flex align-center justify-end">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              color="blue-grey"
              v-bind="attrs"
              v-on="on"
              :to="{path: '/usuarios/gestionar'}"
              >
              <!-- @click="getBandejaRecibidos(true)" -->
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              color="blue-grey"
              v-bind="attrs"
              v-on="on"
              @click="getBandejaRecibidos(true)"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Actualizar</span>
        </v-tooltip>
        <v-pagination
          class="header-pagination"
          v-model="page"
          :length="pageCount"
          circle
          total-visible="0"
        ></v-pagination>
        <span class="text-pagination" v-text="paginationText" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
          <!-- :search="search"
          :loading="loadingData" -->
        <v-data-table
          sort-by="fecha_enviado"
          class="inbox"
          hide-default-footer
          no-data-text="No hay Documentos Recibidos"
          :headers="headers"
          :items="users"
          :item-class="setColorRow"
          :loading="loading"
          :sort-desc="true"
          :page.sync="page"
          @page-count="pageCount = $event"
          @pagination="infoPagination = $event"
          @click:row="editUser"
        >
          <template v-slot:item.iconos="{ item }">
            <div class="d-flex justify-center align-center ml-3">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    >
                    <!-- @click.stop="deleteDoc(item)" -->
                    <v-icon size="19" class="mx-2" color="blue-grey">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </div>
          </template>
           <template v-slot:item.personal="{ item }">
            <span
              v-if="item.personal"
              class="font-weight-bold"
               v-text="item.personal.nombres_apellidos"
            />
           </template>
          <template v-slot:item.status="{ item }">
            <div class="d-flex align-center">
              <v-icon :color="colorTipo[item.status]">mdi-circle-medium</v-icon>
              <span
                class="font-weight-bold text-uppercase"
                :class="{'tertiary--text': item.status === 0, 'icono--text': item.status === 1,}"
                v-text="item.status === 1 ? 'ACTIVO' : 'INACTIVO'"
              />
            </div>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

import { getAllUsers } from '@/services/usuario'
import { Base64 } from 'js-base64';
export default {
  name: 'Recibidos',
  data: () => ({
    loading: false,
    updating: false,
    headers: [
      { text: 'Usuario', value: 'usuario' },
      { text: 'Email', value: 'email', align: '' },
      { text: 'Personal', value: 'personal', align: '' },
      { text: 'Estatus', value: 'status', width: '120px', align: 'me' },
      // { text: 'Acciones', value: 'iconos', align: ' px-0', width: '100px' },
    ],
    users: [],
    colorTipo: {
      0: 'tertiary',
      1: 'icono'
    },
    filterData: '',
    page: 1,
    pageCount: 0,
    infoPagination: {
      pageStart: 0,
      pageStop: 0,
      itemsLength:0,
    }
  }),
  computed: {
    cantOficios () {
      return this.data.length > 0
        ? this.data.filter(item => item.tipo_documento === 'oficio').length
        : 0
    },
    cantCopias () {
      return this.data.length > 0
        ? this.data.filter(item => item.tipo_documento === 'circular').length
        : 0
    },
    itemsData () {
      return this.data.filter(item => item.tipo_documento.includes(this.filterData))
    },
    paginationText () {

      return this.infoPagination
        ? `${this.infoPagination.pageStart + 1} - ${this.infoPagination.pageStop} de ${this.infoPagination.itemsLength}`
        : ''

    }
  },
  created () {
    this.getUsers()
  },
  methods: {

    async getUsers (actualizar=false) {
      if(actualizar) this.updating = true
      this.loading = true
      try {
        const { usuarios } = await getAllUsers()
        this.users = usuarios
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        if(actualizar) this.updating = false
      }
    },


    editUser (row) {
      // this.$router.push({ path: `/documento/${ row.id }`, query: {tab: 'recibido'} })
      this.$router.push({ name: 'Gestionar Usuario', params: { id: row.id } })
    },
    assignFilter(filter) {
      this.filterData = filter
    },
    setColorRow(item) {
      const NOT_READED = item.leido === 0
      return NOT_READED ? 'unread' : ''
    }
  },
}
</script>
<style>
.at {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1 1 auto;
    -webkit-flex: 1 1 auto;
    flex: 1 1 auto;
    min-width: 0;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    overflow: visible;
    white-space: nowrap;
    vertical-align: middle;
    align-items: center;
}
</style>
