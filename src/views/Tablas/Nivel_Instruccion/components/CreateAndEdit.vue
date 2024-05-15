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
          Gestión de Nivel de Instrucción
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
        <validation-observer ref="NIVEL_FORM" tag="div">
          <v-row>
            <v-col cols="12" sm="7" md="8" lg="8" class="pt-2 pb-0">
              <label-form text="Descripción" required />
              <validation-provider name="descripcion" vid="descripcion" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="nivelInfo.descripcion"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="5" md="4" lg="4" class="pt-2 pb-0">
              <label-form text="Abreviatura" required/>
              <validation-provider name="abreviatura" vid="abreviatura" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="nivelInfo.abreviatura"
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
import { saveLevel } from '@/services/nivel'
const dataDefault = () => ({
  descripcion: '',
  abreviatura: '',
});
export default {
  name:'ModalNivel',
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
      nivelInfo: dataDefault(),
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
        this.nivelInfo = {...val }
      }
      else
        this.nivelInfo = dataDefault();
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
      this.nivelInfo = dataDefault();
      this.$refs.NIVEL_FORM.reset();
      this.$emit('reset', true);
    },
    async actionGroup() {
      const valid = await this.$refs.NIVEL_FORM.validate();
      if(valid) {
        try {
          this.loadingAction = true;
          const { message } = await saveLevel({
            info: this.nivelInfo,
            action: this.action,
            id: this.nivelInfo?.id ?? null
          })
          this.$emit('procesado', true);
          this.cerrar();
          this.$root.$showAlert(message, 'success');
        } catch (error) {
          const { response = null } = error
          if(response?.status === 422){
            this.$refs.NIVEL_FORM.setErrors(response?.data?.errors);
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
