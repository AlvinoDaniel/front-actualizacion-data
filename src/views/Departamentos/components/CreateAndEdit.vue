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
          Gestión de Departamento
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
        <validation-observer ref="DEPARTAMENT_FORM" tag="div">
          <v-row>
            <v-col cols="12" class="pt-2 pb-0">
              <label-form text="Nombre" required />
              <validation-provider name="Nombre" vid="nombre" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="departamentInfo.nombre"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" md="2" class="pt-2 pb-0">
              <label-form text="Siglas" required />
              <validation-provider name="Siglas" vid="siglas" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="departamentInfo.siglas"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="5" md="5" class="pt-2 pb-0">
              <label-form text="Código" required/>
              <validation-provider name="codigo" vid="codigo" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="departamentInfo.codigo"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" md="5" class="pt-2 pb-0">
              <label-form text="Email"/>
              <validation-provider name="email" vid="correo" rules="email" v-slot="{ errors }">
                <v-text-field
                  v-model="departamentInfo.correo"
                  outlined
                  dense
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" md="6" class="pt-2 pb-0">
              <label-form text="Núcleo" required/>
              <validation-provider name="cod_nucleo" vid="cod_nucleo" rules="required" v-slot="{ errors }">
                <v-select
                v-model="departamentInfo.cod_nucleo"
                :items="nucleos"
                :disabled="loadNucleo"
                item-text="nombre"
                item-value="codigo_concatenado"
                outlined
                dense
                :error-messages="errors[0]"
              >
              <template v-slot:append>
                <v-progress-circular
                  v-if="loadNucleo"
                  indeterminate
                  :width="3"
                  size="20"
                  color="primary"
                />
              </template>
            </v-select>
              </validation-provider>
            </v-col>
            <v-col cols="12" md="6" class="pt-2 pb-0">
              <label-form text="Departamento Superior" required/>
              <validation-provider name="Departamento Superior" vid="id_departamento_superior" rules="required" v-slot="{ errors }">
                <v-autocomplete
                v-model="departamentInfo.id_departamento_superior"
                :items="allDepartaments"
                item-text="nombre"
                item-value="id"
                outlined
                dense
                :error-messages="errors[0]"
              >
              <template v-slot:append>
                <v-progress-circular
                  v-if="loadNucleo"
                  indeterminate
                  :width="3"
                  size="20"
                  color="primary"
                />
              </template>
            </v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0">
              <label-form text="Direccion"/>
              <validation-provider name="Direccion" vid="departamentInfo.direccion" v-slot="{ errors }">
                <v-textarea
                  v-model="departamentInfo.direccion"
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
import { getNucleoList, saveDepartament } from '@/services/departamento'
const dataDefault = () => ({
  nombre: '',
  codigo: '',
  direccion: '',
  siglas: '',
  cod_nucleo: '',
  correo: '',
  id_departamento_superior: '',
});
export default {
  name:'ModalDepartamento',
  props:{
    value: Boolean,
    data:{
      type: Object,
      default: () => ({}),
    },
    departments:{
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
      loadNucleo: false,
      departamentInfo: dataDefault(),
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
        this.departamentInfo = {...val }
      }
      else
        this.departamentInfo = dataDefault();
    },
  },
  filters: {
    fisrtLetter(val) {
      return val !== null ? val.toUpperCase().charAt(0) : ''
    }
  },
  computed:{
    allDepartaments(){
      return this.departments.length > 0
        ? this.departments.filter(item => item.id !== this.departamentInfo?.id)
        : []
    }
  },
  created () {
    this.getNucleos()
  },
  methods: {
    cerrar() {
      this.show = false;
      this.departamentInfo = dataDefault();
      this.$refs.DEPARTAMENT_FORM.reset();
    },
    async getNucleos() {
      this.loadNucleo = true
      try {
        const { nucleos } = await getNucleoList()
        this.nucleos = nucleos
      } catch (error) {
        console.error(error)
      } finally {
        this.loadNucleo = false
      }
    },
    async actionGroup() {
      const valid = await this.$refs.DEPARTAMENT_FORM.validate();
      if(valid) {
        try {
          this.loadingAction = true;
          const { message } = await saveDepartament({
            info: this.departamentInfo,
            action: this.action,
            id: this.departamentInfo?.id ?? null
          })
          this.$emit('procesado', true);
          this.cerrar();
          this.$root.$showAlert(message, 'success');
        } catch (error) {
            const { response = null } = error
            if(response?.status === 422){
              this.$refs.DEPARTAMENT_FORM.setErrors(response?.data?.errors);
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
