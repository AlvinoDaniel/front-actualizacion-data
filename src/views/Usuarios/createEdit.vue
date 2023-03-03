<template>
  <v-container
    id="redactar"
    fluid
    tag="section"
    class=""
  >
    <loader-app v-if="loading" />
    <v-row class="pa-3" justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-row class="py-3">
          <v-col cols="12" class="d-flex align-center justify-space-between">
            <h4 class="font-weight-bold">
              <v-icon left @click="$router.go(-1)">
                mdi-arrow-left
              </v-icon>
              {{ !!id ? 'Actualizar' : 'Crear' }} Usuario
            </h4>
            <div
              class="d-flex"
            >
              <v-btn
                small
                depressed
                color="secondary"
                class="mx-1 rounded-lg"
                @click="saveUser"
                >
                <v-icon left>mdi-account-plus-outline</v-icon>
                {{ !!id ? 'ACTUALIZAR' : 'REGISTRAR' }}
              </v-btn>
            </div>
          </v-col>
          <v-col v-if="errors.length > 0" cols="12">
            <v-alert
              prominent
              type="error"
            >
              <v-row align="center">
                <v-col class="grow">
                  <ul>
                    <li
                      v-for="(e, i) in errors"
                      :key="`errors-${i}`"
                      v-text="e"
                    />
                  </ul>
                </v-col>
              </v-row>
            </v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <validation-observer ref="USER_FORM">
      <v-row class="pa-3" justify="center">
        <v-col cols="12" sm="10" md="8">
          <v-row>
            <v-col cols="12">
              <h4 class="blue-grey--text">Datos del trabajador</h4>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-divider />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="10" md="6" class="">
              <validation-provider name="Cedula Identidad" vid="info.cedula_identidad" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="dataPersonal"
                  :items="personal"
                  :search-input.sync="cedulaSearch"
                  :disabled="!!id"
                  item-text="cedula_identidad"
                  label="Cédula de Identidad"
                  placeholder="Buscar"
                  prepend-icon="mdi-database-search"
                  return-object
                  class="input-redactar"
                  :error-messages="errors[0]"
                  @blur="verificate"
                  @change="assignPersonal"
                >
                  <template v-slot:item="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-item-content v-text="data.item"></v-list-item-content>
                    </template>
                    <template v-else>
                      <v-list-item-content>
                        <v-list-item-title v-text="`${data.item.cedula_identidad} - ${data.item.nombres}`"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <validation-provider name="Nombre Completo" vid="info.nombres_apellidos" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="info.nombres_apellidos"
                  class="input-redactar"
                  label="Nombre Completo"
                  disabled
                  :error-messages="errors[0]"
                >

                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="6">
              <validation-provider name="Grado Instruccion" vid="info.grado_instruccion" rules="required" v-slot="{ errors }">
                <v-select
                  v-model="info.grado_instruccion"
                  :items="dataGeneral.niveles.data"
                  :loading="dataGeneral.niveles.loader"
                  item-text="descripcion"
                  item-value="id"
                  label="Grado de Instrucción"
                  class="input-redactar"
                  :error-messages="errors[0]"
                >
                  <template v-slot:item="data">
                    <span class="text-uppercase" v-text="data.item.descripcion" />
                  </template>
                </v-select>
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="6">
              <validation-provider name="Cargo" vid="info.cargo" rules="" v-slot="{ errors }">
                <v-text-field
                  v-model="info.cargo"
                  class="input-redactar"
                  label="Cargo actual"
                  :error-messages="errors[0]"
                >

                </v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <validation-provider name="Nucleo" vid="info.nucleo" rules="required" v-slot="{ errors }">
                <v-select
                  v-model="info.nucleo"
                  :items="dataGeneral.nucleos.data"
                  :loading="dataGeneral.nucleos.loader"
                  item-text="nombre"
                  item-value="codigo_concatenado"
                  label="Nucleo"
                  class="input-redactar"
                  :error-messages="errors[0]"
                  @change="getDepartamentos"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="6">
              <validation-provider name="Departamento" vid="info.departamento_id" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="info.departamento_id"
                  item-text="nombre"
                  item-value="id"
                  :items="dataGeneral.departamentos.data"
                  :loading="dataGeneral.departamentos.loader"
                  :disabled="dataGeneral.departamentos.data.length === 0"
                  label="Departamento"
                  class="input-redactar"
                  :error-messages="errors[0]"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h4 class="blue-grey--text">Datos de Usuario</h4>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-divider />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <validation-provider name="Usuario" vid="info.usuario" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="info.usuario"
                  class="input-redactar"
                  label="Usuario"
                  :error-messages="errors[0]"
                >
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="6">
              <validation-provider name="Email" vid="info.email" rules="required|email" v-slot="{ errors }">
                <v-text-field
                  v-model="info.email"
                  class="input-redactar"
                  label="Correo Electrónico"
                  :error-messages="errors[0]"
                >
                </v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <validation-provider name="Contraseña" vid="info.password" :rules="{required: !this.id}" v-slot="{ errors }">
                <v-text-field
                  v-model="info.password"
                  type="password"
                  class="input-redactar"
                  label="Contraseña"
                  :error-messages="errors[0]"
                >
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="6">
              <validation-provider name="Rol" vid="info.rol" rules="required" v-slot="{ errors }">
                <v-select
                  v-model="info.rol"
                  :items="dataGeneral.roles.data"
                  :loading="dataGeneral.roles.loader"
                  item-text="name"
                  item-value="name"
                  label="Rol"
                  class="input-redactar"
                  multiple
                  :error-messages="errors[0]"
                >
                  <template v-slot:item="data">
                    <span class="text-uppercase" v-text="data.item.name" />
                  </template>
                </v-select>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row v-if="roleJefe" >
            <v-col cols="12">
              <h4 class="blue-grey--text">Jefe de Departamento</h4>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-divider />
            </v-col>
            <v-col cols="12" class="pt-0">
              <validation-provider name="Cargo Jefe" vid="info.cargo_jefe" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="info.cargo_jefe"
                  class="input-redactar"
                  label="Descripción del Cargo Jefe"
                  :error-messages="errors[0]"
                >
                </v-text-field>
              </validation-provider>
            </v-col>
            <v-col
              cols="12"
              class="pb-0 pt-1"
            >
              <span class="v-label v-label mb-1">
                <v-icon small color="blue-grey" class="mr-1 mt-n1">mdi-grease-pencil</v-icon>
                Firma y Sello
              </span>
              <validation-provider name="Firma" vid="firma" :rules="{required: !id}" v-slot="{ errors }">
                <VueFileAgent
                  v-model="firma"
                  ref="FileImageFirma"
                  help-text="Suba la imagen en formato PNG"
                  :deletable="true"
                  class="py-2 input-imagen"
                  :accept="'.png'"
                  :theme="'list'"
                  :error-text="{type: 'Formato no válido.'}"
                  @beforedelete="fileDeleted($event)"
                />
                  <div class="v-text-field__details"><div class="v-messages theme--light error--text" role="alert"><div class="v-messages__wrapper"><div class="v-messages__message" v-text="errors[0]" /></div></div></div>
              </validation-provider>
            </v-col>
          </v-row>

        </v-col>
      </v-row>
    </validation-observer>
    <modal-success
      v-model="success"
      :title="!!id ? 'Usuario Actualizado' : 'Usuario Registrado'"
      :message="!!id ? '' : '¿Desea registrar otro usuario o Salir?'"
      :update="!!id"
      @confirm="resetData"
    />
  </v-container>
</template>
<script>

  import { getDepartamentoList, getNucleoList } from '@/services/departamento'
  import { searchPersonal, getAllRoles, getAllLevels, saveUser, updateUser, getUser } from '@/services/usuario'
  import { get } from 'vuex-pathify'
  import { validateFile, getInitals } from '@/util/helpers'
  import { decode } from 'js-base64';

  const infoDefault = {
      cedula_identidad: '',
      nombres_apellidos: '',
      cargo: '',
      cargo_jefe: '',
      nucleo: '',
      departamento_id: '',
      grado_instruccion: '',
      personal_id: '',
      email: '',
      usuario: '',
      password: '',
      rol: '',
  }
export default {
  name: 'CrearUsuario',
  components: {
    ModalSuccess: () => import(
      /* webpackChunkName: "modal-success" */
      './components/modalSuccess.vue'
    ),
  },
  data: () => ({
    info: {...infoDefault},
    firma: '',
    dataPersonal: null,
    cedulaSearch: '',
    dataGeneral:{
      nucleos: { loader: false, data: [] },
      departamentos: { loader: false, data: [] },
      roles: { loader: false, data: [] },
      niveles: { loader: false, data: [] },
    },
    personal:[],
    errors:[],
    loading: false,
    success: false
  }),
  watch:{
    cedulaSearch(val) {
      val && val !== this.info.cedula_identidad && this.querySelections(val)
    }
  },
  computed: {
    id: get('route/params@id'),
    roleJefe () {
      return this.info?.rol && this.info.rol.includes('jefe')
    }
  },
  created () {
    this.getNucleos()
    this.getRoles()
    this.getAllLevels()

    if(this.id)
      this.getUser()
  },
  methods: {
    async querySelections (cedula) {
      try {
        this.personal = await searchPersonal({cedula})
      } catch (error) {
        console.log(error)
      }
    },

    resetData () {
      this.info = { ...infoDefault }
      this.firma = ''
      this.dataPersonal = null
      this.cedulaSearch = null
      this.$refs.USER_FORM.reset()
    },

    async getDepartamentos () {

      const { nucleo } = this.info
      this.dataGeneral.departamentos.loader = true
      this.dataGeneral.departamentos.data = []
      try {
        const { departamentos } = await getDepartamentoList({ nucleo })
        this.dataGeneral.departamentos.data = departamentos
      } catch (error) {
        console.log(error)
      } finally {
        this.dataGeneral.departamentos.loader = false
      }
    },

    async getUser () {
      this.loading = true
      try {
        const {personal, roles, ...usuario} = await getUser({ id: this.id })
        this.info = {
          cedula_identidad: personal.cedula_identidad,
          nombres_apellidos: personal.nombres_apellidos,
          cargo: personal.cargo,
          cargo_jefe: personal.descripcion_cargo,
          nucleo: personal.cod_nucleo,
          departamento_id: personal.departamento_id,
          grado_instruccion: personal.nivel ? parseInt(personal.nivel.id) : null,
          email: usuario.email,
          usuario: usuario.usuario,
          password: '',
          rol: roles.map(rol => rol?.name),
        }
        // this.cedulaSearch = personal.cedula_identidad
        this.dataPersonal = {...personal}
        this.personal.push({nombres: personal.nombres_apellidos, ...personal})
        this.getDepartamentos()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },


    async getNucleos () {
      this.dataGeneral.nucleos.loader = true
      try {
        const { nucleos } = await getNucleoList()
        this.dataGeneral.nucleos.data = nucleos.map(item => {
          return {
            ...item,
            codigo_concatenado: parseInt(item.codigo_concatenado),
          }
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.dataGeneral.nucleos.loader = false
      }
    },

    async getRoles () {
      this.dataGeneral.roles.loader = true
      try {
        const { roles } = await getAllRoles()
        this.dataGeneral.roles.data = roles
      } catch (error) {
        console.log(error)
      } finally {
        this.dataGeneral.roles.loader = false
      }
    },

    async getAllLevels () {
      this.dataGeneral.niveles.loader = true
      try {
        const { niveles } = await getAllLevels()
        this.dataGeneral.niveles.data = niveles
      } catch (error) {
        console.log(error)
      } finally {
        this.dataGeneral.niveles.loader = false
      }
    },

    verificate () {
      if(typeof this.dataPersonal === 'object' && this.cedulaSearch === ''){
        this.dataPersonal = null
      }
    },

    assignPersonal () {
      if(this.dataPersonal) {
        const {id, cargo, cedula_identidad, nombres, correo, cod_nucleo } = this.dataPersonal

        this.info.cedula_identidad = cedula_identidad
        this.info.cargo = cargo
        this.info.nombres_apellidos = nombres
        this.info.email = correo
        this.info.personal_id = id
        if(cod_nucleo){
          this.info.nucleo = cod_nucleo && parseInt(cod_nucleo)
          this.getDepartamentos()
        }
      }
    },

    fileDeleted(record) {
      this.$refs.FileImageFirma.deleteFileRecord(record)
    },

    async saveUser () {

      const valid = await this.$refs.USER_FORM.validate()
      if (valid) {
        this.errors.length = 0
        const datos = new FormData()
        for (const key in this.info) {
          if (Object.hasOwnProperty.call(this.info, key)) {
            if (this.info[key] !== null && typeof this.info[key] === 'object') {
              console.log(key)
              this.info[key].forEach(element => {
                datos.append(`${key}[]`, element)
              });
            } else {
              datos.append(key, this.info[key])
            }
          }
        }

        if (this.roleJefe && this.firma) {
          datos.append('firma', this.firma.file)
        }

        this.loading = true
        try {
          const { message } = this.id
            ? await updateUser({ datos, id: this.id, personal: this.dataPersonal?.id })
            : await saveUser({ datos })

          this.success = true
          //  this.$root.$showAlert(message, 'success')
          //  this.$router.push({ name: this.urlBandejas[status] })
        } catch (error) {
          if(error.response){
            const {data, status} = error.response

            if(status === 422){
              const validations = Object.values(data.errors).flat()
              this.errors = [...validations]
            }
            else {
              this.errors.push(data?.message ?? data?.errors?.message)
            }

          }
          console.log(error)
        } finally {
          this.loading = false
        }
      }
      // else {
      //   this.$refs.contenido.setFlags({ touched: true })
      // }
    },

  },
}

</script>
<style lang="sass">
  .input-redactar
    padding-top: 5px
    & input
      padding: 20px 0 20px !important
    & .v-input__prepend-inner
      display: flex
      align-self: center
      padding-bottom: 5px
      & span
        min-width: 100px
        color: #78909c !important
        caret-color: #78909c !important
        font-weight: 500 !important
  .input-cc .v-input__append-outer
    position: absolute
    top: 0
    transform: translateY(5%)
    right: 0
  .input-cc .v-select__slot
    margin-right: 80px

  .border-input.v-input__slot::before
    border-color: rgba(0, 0, 0, 0.42)
    border-style: solid
    border-width: thin 0 0 0
    bottom: -1px
    content: ""
    left: 0
    position: absolute
    -webkit-transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
    width: 100%

  .btn-adjuntar
    & .v-input__prepend-outer
      margin-top: 2px !important
    & .v-icon.v-icon
      font-size: 20px
      color: #2db2d5 !important
    & button
      border: thin solid #607d8b
      border-radius: 8px !important
      padding: 0 8.4444444444px
      height: 28px
      &.v-icon.v-icon::after
        background-color: transparent !important
  .active-type .v-label, .active-type i
    color: #2DB2D5 !important
    font-weight: 500 !important

  .ck.ck-editor__main>.ck-editor__editable
    min-height: 200px !important

  .invalid .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused)
    border-color: #ff5252 !important

</style>
