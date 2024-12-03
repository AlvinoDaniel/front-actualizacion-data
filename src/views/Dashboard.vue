<template>
  <v-container
    id="dashboard-view"
    fluid
    tag="section"
    class="py-0"
    :class="{'px-12': $vuetify.breakpoint.xlOnly, 'px-3': $vuetify.breakpoint.mdAndUp}"
  >
    <v-overlay
      v-if="load"
      :value="true"
      color="white"
      absolute
      opacity="1"
      key="DashboardOverlay"
      style="z-index: 2 !important"
    >
      <div class="d-flex flex-column justify-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
          class="mx-auto"
        ></v-progress-circular>
        <span class="primary--text py-5">Obteniendo Información</span>
      </div>
    </v-overlay>
    <header>
      <v-row class="py-3">
        <v-col cols="12" class="d-flex flex-row align-center">
          <div class="d-flex flex-column">
            <span
              class="font-weight-medium primary--text h1"
              :class="{'text-h3': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly }"
            >
              Bienvenido
            </span>
            <!-- <span
              class="blue-grey--text subtitle-2"
              v-text="now"
            /> -->
          </div>
        </v-col>
      </v-row>
    </header>
    <section>
      <v-row class="py-3">
        <v-col cols="12" sm="6" md="4">
          <v-card class="fill-height">
            <v-card-text class="text--primary">
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-avatar color="secondary" rounded size="60">
                      <v-icon dark size="40">
                        mdi-badge-account-outline
                      </v-icon>
                    </v-avatar>
                    <div class="mx-3">
                      <h2>{{ user.nombres_apellidos }}</h2>
                      <h4>Documento Identidad: {{ user.cedula }}</h4>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <h5>INFORMACIÓN LABORAL</h5>
                  <v-list>
                    <v-list-item class="pl-0">
                      <v-list-item-icon class="ml-0 mr-1">
                        <v-icon>mdi-account-circle-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="">
                          <span class="text-muted" style="font-size: 1rem;">Tipo Personal: </span>
                          <span class="font-weight-bold" style="font-size: 1rem;">{{ user.tipo_personal }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider />
                    <v-list-item class="pl-0">
                      <v-list-item-icon class="ml-0 mr-1">
                        <v-icon>mdi-bank</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="">
                          <span class="text-muted" style="font-size: 1rem;">Núcleo: </span>
                          <span class="font-weight-bold" style="font-size: 1rem;">{{ user.nucleo }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider />
                    <v-list-item class="pl-0">
                      <v-list-item-icon class="ml-0 mr-1">
                        <v-icon>mdi-ballot-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="">
                          <span class="text-muted" style="font-size: 1rem;">Unidad Administrativa: </span>
                          <span class="font-weight-bold" style="font-size: 1rem;">{{ user.uni_admin }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider />
                    <v-list-item class="pl-0">
                      <v-list-item-icon class="ml-0 mr-1">
                        <v-icon>mdi-ballot-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="">
                          <span class="text-muted" style="font-size: 1rem;">Unidad Ejecutora: </span>
                          <span class="font-weight-bold" style="font-size: 1rem;">{{ user.uni_ejec }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider />
                    <v-list-item class="pl-0">
                      <v-list-item-icon class="ml-0 mr-1">
                        <v-icon>mdi-account-tie</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="">
                          <span class="text-muted" style="font-size: 1rem;">Cargo Jefe: </span>
                          <span class="font-weight-bold" style="font-size: 1rem;">{{ user.cargo_jefe }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider />
                    <v-list-item class="pl-0">
                      <v-list-item-icon class="ml-0 mr-1">
                        <v-icon>mdi-account-tie-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title class="">
                          <span class="text-muted" style="font-size: 1rem;">Cargo OPSU: </span>
                          <span class="font-weight-bold" style="font-size: 1rem;">{{ user.cargo_opsu }}</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="8">
          <v-card class="">
            <v-card-text class="text--primary">
              <validation-observer ref="UPDATE_FORM">
                <v-row>
                  <v-col cols="12">
                    <h2>Datos Básicos</h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <label class="font-weight-medium button black--text text-h6 mb-2">Corre Electronico</label>
                    <validation-provider name="Correo Electronico" vid="correo" rules="required|email" v-slot="{ errors }">
                      <v-text-field
                        v-model="info.correo"
                        outlined
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
                    <validation-provider name="Telefono" vid="telefono" rules="required" v-slot="{ errors }">
                      <v-text-field
                        v-model="info.telefono"
                        outlined
                        clearable
                        :error-messages="errors[0]"
                        color="label"
                        class="mt-2"
                        hint="Ingrese su Teléfono actualizado"
                        persistent-hint
                        >
                      </v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <label class="font-weight-medium button black--text text-h6 mb-2">Sexo</label>
                    <validation-provider name="Sexo" vid="sexo" rules="required" v-slot="{ errors }">
                      <v-select
                        v-model="info.sexo"
                        :items="sexo"
                        :loading="load"
                        :disabled="load"
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
                <v-row>
                  <v-col cols="12">
                    <h2>Uniforme</h2>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <label class="font-weight-medium button black--text text-h6 mb-2">Area de trabajo</label>
                    <validation-provider name="Área de Trabajo" vid="area_trabajo" rules="required" v-slot="{ errors }">
                      <v-select
                        v-model="info.area_trabajo"
                        :items="catalogue.area_trabajo"
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
                      <v-text-field
                        v-model="info.pantalon"
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
                    <label class="font-weight-medium button black--text text-h6 mb-2">Talla Camisa</label>
                    <validation-provider name="Talla Camisa" vid="camisa" rules="required" v-slot="{ errors }">
                      <v-text-field
                        v-model="info.camisa"
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
                    <label class="font-weight-medium button black--text text-h6 mb-2">Tipo Calzado</label>
                    <validation-provider name="Tipo Calzado" vid="tipo_calzado" rules="required" v-slot="{ errors }">
                      <v-select
                        v-model="info.tipo_calzado"
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
                    <validation-provider name="Talla de Zapatos" vid="zapato" rules="required" v-slot="{ errors }">
                      <v-text-field
                        v-model="info.zapato"
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
                        v-model="info.prenda_extra"
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
                <v-row align="center">
                  <v-col cols="12" md="8" class="d-flex justify-between mt-2">
                    <v-alert
                      v-if="hasUpdate"
                      dense
                      text
                      icon="mdi-shield-check"
                      type="success"
                      class="mb-0"
                    >
                     <strong> Datos Actualizados </strong>
                    </v-alert>
                    <v-alert
                      v-else
                      dense
                      text
                      icon="mdi-shield-check"
                      type="error"
                      class="mb-0"
                    >
                      <span class="d-block">
                        <strong> Debe actualizar sus datos </strong>
                      </span>
                      <small>Es necesario actualizar todos los datos requeridos.</small>
                    </v-alert>
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex justify-end mt-2">
                    <v-btn
                      color="secondary"
                      depressed
                      class="px-12"
                      :disabled="saving"
                      :loading="saving"
                      @click="update()"
                    >
                      Actualizar
                      <v-icon right>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </validation-observer>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
  // Utilities
  import { get } from 'vuex-pathify'
  import { getCatalogue } from '@/services/catalogue'
  import { updateAuthUser } from '@/services/usuario'

  export default {
    name: 'DashboardView',
    data: () => ({
      info: {
        correo: null,
        telefono: null,
        area_trabajo: null,
        camisa: null,
        pantalon: null,
        zapato: null,
        tipo_calzado: null,
        prenda_extra: null,
        sexo: null
      },
      sexo: [
        {value: 'M', name: 'MASCULINO'},
        {value: 'F', name: 'FEMENINO'},
      ],
      load: false,
      saving: false,
      catalogue: {
        area_trabajo: [],
        tipo_calzado: [],
        prenda_extra: [],
      },
    }),
    computed: {
      user: get('user/infoBasic'),
      hasUpdate: get('user/hasUpdate'),
    },
    created () {
      this.setData()
      this.getData()
    },
    methods: {
      async getData () {
        this.load = true;
        const catalogues = [
          {name: 'tipo-prenda', value: 'tipo_prenda'},
          {name: 'tipo-calzado', value: 'tipo_calzado'},
          {name: 'area-trabajo', value: 'area_trabajo'}
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
      setData(){
        const { personal } = this.user;
        this.info.correo = personal?.correo;
        this.info.telefono = personal?.telefono;
        this.info.camisa = personal?.camisa;
        this.info.pantalon = personal?.pantalon;
        this.info.zapato = personal?.zapato;
        this.info.sexo = personal?.sexo;
        this.info.area_trabajo = personal?.area_trabajo;
        this.info.prenda_extra = personal?.prenda_extra;
        this.info.tipo_calzado = personal?.tipo_calzado;
      },
      async update () {
      const valid = await this.$refs.UPDATE_FORM.validate();
      if(valid) {
        this.saving = true;
        try {
          console.log('UPDATE')
          const personal = await updateAuthUser({datos: this.info})
          this.$store.dispatch('user/getInfo');
          this.$root.$showAlert('Datos Actualizados exitosamente.', 'success');
        } catch (e) {
          this.$root.$showAlert( e.response ? e.response?.data?.errors?.message : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.', 'error');
        }  finally {
          this.saving = false;
        }
      }
		},
    }
  }
</script>
<style lang="sass">
.cliente-titulo
    font-size: 0.9rem !important
    font-weight: 500
    line-height: 1.5em
    letter-spacing: 0.0125em !important
    font-family: "Open Sans" !important
    text-transform: uppercase !important

</style>
