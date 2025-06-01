<template>
  <v-dialog
    v-model="show"
    persistent
    :max-width=" $vuetify.breakpoint.xsOnly ? '100%': '70%'"
    scrollable
    content-class="content-scroll"
  >
    <v-card tile>
      <v-card-title class="ma-0 d-flex justify-space-between secondary white--text">
        <span
          class="font-weight-bold"
          :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly,}"
        >
          Gestión de Personal
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
        <v-stepper v-model="stepper" alt-labels class="elevation-0">
          <v-stepper-header class="elevation-0">
              <v-stepper-step
                step="1"
              >
                Datos Básicos
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step
                step="2"
              >
                Uniforme
              </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1" class="px-0">
              <v-card class="">
                <v-card-text>
                  <validation-observer ref="STEP_BASIC_FORM" tag="div">
                    <v-row>
                      <v-col cols="12" sm="6" md="4" class="mb-0 pb-0">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Cédula de Identidad</label>
                        <validation-provider name="Cedula" vid="cedula_identidad" rules="required|numeric|max:8|min:6" v-slot="{ errors }" ref="REGISTER_CEDULA_FORM">
                          <v-text-field
                            v-model="personal.cedula_identidad"
                            outlined
                            :clearable="action === 'crear'"
                            :error-messages="errors[0]"
                            :disabled="searching || action === 'edit'"
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
                      <v-col cols="12" sm="6" md="8">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Nombres y Apellidos</label>
                        <validation-provider name="Nombres y Apellidos" vid="nombres_apellidos" rules="required" v-slot="{ errors }">
                          <v-text-field
                            v-model="personal.nombres_apellidos"
                            outlined
                            :disabled="!workerExists"
                            readonly
                            :error-messages="errors[0]"
                            color="label"
                            class="mt-2"
                            >
                          </v-text-field>
                        </validation-provider>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Tipo Personal</label>
                        <validation-provider name="Tipo Personal" vid="tipo_personal" rules="required" v-slot="{ errors }">
                          <v-select
                            v-model="personal.tipo_personal"
                            :items="catalogue.tipo_personal"
                            :loading="load"
                            :disabled="!workerExists"
                            readonly
                            item-text="descripcion"
                            item-value="id"
                            outlined
                            class="mt-2"
                            :error-messages="errors[0]"
                          >
                          </v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" :md="showUnid ? 4 : 8">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Cargo OPSU</label>
                        <validation-provider name="Cargo OPSU" vid="cargo_opsu" rules="required" v-slot="{ errors }">
                          <v-text-field
                            v-model="personal.cargo_opsu"
                            outlined
                            :disabled="!workerExists"
                            readonly
                            :error-messages="errors[0]"
                            color="label"
                            class="mt-2"
                            >
                          </v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col v-if="showUnid" cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Unidad Ejecutora</label>
                        <validation-provider name="Unidad" vid="unidad" rules="required" v-slot="{ errors }">
                          <v-select
                            v-model="personal.unidad"
                            :items="catalogue.unidades"
                            item-text="descripcion_unidad_ejec"
                            item-value="id"
                            outlined
                            class="mt-2"
                            :disabled="!workerExists"
                            :error-messages="errors[0]"
                            >
                          </v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Corre Electronico</label>
                        <validation-provider name="Correo Electronico" vid="correo" rules="required|email" v-slot="{ errors }">
                          <v-text-field
                            v-model="personal.correo"
                            outlined
                            :disabled="!workerExists"
                            clearable
                            :error-messages="errors[0]"
                            color="label"
                            class="mt-2"
                            hint="Ingrese su Correo Electrónico actualizado"
                            persistent-hint
                            >
                          </v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Teléfono Móvil</label>
                        <validation-provider name="Telefono" vid="telefono" rules="required|length:12" v-slot="{ errors }">
                          <v-text-field
                            v-model="personal.telefono"
                             v-mask="'####-#######'"
                            outlined
                            clearable
                            :disabled="!workerExists"
                            :error-messages="errors[0]"
                            color="label"
                            class="mt-2"
                            placeholder="04XX-XXXXXXX"
                            persistent-placeholder
                            hint="Ingrese su Teléfono actualizado. Ej. 04XX-XXXXXXX"
                            persistent-hint
                            >
                          </v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Sexo</label>
                        <validation-provider name="Sexo" vid="sexo" rules="required" v-slot="{ errors }">
                          <v-select
                            v-model="personal.sexo"
                            :items="sexo"
                            :disabled="!workerExists"
                            item-text="name"
                            item-value="value"
                            outlined
                            class="mt-2"
                            :error-messages="errors[0]"
                          >
                          </v-select>
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </validation-observer>
                </v-card-text>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
          <v-stepper-items>
            <v-stepper-content step="2">
              <v-card class="">
                <v-card-text>
                  <validation-observer ref="STEP_UNIFORM_FORM" tag="div">
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Area de trabajo</label>
                        <validation-provider name="Área de Trabajo" vid="area_trabajo" rules="required" v-slot="{ errors }">
                          <v-select
                            v-model="personal.area_trabajo"
                            :items="areasByPersonal"
                            :loading="load"
                            :disabled="load"
                            item-text="descripcion"
                            item-value="id"
                            outlined
                            class="mt-2"
                            :error-messages="errors[0]"
                          >
                          </v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Talla Pantalon</label>
                        <validation-provider name="Talla Pantalon" vid="pantalon" rules="required" v-slot="{ errors }">
                          <v-select
                            v-model="personal.pantalon"
                            :items="tallasBySex"
                            item-text="talla"
                            item-value="talla"
                            outlined
                            class="mt-2"
                            :error-messages="errors[0]"
                          >
                          </v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Talla Camisa</label>
                        <validation-provider name="Talla Camisa" vid="camisa" rules="required" v-slot="{ errors }">
                          <v-select
                            v-model="personal.camisa"
                            :items="tallasCamisa"
                            outlined
                            class="mt-2"
                            :error-messages="errors[0]"
                          >
                          </v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Tipo Calzado</label>
                        <validation-provider name="Tipo Calzado" vid="tipo_calzado" rules="required" v-slot="{ errors }">
                          <v-select
                            v-model="personal.tipo_calzado"
                            :items="catalogue.tipo_calzado"
                            :loading="load"
                            :disabled="load"
                            item-text="descripcion"
                            item-value="id"
                            outlined
                            class="mt-2"
                            :error-messages="errors[0]"
                          >
                          </v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Talla de Zapatos</label>
                        <validation-provider name="Talla de Zapatos" vid="zapato" rules="required|numeric|digits:2|min_value:30|max_value:50" v-slot="{ errors }">
                          <v-text-field
                            v-model="personal.zapato"
                            outlined
                            clearable
                            :error-messages="errors[0]"
                            color="label"
                            class="mt-2"
                            persistent-hint
                            >
                          </v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <label class="font-weight-medium button black--text text-h6 mb-2">Prenda Extra</label>
                        <validation-provider name="Prenda Extra" vid="prenda_extra" rules="required" v-slot="{ errors }">
                          <v-select
                            v-model="personal.prenda_extra"
                            :items="catalogue.tipo_prenda"
                            :loading="load"
                            :disabled="load"
                            item-text="descripcion"
                            item-value="id"
                            outlined
                            class="mt-2"
                            :error-messages="errors[0]"
                          >
                          </v-select>
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </validation-observer>
                </v-card-text>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <!-- <validation-observer ref="DEPARTAMENT_FORM" tag="div">

        </validation-observer> -->
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
          <div v-if="stepper === 2">
            <v-btn
              tile
              depressed
              color="blue-grey lighten-5"
              class="px-8 mx-2"
              :small="$vuetify.breakpoint.mobile"
              @click="backStep()"
            >
              Atras
            </v-btn>
            <v-btn
              tile
              depressed
              color="success"
              class="px-8"
              :small="$vuetify.breakpoint.mobile"
              :loading="loadingAction"
              @click="actionGroup"
            >
              {{action === 'edit' ? 'Actualizar' : 'Finalizar'}}
            </v-btn>
          </div>
          <v-btn
            v-else
            tile
            depressed
            color="primary"
            class="px-8"
            :small="$vuetify.breakpoint.mobile"
            @click="nextStep"
          >
            Siguiente
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { searchPersonal, savePersonal } from '@/services/usuario'
import { getCatalogue } from '@/services/catalogue'
import { get } from 'vuex-pathify'
import { TALLAS_PANTALON, TALLAS_CAMISA } from '@/services/datos'

const dataDefault = () => ({
  correo: null,
  telefono: null,
  area_trabajo: null,
  camisa: null,
  pantalon: null,
  zapato: null,
  tipo_calzado: null,
  prenda_extra: null,
  sexo: null,
  cedula_identidad: null,
  nombres_apellidos: null,
  cargo_opsu: null,
  tipo_personal: null,
  unidad: 0,
  id: null,
  nucleo: null
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
    action: {
      type: String,
      default: 'crear',
    },
  },
  data() {
    return {
      show: this.value,
      loadingAction: false,
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
        unidades: []
      },
      showUnid: true
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
      const {unidades = [] } = this.user
      if(Object.values(val).length > 0) {
        this.personal = {
          ...val,
          tipo_personal: parseInt(val?.tipo_personal),
          unidad: unidades.find(item => item.codigo_unidad_ejec === val.codigo_unidad_ejec)?.id ?? null,
          nucleo: val?.cod_nucleo.toString().at(0)
        }
        this.workerExists = true
      }
      else{
        this.personal = dataDefault();
      }
    },
  },
  computed:{
    user: get('user/infoBasic'),
    tallasBySex(){
      return TALLAS_PANTALON;
    },
    tallasCamisa(){
      return TALLAS_CAMISA
    },
    areasByPersonal(){
        return this.catalogue.area_trabajo.length > 0
          ? this.catalogue.area_trabajo.filter(item => item.tipo_personal === this.personal.tipo_personal)
          : []
      },
  },
  created () {
    this.setUnidades()
    this.getData()
  },
  methods: {
    setUnidades(){
      const {unidades = [] } = this.user
      this.catalogue.unidades = unidades.map(item => {
        return {
          codigo_unidad_admin: item?.codigo_unidad_admin,
          codigo_unidad_ejec: item?.codigo_unidad_ejec,
          descripcion_unidad_admin: item?.entidad?.descripcion_unidad_admin,
          descripcion_unidad_ejec: item?.entidad?.descripcion_unidad_ejec,
          id: item?.id
        }
      });

      if(unidades.length > 0 && unidades.length === 1){
        this.personal.unidad = unidades[0]?.id;
        this.showUnid = false;
      }
    },
    cerrar() {
      this.show = false;
      this.stepper = 1;
      this.workerExists = false;
      this.personal = dataDefault();
      this.$refs.STEP_UNIFORM_FORM.reset();
      this.$refs.STEP_BASIC_FORM.reset();
      this.$emit('close', true);
    },
    async getData () {
      this.load = true;
      const catalogues = [
        {name: 'tipo-prenda', value: 'tipo_prenda'},
        {name: 'tipo-calzado', value: 'tipo_calzado'},
        {name: 'area-trabajo', value: 'area_trabajo'},
        {name: 'tipo-personal', value: 'tipo_personal'}
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
          'Lo siento, hubo un error al intentar obtener los Pagos.',
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
          const personal  = await searchPersonal({cedula: this.personal.cedula_identidad})

          this.personal.correo = personal?.correo;
          this.personal.telefono = personal?.telefono;
          this.personal.area_trabajo = null;
          this.personal.camisa = null;
          this.personal.pantalon = null;
          this.personal.zapato = null;
          this.personal.tipo_calzado = null;
          this.personal.prenda_extra = null;
          this.personal.sexo = personal?.sexo;
          this.personal.nombres_apellidos = personal?.nombres;
          this.personal.cargo_opsu = personal?.cargo_opsu;
          this.personal.tipo_personal = parseInt(personal?.tipo_personal);
          this.personal.unidad = null;
          this.personal.nucleo = personal?.cod_nucleo;

          this.workerExists = true;
        } catch (e) {
          this.$root.$showAlert( e.response ? e.response?.data?.errors?.message : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.', 'error');
        } finally {
          this.searching = false;
        }
      }
		},
    async actionGroup() {
      const valid = await this.$refs.STEP_UNIFORM_FORM.validate();
      if(valid) {
        try {
          if(this.catalogue.unidades.length > 0 && this.catalogue.unidades.length === 1){
            this.personal.unidad = this.catalogue.unidades[0]?.id;
          }
          this.loadingAction = true;
          const { message } = await savePersonal({
            info: this.personal,
            action: this.action,
            id: this.personal?.id ?? null
          })
          const unidSelect = this.catalogue.unidades.findIndex(item => item.id === this.personal.unidad)
          this.$emit('procesado', this.catalogue.unidades[unidSelect]);
          this.$emit('tab', unidSelect);
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
    async nextStep(){
      const valid = await this.$refs.STEP_BASIC_FORM.validate();
      if(valid){
        this.stepper = 2;
      }
    },
    backStep(){
      this.stepper = 1;
    }
  },
}
</script>
