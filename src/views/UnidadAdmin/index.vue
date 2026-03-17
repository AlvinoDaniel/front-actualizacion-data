<template>
  <v-container
    id="unidAdmin"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0">
      <v-col cols="12" sm="7" md="5" class="pt-1 d-flex align-center">
        <h3 class="blue-grey--text">
          <v-icon color="blue-grey" left>mdi-home-city-outline</v-icon> Unidades Administrativas
        </h3>
      </v-col>
      <v-col cols="12" sm="5" md="7" class="pt-1 d-flex align-center justify-end">
        <search-expand v-model="filterData" placeholder="Buscar unidad" />
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
              @click="getUnidades()"
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
          class="inbox"
          hide-default-footer
          no-data-text="No hay Unidades registradas"
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
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteUnid(item)"
                    >
                    <v-icon size="19" class="mx-2" color="blue-grey">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </div>
          </template>
           <template v-slot:item.descripcion="{ item }">
            <span
              v-if="item.descripcion"
              class="font-weight-bold"
               v-text="item.descripcion"
            />
           </template>
           <template v-slot:item.unidad_padre="{ item }">
            <span
              v-if="item.unidad_padre"
               v-text="item.unidad_padre.descripcion"
            />
           </template>
           <template v-slot:item.nucleo="{ item }">
            <span
              v-if="item.nucleo"
               v-text="item.nucleo.nombre"
            />
           </template>
           <template v-slot:item.unidad_ejecutora="{ item }">
            <span
              v-if="item.unidad_ejecutora"
               v-text="item.unidad_ejecutora.descripcion"
            />
           </template>
           <template v-slot:item.escuela="{ item }">
            <span
              v-if="item.escuela"
               v-text="item.escuela.descripcion"
            />
            <span v-else>S/R</span>
           </template>
           <template v-slot:item.jefe="{ item }">
            <span
               v-text="item.jefe ? 'SI' : 'NO'"
            />
           </template>
           <template v-slot:item.activo="{ item }">
            <v-chip
              class="ma-2"
              :color="item.activo ? 'green' : 'red'"
              text-color="white"
            >
              {{ item.activo ? 'Activo' : 'Inactivo' }}
            </v-chip>
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
      :unids="unidades"
      @procesado="getUnidades"
      @close="isCreate = $event"
    />
  </v-container>
</template>
<script>

import { getUnidadList, deleteUnidad } from '@/services/unidad'

export default {
  name: 'unidades',
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
      { text: 'COD.', value: 'codigo_unidad', width: '100px' },
      { text: 'Nombre', value: 'descripcion', align: '' },
      { text: 'Unidad Padre', value: 'unidad_padre', align: '' },
      { text: 'Unidad Ejecutora', value: 'unidad_ejecutora', align: '' },
      { text: 'Escuela', value: 'escuela', align: '' },
      { text: 'Núcleo', value: 'nucleo', align: '' },
      { text: 'Correo', value: 'correo_dependencia', align: '' },
      { text: '¿Tiene Jefe?', value: 'jefe', align: '' },
      { text: 'Estatus', value: 'activo', align: '' },
      { text: '', value: 'iconos', align: ' px-0', width: '100px' },
    ],
    unidades: [],
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
      return this.unidades.length > 0
        ? this.unidades.map(item => ({
          ...item,
          nombre: item?.descripcion,
          codigo: item?.codigo_unidad,
          cod_nucleo: item?.cod_nucleo ? item?.cod_nucleo.toString() : null
        }))
        : []
    }

  },
  created () {
    this.getUnidades()
  },
  methods: {

    async getUnidades () {
      this.loading = true
      try {
        const { unidades } = await getUnidadList({type: 'administrativa'})
        this.unidades = unidades
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
    async deleteUnid(row){
      const result = await this.$root.$confirm(
        '¿Está Seguro?',
        `Desea eliminar la unidad administrativa ${row?.descripcion}`
      );

      if(result){
        this.updating = true
        try {
          const { message } = await deleteUnidad({id: row?.id, type: 'administrativa'})
          this.getUnidades()
          this.$root.$showAlert(message, 'success');
        } catch (error) {
          console.log(error)
          const { response = null } = error
          if(response?.status === 422){
            this.$root.$showAlert(response?.data?.errors?.message, 'error');
            return;
          }
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
    width: 40rem;
    max-width: 40rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis !important;
}
</style>
