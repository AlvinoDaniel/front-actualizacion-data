<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0 py-4 justify-space-between">
      <v-col cols="12"  md="5" class="pt-1 d-flex align-center">
        <h3 class="black-text">
          Mi Personal
        </h3>
      </v-col>
      <v-col cols="12" md="6" class="pt-1 d-flex align-center justify-end" style="gap: 8px ">
        <search-expand v-model="filterData" />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              small
              dark
              color="info"
              class=""
              v-bind="attrs"
              v-on="on"
              @click="modalShow = true"
              >
              <v-icon left>mdi-plus</v-icon>
              Agregar
            </v-btn>
          </template>
          <span>Agregar</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              small
              dark
              color="blue-grey"
              class=""
              v-bind="attrs"
              v-on="on"
              @click="generatePDF"
              :loading="downloading"
              >
              <v-icon left>mdi-download</v-icon>
              Descargar
            </v-btn>
          </template>
          <span>Descargar</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              depressed
              color="blue-grey lighten-5"
              v-bind="attrs"
              v-on="on"
              @click="updateData()"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Actualizar</span>
        </v-tooltip>
        <!-- <v-pagination
          class="header-pagination"
          v-model="page"
          :length="pageCount"
          circle
          total-visible="0"
        ></v-pagination> -->
        <!-- <span class="text-pagination" v-text="paginationText" /> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-tabs v-model="selectUnidad">
            <v-tab v-for="unidad in unidades"
              :ripple="false"
              :key="unidad.codigo_unidad_ejec"
              @click="getPersonal(unidad)"
            >
              <v-icon color="info">mdi-circle-medium</v-icon>
             <strong>{{ unidad.descripcion_unidad_ejec }}</strong>
            </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12" class="py-0">
        <v-data-table
          sort-by="codigo_unidad_ejec"
          class="inbox"
          no-data-text="No hay Personal Registrado"
          :search="filterData"
          :headers="headers"
          :items="personal"
          :loading="loading"
          :sort-desc="true"
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
          <template v-slot:item.cedula_identidad="{ item }">
          <span
            v-if="item.cedula_identidad"
            class=""
          >
            {{ item.cedula_identidad | FormatCurrency }}
          </span>
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
      @procesado="getPersonal($event)"
      @tab="selectUnidad = $event"
      />
  </v-container>
</template>
<script>

import { getAllPersonal, deletePersonal, downloadListPersonal } from '@/services/usuario'
import { get } from 'vuex-pathify'
import moment from 'moment'
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
    downloading: false,
    isCreate: true,
    dataSelect: null,
    unidades: [],
    selectUnidad: 0,
    headers: [
      { text: 'Cédula Identidad', value: 'cedula_identidad', class: 'blue-grey lighten-5 blue-grey--text' },
      { text: 'Nombres y Apellidos', value: 'nombres_apellidos',  class: 'blue-grey lighten-5 blue-grey--text' },
      { text: 'Tipo Personal', value: 'tipo_personal_descripcion',  class: 'blue-grey lighten-5 blue-grey--text' },
      { text: 'Cargo', value: 'cargo_opsu',  class: 'blue-grey lighten-5 blue-grey--text'},
      // { text: 'Unidad Administrativa', value: 'codigo_unidad_admin',  class: 'blue-grey lighten-5 blue-grey--text'},
      // { text: 'Unidad Ejecutora', value: 'codigo_unidad_ejec',  class: 'blue-grey lighten-5 blue-grey--text'},
      { text: 'Acciones', value: 'iconos', align: ' px-0', width: '100px',  class: 'blue-grey lighten-5 blue-grey--text' },
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
    user: get('user/infoBasic'),
    showTabs(){
      return this.unidades.length > 1;
    }
  },
  created () {
    this.setUnidades()
  },
  methods: {
    setUnidades(){
      const {unidades = [] } = this.user
      this.unidades = unidades.map(item => {
        return {
          codigo_unidad_admin: item?.codigo_unidad_admin,
          codigo_unidad_ejec: item?.codigo_unidad_ejec,
          descripcion_unidad_ejec: item?.entidad?.descripcion_unidad_ejec,
        }
      });

      this.getPersonal(this.unidades[0])
    },
    async getPersonal ({codigo_unidad_admin, codigo_unidad_ejec}) {
      this.loading = true
      this.personal = []
      try {
        const { personal = [] } = await getAllPersonal({
          admin: codigo_unidad_admin,
          ejec: codigo_unidad_ejec
        })
        this.personal = personal
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
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
    },
    updateData(){
      if(!this.unidades[this.selectUnidad]) return;

      this.getPersonal(this.unidades[this.selectUnidad]);
    },

    async generatePDF () {
      if(!this.unidades[this.selectUnidad]) {
        this.$root.$showAlert(
          'Seleccione una Unidad Administrativa',
          'error'
        );
        return;
      };

      if(this.personal.length === 0){
        this.$root.$showAlert(
          'No hay personal registrado para mostrar',
          'error'
        );
        return;
      }
      const {codigo_unidad_admin, codigo_unidad_ejec} = this.unidades[this.selectUnidad];
      const date = moment().valueOf()
      const fileName = `${codigo_unidad_admin}_${date}.pdf`
      this.downloading = true;
      try {
        const file = await downloadListPersonal({
          admin: codigo_unidad_admin,
          ejec: codigo_unidad_ejec
        })
        var pdfURL = window.URL.createObjectURL(new Blob([file]));
        var pdfLink = document.createElement('a');

        pdfLink.href = pdfURL;
        pdfLink.setAttribute('download',fileName);
        document.body.appendChild(pdfLink);
        pdfLink.click();
        pdfLink.remove();
      } catch (error) {
        this.$root.$showAlert(
          'Lo siento, hubo un error al intentar obtener la Lista del Personal Registrado.',
          'error'
        )
      }
      finally {
        this.downloading = false;
      }
    },
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
