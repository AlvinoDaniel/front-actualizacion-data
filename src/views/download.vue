<template>
    <v-container
      fluid
      tag="section"
      class="pa-0"
    >
      <v-row class="ma-0 py-4 justify-space-between">
        <v-col cols="12"  md="5" class="pt-1 d-flex align-center">
          <h3 class="black-text">
            Reporte de Registro
          </h3>
        </v-col>
        <v-col cols="12" md="6" class="pt-1 d-flex align-center justify-end" style="gap: 8px ">
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
                Descargar Reporte
              </v-btn>
            </template>
            <span>Descargar</span>
          </v-tooltip>
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
              </div>
            </template>
            <template v-slot:item.descripcion_unidad_admin="{ item }">
            <span
              v-if="item.descripcion_unidad_admin"
              class="font-weight-bold"
                v-text="item.descripcion_unidad_admin.toUpperCase()"
            />
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

  import { downloadPersonal } from '@/services/usuario'
  import { get } from 'vuex-pathify'
  import moment from 'moment'

  export default {
    name: 'Download',
    data: () => ({
      downloading: false,
      loading: false,
      headers: [
        { text: 'Núcleo', value: 'nombre', width: '20%',  class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Unidad Administrativa', value: 'descripcion_unidad_admin', class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Personal Registrado', width: '20%', value: 'personal_reg', align:'center',  class: 'blue-grey lighten-5 blue-grey--text px-1 text-center' },
        // { text: 'Acciones', value: 'iconos', align: ' px-0', width: '100px',  class: 'blue-grey lighten-5 blue-grey--text' },
      ],
      personal: [],
    }),
    computed: {
      user: get('user/infoBasic'),
      nucleo: get('route/params@nucleo'),
    },
    created () {
      this.getPersonal();
    },
    methods: {
      async getPersonal () {
        this.loading = true
        this.personal = []
        try {
          const { data = [] } = await downloadPersonal({
            nucleo: this.nucleo ?? null,
          })
          this.personal = data
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
    },
  }
  </script>
