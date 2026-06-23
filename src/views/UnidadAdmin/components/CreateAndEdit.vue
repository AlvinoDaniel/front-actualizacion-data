<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="70%"
    scrollable
    content-class="content-scroll"
  >
    <v-card tile>
      <v-card-title class="ma-0 d-flex justify-space-between secondary white--text">
        <span
          class="font-weight-bold"
          :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly,}"
        >
          Gestión de Unidad Administrativa
        </span>
        <v-btn icon plain @click="cerrar()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-overlay
        :value="loadingAction || loading"
        color="white"
        absolute
        opacity=".8"
      >
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
      </v-overlay>
      <v-card-text class="pt-4">
        <validation-observer ref="UNIDAD_FORM" tag="div">
          <v-row>
            <v-col cols="12" md="4" class="pt-2 pb-0">
               <label class="font-weight-medium button black--text text-h6 mb-2">Codigo</label>
              <validation-provider name="codigo" vid="codigo" rules="required|max:19" v-slot="{ errors }">
                <v-text-field
                  v-model="unidadInfo.codigo"
                  outlined
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" md="8" class="pt-2 pb-0">
               <label class="font-weight-medium button black--text text-h6 mb-2">Nombre Unidad</label>
              <validation-provider name="Nombre" vid="nombre" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="unidadInfo.nombre"
                  outlined
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <label class="font-weight-medium button black--text text-h6 mb-2">Unidad Padre</label>
              <validation-provider name="Unidad Padre" vid="cod_unidad_padre" v-slot="{ errors }">
                <v-autocomplete
                  v-model="unidadInfo.cod_unidad_padre"
                  :items="unids"
                  item-text="descripcion"
                  item-value="codigo_unidad"
                  outlined
                  clearable
                  class="mt-2"
                  :error-messages="errors[0]"
                  >
                </v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="12" md="6">
              <label class="font-weight-medium button black--text text-h6 mb-2">Unidad Ejecutora</label>
              <validation-provider name="Unidad Ejecutora" vid="id_unidad_ejec" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="unidadInfo.id_unidad_ejec"
                  :items="catalogue.unidad_ejecutora"
                  :loading="load"
                  :disabled="load"
                  item-text="descripcion"
                  item-value="id"
                  outlined
                  clearable
                  class="mt-2"
                  :error-messages="errors[0]"
                >
                </v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <label class="font-weight-medium button black--text text-h6 mb-2">Núcleo</label>
              <validation-provider name="Núcleo" vid="cod_nucleo" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="unidadInfo.cod_nucleo"
                  :items="catalogue.nucleo"
                  :loading="load"
                  :disabled="load"
                  item-text="nombre"
                  item-value="codigo_concatenado"
                  outlined
                  clearable
                  class="mt-2"
                  :error-messages="errors[0]"
                  >
                </v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="12" md="6">
              <label class="font-weight-medium button black--text text-h6 mb-2">Escuela</label>
              <validation-provider name="Escuela" vid="cod_escuela" v-slot="{ errors }">
                <v-autocomplete
                  v-model="unidadInfo.cod_escuela"
                  :items="catalogue.escuela"
                  :loading="load"
                  :disabled="load"
                  item-text="descripcion"
                  item-value="codigo"
                  outlined
                  clearable
                  class="mt-2"
                  :error-messages="errors[0]"
                >
                </v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="pt-0">
              <validation-provider v-slot="{ errors }">
                <v-switch
                  v-model="unidadInfo.activo"
                  inset
                  color="info"
                  class="mt-0"
                  hide-details
                  label="ACTIVO"
                ></v-switch>
                <!-- <v-checkbox
                  v-model="unidadInfo.activo"
                  label="Activo"
                  color="info"
                  class="mt-0"
                  hide-details
                ></v-checkbox> -->
              </validation-provider>
            </v-col>
          </v-row>
        </validation-observer>
      </v-card-text>
      <v-card-actions class="d-flex justify-end mb-3">
        <v-btn
          tile
          depressed
          color="blue-grey lighten-5"
          class="px-8 mx-2"
          :small="$vuetify.breakpoint.mobile"
          @click="cerrar()"
        >
          Cancelar
        </v-btn>
        <v-btn
          tile
          depressed
          color="primary"
          class="px-8"
          :small="$vuetify.breakpoint.mobile"
          @click="actionGroup"
        >
          {{action === 'edit' ? 'Actualizar' : 'Crear'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { saveUnidad } from '@/services/unidad'
import { getCatalogue } from '@/services/catalogue'

const dataDefault = () => ({
  codigo: null,
  nombre: null,
  cod_nucleo: null,
  cod_unidad_padre: null,
  id_unidad_ejec: null,
  cod_escuela: null,
  activo: true,
});
export default {
  name:'ModalNucleo',
  props:{
    value: Boolean,
    data:{
      type: Object,
      default: () => ({}),
    },
    unids:{
      type: Array,
      default: () => ([]),
    },
    loading:{
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: 'crear',
    },
  },
  data() {
    return {
      show: this.value,
      loadingAction: false,
      load: false,
      unidadInfo: dataDefault(),
      nucleos: [],
      catalogue: {
        unidad_ejecutora: [],
        nucleo: [],
        escuela: [],
      }
    }
  },
  watch: {
    show (val, oldVal) {
      if (val === oldVal) return

      this.$emit('input', val)
    },
    value (val, oldVal) {
      if (val === oldVal) return

      this.show = val
    },
    data(val) {
      if(Object.values(val).length > 0) {
        this.unidadInfo = {...val }
      }
      else
        this.unidadInfo = dataDefault();
    },
  },
  filters: {
    fisrtLetter(val) {
      return val !== null ? val.toUpperCase().charAt(0) : ''
    }
  },
  created(){
    this.getData();
  },
  methods: {
    async getData () {
      this.load = true;
      const catalogues = [
        {name: 'unidad-ejecutora', value: 'unidad_ejecutora'},
        {name: 'nucleo', value: 'nucleo'},
        {name: 'escuela', value: 'escuela'},
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
          'Lo siento, hubo un error al intentar obtener la información requerida.',
          'error',
        )
      } finally {
        this.load = false
      }
    },
    cerrar() {
      this.show = false;
      this.unidadInfo = dataDefault();
      this.$refs.UNIDAD_FORM.reset();
      this.$emit('close', true);
    },
    async actionGroup() {
      const valid = await this.$refs.UNIDAD_FORM.validate();
      if(valid) {
        try {
          this.loadingAction = true;
          const { message } = await saveUnidad({
            info: {...this.unidadInfo,
              cod_escuela: this.unidadInfo.cod_escuela ?? undefined,
              cod_unidad_padre: this.unidadInfo.cod_unidad_padre ?? undefined,
            },
            action: this.action,
            id: this.unidadInfo?.id ?? null,
            type: 'administrativa'
          })
          this.$emit('procesado', true);
          this.cerrar();
          this.$root.$showAlert(message, 'success');
        } catch (error) {
          const { response = null } = error
          if(response?.status === 422){
            this.$refs.UNIDAD_FORM.setErrors(response?.data?.errors);
            return;
          }
            this.$root.$showAlert(
              'Lo sentimos, hubo un error al intentar realizar esta acción en el Servidor.',
              'error'
            );
        } finally {
          this.loadingAction = false;
        }
      }
    },
  },
}
</script>
