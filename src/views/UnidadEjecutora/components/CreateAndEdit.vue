<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="50%"
    scrollable
    content-class="content-scroll"
  >
    <v-card tile>
      <v-card-title class="ma-0 d-flex justify-space-between secondary white--text">
        <span
          class="font-weight-bold"
          :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly,}"
        >
          Gestión de Unidad Ejecutora
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
            <v-col cols="12" md="6" class="pt-2 pb-0">
              <label-form text="Código" required/>
              <validation-provider name="codigo" vid="codigo" rules="required|max:10" v-slot="{ errors }">
                <v-text-field
                  v-model="unidadInfo.codigo"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" class="pt-2 pb-0">
              <label-form text="Nombre" required />
              <validation-provider name="Nombre" vid="nombre" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="unidadInfo.nombre"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
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
const dataDefault = () => ({
  nombre: '',
  codigo: '',
  anio: ''
});
export default {
  name:'ModalNucleo',
  props:{
    value: Boolean,
    data:{
      type: Object,
      default: () => ({}),
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
      loadNucleo: false,
      unidadInfo: dataDefault(),
      nucleos: [],
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
  methods: {
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
            info: this.unidadInfo,
            action: this.action,
            id: this.unidadInfo?.id ?? null,
            type: 'ejecutora'
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
