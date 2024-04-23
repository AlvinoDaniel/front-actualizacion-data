<template>
  <v-container
    id="departamentos"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0">
      <v-col cols="12" sm="7" md="5" class="pt-1 d-flex align-center">
        <h3 class="blue-grey--text">
          <v-icon color="blue-grey" left>mdi-home-city-outline</v-icon> Departamentos
        </h3>
      </v-col>
      <v-col cols="12" sm="5" md="7" class="pt-1 d-flex align-center justify-end">
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
              @click="getDepartaments()"
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
          :search="filterData"
          :headers="headers"
          :items="itemsData"
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
                    @click.stop="edit(item)"
                    >
                    <v-icon size="19" class="mx-2" color="blue-grey">mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <span>Editar Departamento</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteDepartmento(item)"
                    >
                    <v-icon size="19" class="mx-2" color="blue-grey">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </div>
          </template>
           <template v-slot:item.nombre="{ item }">
            <span
              v-if="item.nombre"
              class="font-weight-bold"
               v-text="item.nombre"
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
      @procesado="getDepartaments"
    />
  </v-container>
</template>
<script>

import { getListDepartaments, deleteDepartament } from '@/services/departamento'
import { Base64 } from 'js-base64';
export default {
  name: 'Departamentos',
  components: {
    CreateAndEdit: () => import(
      /* webpackChunkName: "modal-success" */
      './components/CreateAndEdit.vue'
    ),
  },
  data: () => ({
    loading: false,
    updating: false,
    headers: [
      { text: 'COD.', value: 'codigo' },
      { text: 'Nombre', value: 'nombre', align: '' },
      { text: 'Siglas', value: 'siglas', align: '' },
      { text: 'Jefe', value: 'jefe_nombre', align: '' },
      { text: 'Núcleo', value: 'nucleo_nombre' },
      { text: '', value: 'iconos', align: ' px-0', width: '100px' },
    ],
    departaments: [],
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
    },
    modalShow: false,
    isCreate: true,
    dataSelect: null
  }),
  computed: {
    paginationText () {

      return this.infoPagination
        ? `${this.infoPagination.pageStart + 1} - ${this.infoPagination.pageStop} de ${this.infoPagination.itemsLength}`
        : ''
    },
    itemsData() {
      return this.departaments.length > 0
        ? this.departaments.map(item => ({
          ...item,
          jefe_nombre: item?.jefe?.nombres_apellidos,
          nucleo_nombre: item?.nucleo?.nombre,
        }))
        : []
    }

  },
  created () {
    this.getDepartaments()
  },
  methods: {

    async getDepartaments () {
      this.loading = true
      try {
        const { departamentos } = await getListDepartaments()
        this.departaments = departamentos
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },


    edit(row) {
      this.dataSelect = row
      this.isCreate = false
      this.modalShow = true
    },
    async deleteDepartmento(row){
      const result = await this.$root.$confirm(
        '¿Está Seguro?',
        `Desea eliminar el departamento ${row?.nombre}`
      );

      if(result){
        this.updating = true
        try {
          const { message } = await deleteDepartament({id: row?.id})
          this.getDepartaments()
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
