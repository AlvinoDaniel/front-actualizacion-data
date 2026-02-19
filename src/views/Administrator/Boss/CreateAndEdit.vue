<template>
  <v-dialog
    v-model="show"
    persistent
    :max-width=" $vuetify.breakpoint.xsOnly ? '100%': '40%'"
    scrollable
    content-class="content-scroll"
  >
    <v-card tile>
      <v-card-title class="ma-0 d-flex justify-space-between secondary white--text">
        <span
          class="font-weight-bold"
          :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly,}"
        >
          Gestión de Jefe
        </span>
        <v-btn icon plain @click="cerrar()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-overlay
        :value="loadingAction"
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
      <v-card-text class="px-0">
        <v-card class="">
          <v-card-text>
            <validation-observer ref="STEP_BASIC_FORM" tag="div">
              <v-row>
                <v-col cols="12" class="pb-0">
                  <label class="font-weight-medium button black--text text-h6 mb-2">Unidad Administrativa</label>
                  <validation-provider name="Unidad Administrativa" vid="descripcion_unidad_admin" rules="required" v-slot="{ errors }">
                    <!-- <v-autocomplete
                      v-model="personal.id_unidad_admin"
                      :items="departments"
                      item-text="descripcion_unidad_admin"
                      item-value="id_unidad_admin"
                      outlined
                      class="mt-2"
                      :disabled="action === 'edit'"
                      :hide-details="action === 'edit'"
                      :error-messages="errors[0]"
                      >
                    </v-autocomplete> -->
                    <v-text-field
                      v-model="personal.descripcion_unidad_admin"
                      outlined
                      readonly
                      :error-messages="errors[0]"
                      color="label"
                      class="mt-2"
                      hide-details
                      >
                    </v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" class="mt-1">
                  <h3 class="font-weight-medium button black--text">Jefe Asignado</h3>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="mb-0 pb-0">
                  <label class="font-weight-medium button black--text text-h6 mb-2">Cédula de Identidad</label>
                  <validation-provider name="Cedula" vid="cedula_identidad" rules="required|numeric|max:8|min:6" v-slot="{ errors }" ref="REGISTER_CEDULA_FORM">
                    <v-text-field
                      v-model="personal.cedula_identidad"
                      outlined
                      :clearable="action === 'crear'"
                      :error-messages="errors[0]"
                      :disabled="searching"
                      :loading="searching"
                      append-icon="mdi-magnify"
                      @click:append="search()"
                      @keyup.enter="search()"
                      @blur="search()"
                      color="label"
                      class="mt-2"
                      hint="Ingrese para verificar en nuestros registros."
                      persistent-hint
                    >
                      <template slot="prepend-inner">
                        <v-icon color="label">mdi-account</v-icon>
                      </template>

                    </v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" class="pt-1">
                  <label class="font-weight-medium button black--text text-h6 mb-2">Nombres y Apellidos</label>
                  <validation-provider name="Nombres y Apellidos" vid="nombres_apellidos" rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-model="personal.nombres_apellidos"
                      outlined
                      readonly
                      :error-messages="errors[0]"
                      color="label"
                      class="mt-2"
                      hide-details
                      >
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <label class="font-weight-medium button black--text text-h6 mb-2">Cargo</label>
                  <validation-provider name="Cargo" vid="id_cargo" rules="required" v-slot="{ errors }">
                    <v-autocomplete
                      v-model="personal.id_cargo"
                      :items="catalogue.cargos"
                      item-text="descripcion"
                      item-value="codigo"
                      outlined
                      class="mt-2"
                      :error-messages="errors[0]"
                      :loading="loadingUnids"
                      >
                    </v-autocomplete>
                  </validation-provider>
                </v-col>
              </v-row>
              <v-row v-if="addBossOption">
                <v-col cols="12">
                  <validation-provider v-slot="{ errors }">
                    <v-checkbox
                      v-model="personal.agregar_jefatura"
                      label="Agregar Nueva Jefatura"
                      color="info"
                      value="true"
                      hide-details
                    ></v-checkbox>
                  </validation-provider>
                </v-col>
              </v-row>
            </validation-observer>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between mb-3">
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
        <div>
          <v-btn
            tile
            depressed
            color="success"
            class="px-8"
            :small="$vuetify.breakpoint.mobile"
            :loading="loadingAction"
            :disabled="!workerExists"
            @click="actionGroup"
          >
            Finalizar
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { searchPersonal, savePersonal, getUnidsWithoutLeadership } from '@/services/usuario'
import { updateBoss } from '@/services/admin'
import { getCatalogue } from '@/services/catalogue'
import { get } from 'vuex-pathify'
import { TALLAS_PANTALON, TALLAS_CAMISA } from '@/services/datos'

const dataDefault = () => ({
  nucleo: null,
  codigo_unidad_admin: null,
  id_cargo: null,
  id_unidad_admin: null,
  nombres_apellidos: null,
  cedula_identidad: null,
  descripcion_unidad_admin: null,
  agregar_jefatura: null,
});
export default {
  name:'ModalPersonal',
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
    laggards:{
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
      loadingUnids: false,
      personal: dataDefault(),
      nucleos: [],
      stepper: 1,
      searching: false,
      load: false,
      workerExists: false,
      sexo: [
        {value: 'M', name: 'MASCULINO'},
        {value: 'F', name: 'FEMENINO'},
      ],
      catalogue: {
        area_trabajo: [],
        tipo_calzado: [],
        prenda_extra: [],
        tipo_personal: [],
        unidades: [],
        cargos: [],
      },
      showUnid: true,
      addBossOption: false
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
        this.personal = {
          codigo_unidad_admin: val?.codigo_unidad_admin,
          id_cargo: val?.id_cargo,
          id_unidad_admin: val?.id_unidad_admin,
          nombres_apellidos: val?.nombres_apellidos,
          cedula_identidad: val?.cedula_identidad,
          descripcion_unidad_admin: val?.descripcion_unidad_admin,
        }
        this.workerExists = true
        console.log(this.personal)
      }
      else{
        this.personal = dataDefault();
      }
    },
  },
  computed:{
    user: get('user/infoBasic'),
  },
  created () {
    this.getData()
  },
  methods: {
    cerrar() {
      this.show = false;
      this.workerExists = false;
      this.personal = dataDefault();
      this.$refs.STEP_BASIC_FORM.reset();
      this.$emit('close', true);
    },
    async getData () {
      this.load = true;
      const catalogues = [
        {name: 'cargo', value: 'cargos'}
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
          'Lo siento, hubo un error al intentar obtener la información rquerida.',
          'error',
        )
      } finally {
        this.load = false
      }
    },
    async search () {
      const { valid } = await this.$refs.REGISTER_CEDULA_FORM.validate();
      if(valid) {
        this.searching = true;
        try {
          const personal  = await searchPersonal({cedula: this.personal.cedula_identidad, registered: false})
          this.personal.nombres_apellidos = personal?.nombres;
          this.workerExists = true;
          this.addBossOption = personal.jefe === 1 && personal.id_unidad_admin !== this.personal.id_unidad_admin;
        } catch (e) {
          this.$root.$showAlert( e.response ? e.response?.data?.errors?.message : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.', 'error');
          this.workerExists = false;
        } finally {
          this.searching = false;
        }
      }
		},
    async actionGroup() {
      const valid = await this.$refs.STEP_BASIC_FORM.validate();
      if(valid) {
        try {
          this.loadingAction = true;
          const { message } = await updateBoss({
            info: this.personal,
          })
          this.$emit('procesado', true);
          this.cerrar();
          this.$root.$showAlert(message, 'success');
        } catch (error) {
            const { response = null } = error
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
