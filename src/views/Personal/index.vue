<template>
  <v-container
    id="gestion-personal"
    fluid
    tag="section"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0 py-4 justify-space-between">
      <v-col cols="12" md="5" class="pt-1 d-flex align-center">
        <h3 class="black-text">
          Gestión de Personal
        </h3>
      </v-col>
      <v-col cols="12" md="6" class="pt-1 d-flex align-center justify-end" style="gap: 8px">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              dark
              color="success"
              v-bind="attrs"
              v-on="on"
              @click="modalMasivo = true"
            >
              <v-icon left>mdi-upload</v-icon>
              Ingreso Masivo
            </v-btn>
          </template>
          <span>Ingreso Masivo de Personal</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              dark
              color="info"
              :loading="downloading"
              v-bind="attrs"
              v-on="on"
              @click="exportarPlantilla()"
            >
              <v-icon left>mdi-upload</v-icon>
              Exportar Plantilla
            </v-btn>
          </template>
          <span>Exportar plantilla</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <!-- Campo de búsqueda -->
    <v-row class="ma-0 py-4" justify="center">
      <v-col cols="12" md="6">
        <v-card class="fill-height" color="blue-grey lighten-5">
          <v-card-text class="text--primary">
            <v-row>
              <v-col cols="12" md="10">
                <v-text-field
                  v-model="cedula"
                  label="Cédula de Identidad"
                  type="number"
                  :min="5"
                  :max="8"
                  :rules="cedulaRules"
                  outlined
                  dense
                  hint="Ingrese la cédula sin puntos ni guiones"
                  persistent-hint
                  background-color="white"
                  @keyup.enter="buscarPersonal"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn
                  color="primary"
                  @click="buscarPersonal"
                  :loading="updating"
                  block
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resultados -->
    <v-row v-if="personalData && !error.active">
      <!-- Información de Personal -->
      <v-col cols="12" md="6" v-if="personalData.personal">
       <v-card class="fill-height">
          <v-card-title class="blue-grey darken-1 white--text text-h4">
              <v-icon left color="white">mdi-account</v-icon>
              Información de Personal
          </v-card-title>
          <v-simple-table>
            <tbody>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Nombres y Apellidos:</strong></td>
                <td>{{ personalData.personal.nombres_apellidos || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Cédula de Identidad:</strong></td>
                <td>{{ personalData.personal.cedula_identidad || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Tipo Personal:</strong></td>
                <td>{{ personalData.personal.tipo_personal || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Cargo OPSU:</strong></td>
                <td>{{ personalData.personal.cargo_opsu || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Cargo Personal:</strong></td>
                <td>{{ personalData.personal.cargo_personal || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Núcleo:</strong></td>
                <td>{{ personalData.personal.nucleo || 'N/A' }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>

      <!-- Información de Migración -->
      <v-col cols="12" md="6" v-if="personalData.migracion">
        <v-card class="fill-height">
          <v-card-title class="blue-grey darken-1 white--text text-h4">
              <v-icon left color="white">mdi-database-import</v-icon>
              Información de Migración
          </v-card-title>
          <v-simple-table>
            <tbody>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Nombres:</strong></td>
                <td>{{ personalData.migracion.nombres || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Cédula de Identidad:</strong></td>
                <td>{{ personalData.migracion.cedula_identidad || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Cargo:</strong></td>
                <td>{{ personalData.migracion.cargo || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-bold text-uppercase"><strong>Código Núcleo:</strong></td>
                <td>{{ personalData.migracion.cod_nucleo || 'N/A' }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>

      <!-- Información de las unidades administrativas  -->
       <v-col cols="12" v-if="personalData.personal && personalData.personal.unidades && personalData.personal.unidades.length > 0">
        <v-card class="fill-height">
          <v-card-title class="blue-grey darken-1 white--text text-h4">
              <v-icon left color="white">mdi-office-building</v-icon>
              Unidades Administrativas Asociadas
          </v-card-title>
          <v-simple-table>
            <thead>
              <tr>
                <th class="text-uppercase font-weight-bold">Entidad</th>
                <th class="text-uppercase font-weight-bold">Unidad Ejecutora</th>
                <th class="text-uppercase font-weight-bold">Escuela</th>
                <th class="text-uppercase font-weight-bold">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(unidad, index) in personalData.personal.unidades" :key="index">
                <td>{{ unidad.entidad ? `${unidad.entidad.descripcion} ${personalData.personal.jefe === true ? '(Jefe)' : ''}` : 'N/A' }}</td>
                <td>{{ unidad.unidad_ejecutora ? unidad.unidad_ejecutora.descripcion : 'N/A' }}</td>
                <td>{{ unidad.escuela ? unidad.escuela.descripcion : 'N/A' }}</td>
                <td>
                  <v-btn v-if="!personalData.personal.jefe" icon small color="primary" @click="editarUnidad(unidad)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="error.active" class="ma-0 py-4">
      <v-col cols="12">
        <v-alert type="error" dense outlined>
          {{ error.message }}
        </v-alert>
       </v-col>
    </v-row>

    <!-- Resultados de importación masiva -->
    <v-row v-if="importResults">
      <v-col cols="12">
         <v-card class="fill-height">
           <v-card-title class="blue-grey darken-1 white--text text-h4">
            <v-icon left color="white">mdi-check</v-icon>
            Personal Importado Exitosamente: {{ importResults.importados }}
          </v-card-title>
          <v-divider class="my-4"></v-divider>
          <v-card-title class="blue-grey darken-1 white--text text-h4">
              <v-icon left color="white">mdi-account-multiple</v-icon>
              Personal Duplicado en Importación: {{ importResults.saltados }}
          </v-card-title>
          <v-data-table
            :headers="importHeaders"
            :items="importResults.duplicados"
            no-data-text="No hay duplicados"
            dense
          >

          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal para ingreso masivo -->
    <v-dialog v-model="modalMasivo" max-width="40%">
      <v-card>
        <v-card-title class="ma-0 d-flex justify-space-between secondary white--text">
        <span
          class="font-weight-bold"
          :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly,}"
        >
          Importar Personal Masivo
        </span>
        <v-btn icon plain @click="modalMasivo = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
        <v-card-text class="pt-4">
          <p class="mb-4">Seleccione un archivo CSV con el siguiente formato:</p>
          <p class="font-weight-bold text-uppercase">
            nombres | cedula_identidad | cargo_opsu | tipo_personal | cod_nucleo | sexo | correo | telefono
          </p>
           <p class="mt-4 mb-4">Asegúrese que las cédulas no tengan puntos ni guiones.</p>
           <v-alert type="info" dense outlined class="mb-4">
            El sistema validará cada registro y omitirá aquellos con cédulas ya existentes, mostrando un resumen al finalizar la importación.
          </v-alert>
          <v-file-input
            v-model="archivoCsv"
            label="Seleccionar archivo CSV"
            accept=".csv"
            :rules="fileRules"
            show-size
            outlined
            dense
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  tile
          depressed
          color="blue-grey lighten-5"
          class="px-8 mx-2"
          @click="modalMasivo = false">
            Cancelar
          </v-btn>
          <v-btn  depressed
          color="primary"
          class="px-8"
           @click="importarMasivo" :loading="importing">
            Importar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para actualizar unidad -->
    <update-unidad-modal
      v-model="modalUnidad"
      :personal="personalData ? personalData.personal : {}"
      :selected="selectedUnidad"
      :unidades="unidadesList"
      @updated="onUnidadUpdated"
    />
  </v-container>
</template>

<script>
import { getPersonalByCedula, importarPersonalMasivo, exportarPlantillaImportacion } from '@/services/usuario'
import { getUnidadList } from '@/services/unidad'

export default {
  name: 'GestionPersonal',
  components: {
    LoaderApp: () => import('@/components/LoaderApp.vue'),
    UpdateUnidadModal: () => import('./components/UpdateUnidadModal.vue')
  },
  data: () => ({
    cedula: '',
    cedulaRules: [
      v => !!v || 'Cédula es requerida',
      v => (v && v.length >= 5 && v.length <= 8) || 'Cédula debe tener entre 5 y 8 dígitos'
    ],
    personalData: null,
    loading: false,
    updating: false,
    downloading: false,
    modalMasivo: false,
    archivoCsv: null,
    fileRules: [
      v => !!v || 'Archivo es requerido',
      v => (v && v.type === 'text/csv') || 'Debe ser un archivo CSV'
    ],
    importing: false,
    importResults: null,
    importHeaders: [
      { text: 'Cédula', value: 'cedula', class: 'blue-grey lighten-5 blue-grey--text' },
      { text: 'Nombres', value: 'nombres', class: 'blue-grey lighten-5 blue-grey--text' },
    ],
    error: {
      message: '',
      active: false,
    },
    modalUnidad: false,
    selectedUnidad: null,
    unidadesList: []
  }),
  methods: {
    async buscarPersonal() {
      if (!this.cedula || this.cedula.length < 5 || this.cedula.length > 8) return
      this.updating = true
      try {
        const data = await getPersonalByCedula({ cedula: this.cedula })
        this.personalData = this.transformPersonalData(data)
        this.error.active = false
      } catch (error) {
        if (error.response && error.response.status === 421) {
            this.error.message = error.response.data.errors.message || 'Error al buscar personal'
            this.error.active = true
        } else {
          this.$root.$showAlert(
            'Error al buscar personal',
            'error',
          )
        }
        console.error(error)
      } finally {
        this.updating = false
      }
    },
    transformPersonalData(data) {
      return {
        personal: data.personal ? {
          nombres_apellidos: data.personal.nombres_apellidos,
          cedula_identidad: data.personal.cedula_identidad,
          tipo_personal: data.personal.tipo_personal ? data.personal.tipo_personal.descripcion : null,
          cargo_opsu: data.personal.cargo_opsu,
          cargo_personal: data.personal.cargo_jefe ? data.personal.cargo_jefe?.descripcion : null,
          entidad: data.personal.unidades && data.personal.unidades.length > 0 && data.personal.unidades[0].entidad ? data.personal.unidades[0].entidad.descripcion : null,
          unidad_ejecutora: data.personal.unidades && data.personal.unidades.length > 0 && data.personal.unidades[0].entidad && data.personal.unidades[0].entidad.unidad_ejecutora ? data.personal.unidades[0].entidad.unidad_ejecutora.descripcion : null,
          escuela: data.personal.unidades && data.personal.unidades.length > 0 && data.personal.unidades[0].entidad && data.personal.unidades[0].entidad.escuela ? data.personal.unidades[0].entidad.escuela.descripcion : null,
          nucleo: data.personal.nucleo ? data.personal.nucleo.nombre : null,
          jefe: data.personal.jefe,
          unidades: data.personal.unidades
            ? data.personal.unidades.map(u => ({
              id: u.id,
              entidad: u.entidad ? { descripcion: u.entidad.descripcion, jefe: u.entidad.jefe, id: u.entidad.id } : null,
              unidad_ejecutora: u.entidad && u.entidad.unidad_ejecutora ? { descripcion: u.entidad.unidad_ejecutora.descripcion } : null,
              escuela: u.entidad && u.entidad.escuela ? { descripcion: u.entidad.escuela.descripcion } : null,
              }))
            : null
          } : null,
        migracion: data.migracion ? {
          nombres: data.migracion.nombres,
          cedula_identidad: data.migracion.cedula_identidad,
          cargo: data.migracion.cargo_opsu,
          cod_nucleo: data.migracion.cod_nucleo,
        } : null,
       }
    },
    async importarMasivo() {
      if (!this.archivoCsv) return
      this.importing = true
      try {
        const data = await importarPersonalMasivo(this.archivoCsv)
        this.importResults = data
        this.modalMasivo = false
        this.archivoCsv = null
        this.personalData = null
        this.cedula = ''
        this.$root.$showAlert(
          `Importación completada. Personal importado: ${data.importados}, Duplicados: ${data.saltados}`,
          'success',
        )
      } catch (error) {
        this.$root.$showAlert('Error en la importación', 'error')
        console.error(error)
      } finally {
        this.importing = false
      }
    },
    editarUnidad(unidad) {
      this.selectedUnidad = { ...unidad }
      this.modalUnidad = true
    },
    async loadUnidades() {
      try {
        const data = await getUnidadList({ type: 'administrativa' })
        this.unidadesList = data?.unidades || []
      } catch (error) {
        console.error('Error cargando unidades:', error)
      }
    },
    onUnidadUpdated() {
      // Recargar los datos del personal
      this.buscarPersonal()
    },
    async exportarPlantilla () {
        const fileName = 'PLANTILLA_PERSONAL.csv';
        this.downloading = true;
        try {
          const file = await exportarPlantillaImportacion()
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
            'Lo siento, hubo un error al intentar obtener la plantilla.',
            'error'
          )
        }
        finally {
          this.downloading = false;
        }
    }
  },
  mounted() {
    this.loadUnidades()
  }
}
</script>
