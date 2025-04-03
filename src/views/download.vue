<template>
    <v-container
      fluid
      tag="section"
      class="pa-0"
    >
      <loader-app v-if="updating" />
      <v-row class="ma-0 py-4 justify-space-between">
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
    }),
    computed: {
      user: get('user/infoBasic'),
      nucleo: get('route/params@nucleo'),
    },
    created () {

    },
    methods: { 
      async generatePDF () {
        const date = moment().valueOf()
        const fileName = `REPORTE_${date}.pdf`
        this.downloading = true;
        try {
          const file = await downloadPersonal({
            nucleo: this.nucleo ?? null,
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
