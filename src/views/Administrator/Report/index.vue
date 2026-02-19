<template>
    <v-container
      fluid
      tag="section"
      class="pa-0"
    >
    <v-window v-model="steps_data">
      <v-window-item :value="1">
        <v-row class="ma-0 py-4 justify-space-between">
          <v-col cols="12"  md="5" class="pt-1 d-flex align-center">
            <h3 class="black-text">
              Reporte de Registro
            </h3>
          </v-col>
          <v-col cols="12" md="4" class="pt-1 d-flex align-center justify-end" style="gap: 8px ">
            <v-select
              v-model="nucleoSelected"
              :items="catalogue.nucleo"
              label="Núcleo"
              :loading="load"
              :disabled="load"
              item-text="nombre"
              item-value="codigo_1"
              dense
              outlined
              hide-details
              prepend-inner-icon="mdi-home-city-outline"
              @change="getPersonal"
            ></v-select>
            <v-menu
              rounded
              offset-y
            >
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  depressed
                  dark
                  color="blue-grey"
                  class=""
                  v-bind="attrs"
                  v-on="on"
                  :loading="downloading"
                  >
                  <v-icon left>mdi-download</v-icon>
                  Descargar Reporte
                </v-btn>
              </template>
              <v-list>
                <v-list-item link @click="generatePDF">
                  <v-list-item-icon class="mr-1">
                    <v-icon color="red">mdi-file-pdf</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                       Reporte PDF
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider/>
                <v-list-item link @click="generateExcel">
                  <v-list-item-icon class="mr-1">
                    <v-icon color="green darken-1">mdi-file-excel</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                       Reporte Excel
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <v-data-table
              sort-by="codigo_unidad_ejec"
              class="inbox"
              no-data-text="No hay Personal Registrado"
              :headers="headers"
              :items="personal"
              :loading="loading"
              @click:row="getDetails"
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
                </div>
              </template>
              <template v-slot:item.descripcion_unidad_admin="{ item }">
              <span
                v-if="item.descripcion_unidad_admin"
                class="font-weight-bold"
                  v-text="item.descripcion_unidad_admin.toUpperCase()"
              />
              </template>
              <!-- <template v-slot:footer="{ item }">
                <v-row>
                  <v-col cols="12" class="pb-0">
                    <v-divider class="pb-1"></v-divider>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-space-between align-center px-6 pt-0">
                    <div class="d-flex align-center" style="width: 10%;">
                      <h5 class="mx-3 pt-2">Mostrar: </h5>
                      <v-select
                        v-model="itemsPerPage"
                        :items="itemsByPage"
                        dense
                        hide-details
                        @change="getPersonal"
                      ></v-select>
                    </div>
                    <v-pagination
                      v-model="page"
                      circle
                      :length="pageCount"
                      @input="getPersonal"
                    ></v-pagination>
                  </v-col>
                </v-row>
              </template> -->
            </v-data-table>
          </v-col>
          <v-col cols="12" class="">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :value="2">
        <personal-table
          v-if="steps_data === 2"
          :data="personal_by_unidad"
          :jefe="jefe_data"
          :unidad="unidad_selected"
          :loading="loading_personal"
          @back="goBack"
        />
      </v-window-item>
    </v-window>
    </v-container>
  </template>
  <script>

  import { downloadPersonal, getPersonalByUnid, exportReportPersonal } from '@/services/usuario'
  import { get } from 'vuex-pathify'
  import moment from 'moment'
  import { getCatalogue } from '@/services/catalogue'

  export default {
    name: 'Download',
    components: {
      PersonalTable: () => import(
        /* webpackChunkName: "modal-create" */
        './components/personalTable.vue'
      )
    },
    data: () => ({
      downloading: false,
      loading: false,
      loading_personal: false,
      steps_data: 1,
      itemsByPage: [10, 25, 50, 100],
      headers: [
        { text: 'Núcleo', value: 'nombre', width: '20%',  class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Unidad Administrativa', value: 'descripcion_unidad_admin', class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Personal Registrado', width: '20%', value: 'personal_reg', align:'center',  class: 'blue-grey lighten-5 blue-grey--text px-1 text-center' },
        // { text: 'Acciones', value: 'iconos', align: ' px-0', width: '100px',  class: 'blue-grey lighten-5 blue-grey--text' },
      ],
      personal: [],
      personal_by_unidad: [],
      jefe_data: null,
      unidad_selected: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      nucleoSelected: '1',
      catalogue:{
        nucleo: [],
      },
      load: false
    }),
    computed: {
      user: get('user/infoBasic'),
      nucleo: get('route/params@nucleo'),
    },
    created () {
      this.getData();
      this.getPersonal();
    },
    methods: {
      async getPersonal () {
        this.loading = true
        this.personal = []
        try {
          const { data = [] } = await downloadPersonal({
            nucleo: this.nucleoSelected ?? null,
            page: this.page,
            perPage: this.itemsPerPage
          })
          this.personal = data
          // this.pageCount = data?.last_page;
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
      },
      async generatePDF () {
        const date = moment().valueOf()
        const fileName = `REPORTE_${date}.pdf`
        this.downloading = true;
        try {
          const file = await downloadPersonal({
            nucleo: this.nucleo ?? null,
            download: true
          })
          var pdfURL = window.URL.createObjectURL(new Blob([file]));
          var pdfLink = document.createElement('a');

          pdfLink.href = pdfURL;
          pdfLink.setAttribute('download',fileName);
          document.body.appendChild(pdfLink);
          pdfLink.click();
          pdfLink.remove();
          this.downloading = false;
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
      async generateExcel () {
        const date = moment().valueOf()
        const fileName = `REPORTE_PERSONAL_${date}.xlsx`
        this.downloading = true;
        try {
          const file = await exportReportPersonal({nucleo: this.nucleoSelected ?? null,})
          var excelURL = window.URL.createObjectURL(new Blob([file]));
          var excelLink = document.createElement('a');

          excelLink.href = excelURL;
          excelLink.setAttribute('download',fileName);
          document.body.appendChild(excelLink);
          excelLink.click();
          excelLink.remove();
          this.downloading = false;
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
      async getDetails({codigo_unidad_admin, codigo_unidad_ejec, cod_nucleo, descripcion_unidad_admin, nombre:nucleo, id_unidad_admin}){
        this.loading_personal = true
        this.personal_by_unidad = []
        this.unidad_selected = null
        this.steps_data = 2;
        try {
          const { personal = [], jefe = [] } = await getPersonalByUnid({
            admin: id_unidad_admin,
            ejec: codigo_unidad_ejec,
            nucleo: cod_nucleo
          })
          this.personal_by_unidad = personal
          this.jefe_data = jefe
          this.unidad_selected = {
            descripcion_unidad_admin,
            nucleo
          }
        } catch (error) {
          console.log(error)
        } finally {
          this.loading_personal = false
        }

      },
      async getData () {
        this.load = true;
        const catalogues = [
          {name: 'nucleo', value: 'nucleo'},
        ]
        try {
          await Promise.all(
            catalogues.map(async res => {
              await getCatalogue({table: res.name}).then(response => {
                if(response){
                  this.catalogue[res.value] = response
                }
              })
            })
          )
        } catch (error) {
          this.$root.$showAlert(
            'Lo siento, hubo un error al intentar obtener el listado de Personal registrado.',
            'error',
          )
        } finally {
          this.load = false
        }
      },
      goBack(){
        this.steps_data = 1;
      }
    },
  }
  </script>
