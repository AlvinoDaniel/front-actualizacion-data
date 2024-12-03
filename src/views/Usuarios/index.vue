<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0">
      <v-col cols="12"  md="5" class="pt-1 d-flex align-center">
        <h3 class="blue-grey--text">
          <v-icon color="blue-grey" left>mdi-account-group-outline</v-icon> Mi Personal
        </h3>
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
      <v-col cols="12" md="7" class="pt-1 d-flex align-center justify-end">
        <search-expand v-model="filterData" />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              color="blue-grey"
              v-bind="attrs"
              v-on="on"
              @click="modalShow = true"
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
          <!--
          :loading="loadingData" -->
        <v-data-table
          sort-by="fecha_enviado"
          class="inbox"
          hide-default-footer
          no-data-text="No hay Personal Registrado"
          :search="filterData"
          :headers="headers"
          :items="personal"
          :loading="loading"
          :sort-desc="true"
          :page.sync="page"
          @page-count="pageCount = $event"
          @pagination="infoPagination = $event"
        >
          <template v-slot:item.iconos="{ item }">
            <div class="d-flex justify-center align-center ml-3">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="editRow(item)"
                    >
                    <v-icon size="19" class="mx-2" color="blue-grey">mdi-account-edit-outline</v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="personalDelete(item)"
                    >
                    <v-icon size="19" class="mx-2" color="blue-grey">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </div>
          </template>
           <template v-slot:item.nombres_apellidos="{ item }">
            <span
              v-if="item.nombres_apellidos"
              class="font-weight-bold"
               v-text="item.nombres_apellidos"
            />
           </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <create-and-edit
      v-model="modalShow"
      :action="isCreate ? 'crear' : 'edit'"
      :data="dataSelect"
      :departments="[]"
      @procesado="getPersonal"
      />
  </v-container>
</template>
<script>

import { getAllPersonal, deletePersonal } from '@/services/usuario'
import { Base64 } from 'js-base64';
export default {
  name: 'Personal',
  components: {
    CreateAndEdit: () => import(
      /* webpackChunkName: "modal-create" */
      './components/CreateAndEdit.vue'
    )
  },
  data: () => ({
    loading: false,
    updating: false,
    modalShow: false,
    isCreate: true,
    dataSelect: null,
    headers: [
      { text: 'Cédula Identidad', value: 'cedula_identidad' },
      { text: 'Nombres y Apellidos', value: 'nombres_apellidos' },
      { text: 'Tipo Personal', value: 'tipo_personal_descripcion' },
      { text: 'Núcleo', value: 'nucleo_nombre'},
      { text: 'Unidad Administrativa', value: 'codigo_unidad_admin'},
      { text: 'Unidad Ejecutora', value: 'codigo_unidad_ejec'},
      { text: 'Acciones', value: 'iconos', align: ' px-0', width: '100px' },
    ],
    personal: [],
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
    paginationText () {

      return this.infoPagination
        ? `${this.infoPagination.pageStart + 1} - ${this.infoPagination.pageStop} de ${this.infoPagination.itemsLength}`
        : ''

    }
  },
  created () {
    this.getPersonal()
  },
  methods: {

    async getPersonal (actualizar=false) {
      if(actualizar) this.updating = true
      this.loading = true
      try {
        const { personal = [] } = await getAllPersonal()
        this.personal = personal
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        if(actualizar) this.updating = false
      }
    },
    editRow(row){
      this.dataSelect = row;
      this.modalShow = true;
      this.isCreate = false;
    },
    async personalDelete(row){
      const result = await this.$root.$confirm(
        '¿Está Seguro?',
        `Desea eliminar el Personal ${row?.nombres_apellidos}`
      );

      if(result){
        this.updating = true
        try {
          const { message } = await deletePersonal({id: row?.id})
          this.getPersonal()
          this.$root.$showAlert(message, 'success');
        } catch (error) {
          console.log(error)
            this.$root.$showAlert(
              'Lo sentimos, hubo un error al intentar realizar esta acción en el Servidor.',
              'error'
            );
        } finally {
          this.updating = false
        }
      }
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
