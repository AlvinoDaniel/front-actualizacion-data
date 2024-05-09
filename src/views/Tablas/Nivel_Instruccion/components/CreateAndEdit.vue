<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="50%"
    scrollable
    content-class="content-scroll"
  >
    <v-card tile>
      <v-card-title class="ma-0 d-flex justify-space-between">
        <span
          class="font-weight-bold primary--text"
          :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly,}"
        >
          Gestión de Núcleo
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
      <v-card-text>
        <validation-observer ref="NUCLEO_FORM" tag="div">
          <v-row>
            <v-col cols="12" sm="7" md="8" lg="8" class="pt-2 pb-0">
              <label-form text="Nombre" required />
              <validation-provider name="Nombre" vid="nombre" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="nucleoInfo.nombre"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="5" md="4" lg="4" class="pt-2 pb-0">
              <label-form text="Código" required/>
              <validation-provider name="codigo" vid="codigo" rules="required|numeric|min:2|max:2" v-slot="{ errors }">
                <v-text-field
                  v-model="nucleoInfo.codigo"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0">
              <label-form text="Direccion"/>
              <validation-provider name="Direccion" vid="nucleoInfo.direccion" v-slot="{ errors }">
                <v-textarea
                  v-model="nucleoInfo.direccion"
                  outlined
                  dense
                  rows="2"
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
import { saveNucleo } from '@/services/nucleo'
const dataDefault = () => ({
  nombre: '',
  codigo: '',
  direccion: '',
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
      nucleoInfo: dataDefault(),
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
        this.nucleoInfo = {...val, codigo: val?.codigo_concatenado }
      }
      else
        this.nucleoInfo = dataDefault();
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
      this.nucleoInfo = dataDefault();
      this.$refs.NUCLEO_FORM.reset();
    },
    async actionGroup() {
      const valid = await this.$refs.NUCLEO_FORM.validate();
      if(valid) {
        try {
          this.loadingAction = true;
          const { message } = await saveNucleo({
            info: this.nucleoInfo,
            action: this.action,
            id: this.nucleoInfo?.id ?? null
          })
          this.$emit('procesado', true);
          this.cerrar();
          this.$root.$showAlert(message, 'success');
        } catch (error) {
          const { response = null } = error
          if(response?.status === 422){
            this.$refs.NUCLEO_FORM.setErrors(response?.data?.errors);
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
