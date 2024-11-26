<template>
  <div>
    <v-row justify="center">
          <v-col cols="12" sm="6" md="4">
            <v-card
              style="z-index:10"
              :flat="$vuetify.breakpoint.xsOnly"
              :color="$vuetify.breakpoint.xsOnly ? 'transparent' : ''"
              class="v-card--material"
            >
              <v-card-title class="align-center flex-column mb-4">
                <div class="d-flex justify-center">
                  <v-img
                    :src="
                      require('@/assets/Logos/Logo_UDO.png')"
                    width="90"
                  />
                </div>
                <div class="text-h2 font-weight-black text-center primary--text pa-7 v-card--material__title">
                  REGISTRAR NUEVA CUENTA
                  <div class="text-subtitle-1 text-center mb-n4 font-weight-bold">
                    Ingrese los datos solicitados para acceder a nuestro sistema
                  </div>
                </div>
              </v-card-title>
              <v-card-text :class="{'pa-0':$vuetify.breakpoint.xsOnly, 'px-8':!$vuetify.breakpoint.xsOnly}">
                <validation-observer ref="REGISTER_FORM">
                  <v-row>
                    <v-col cols="12" class="mb-0 pb-0">
                      <label class="font-weight-medium button black--text text-h6 mb-2">Cédula de Identidad</label>
                      <validation-provider name="Cedula" vid="cedula" rules="required|numeric|max:8|min:6" v-slot="{ errors }" ref="REGISTER_CEDULA_FORM">
                        <v-text-field
                          v-model="credentials.cedula"
                          outlined
                          clearable
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin || searching"
                          :loading="searching"
                          append-icon="mdi-magnify"
                          @click:append="search()"
                          @blur="search()"
                          color="label"
                          class="mt-2"
                          hint="Ingrese su Documento de Identidad para verificar en nuestros registros."
                          persistent-hint
                        >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-account</v-icon>
                          </template>

                        </v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="mb-0 pb-0">
                      <label class="font-weight-medium button black--text text-h6 mb-2">Corre Electronico</label>
                      <validation-provider name="Correo Electronico" vid="correo" rules="required|email" v-slot="{ errors }">
                        <v-text-field
                          v-model="credentials.correo"
                          outlined
                          clearable
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin || !workerExists"
                          color="label"
                          class="mt-2"
                          hint="Ingrese su Correo Electrónico actualizado"
                          persistent-hint
                          >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-account</v-icon>
                          </template>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="mb-0 pb-0">
                      <validation-provider name="Contraseña" vid="password" rules="required" v-slot="{ errors }">
                        <label for="" class="font-weight-medium button black--text text-h6">Contraseña</label>
                        <v-text-field
                          v-model="credentials.password"
                          outlined
                          color="label"
                          :type="ShowPassword ? 'text' : 'password'"
                          prepend-inner-icon="mdi-lock"
                          :append-icon="ShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="ShowPassword = !ShowPassword"
                          clearable
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin || !workerExists"
                          @keyup.enter="login"
                          class="mt-2"
                        >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-lock</v-icon>
                          </template>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="mb-0 pb-0">
                      <validation-provider name="Confirmar Contraseña" vid="confirm_password" rules="required|confirmed:password" v-slot="{ errors }">
                        <label for="" class="font-weight-medium button black--text text-h6">Confirmar Contraseña</label>
                        <v-text-field
                          v-model="credentials.confirm_password"
                          outlined
                          color="label"
                          :type="ShowPassword ? 'text' : 'password'"
                          prepend-inner-icon="mdi-lock"
                          :append-icon="ShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="ShowPassword = !ShowPassword"
                          clearable
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin || !workerExists"
                          @keyup.enter="login"
                          class="mt-2"
                        >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-lock</v-icon>
                          </template>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="10" class="text-center mx-auto mt-5">
                    <v-btn
                        color="secondary"
                        depressed
                        class="px-12"
                        block
                        :disabled="!workerExists"
                        @click="save()"
                        :loading="LoadingLogin"
                      >
                        REGISTRAR
                        <v-icon right>
                          mdi-arrow-right
                        </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-center align-center pt-0">
                      <span class="text-subtitle-1 label--text mx-2">¿Ya tienes cuenta registrada?</span>
                      <v-btn
                        link
                        text
                        small
                        :ripple="false"
                        color="secondary"
                        class="text-capitalize"
                      >
                        Ingresar Aquí
                      </v-btn>
                    </v-col>
                  </v-row>
                </validation-observer>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      <material-snackbar
        v-model="alert.active"
        :type="alert.type"
      >
        {{ alert.message }}
      </material-snackbar>

  </div>
</template>
<script>
import { searchPersonal, saveAccount } from '@/services/registro'
export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        cedula: '',
        password: '',
        confirm_password: '',
        correo: '',
        personal_id: ''
      },
      ShowPassword: false,
      LoadingLogin: false,
      searching: false,
      workerExists: false,
      success: true,
      alert:{
        active: false,
        message: '',
        type: 'error'
      },
    }
  },
  methods:{
    async save () {
      const valid = await this.$refs.REGISTER_FORM.validate();
      if(valid) {
        this.LoadingLogin = true;
        try {
          await saveAccount({datos: this.credentials})
          this.$root.$showAlert('Cuenta registrada exitosamente.', 'success');
          this.$router.push({name: 'Login'})
        } catch (e) {
          this.alert = {
            active: true,
            message: e.response ? e.response?.data?.errors?.message : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.',
            type: 'error'
          };
        }  finally {
          this.LoadingLogin = false;
        }
      }
		},
    async search () {
      const { valid } = await this.$refs.REGISTER_CEDULA_FORM.validate();
      if(valid) {
        this.credentials.personal_id = null;
        this.credentials.correo = '';
        this.credentials.password = '';
        this.credentials.confirm_password = '';
        this.searching = true;
        try {
          const { personal = null } = await searchPersonal({cedula: this.credentials.cedula})
          this.credentials.personal_id = personal?.id;
          this.credentials.correo = personal?.email;
          this.workerExists = true;
        } catch (e) {
          this.alert = {
            active: true,
            message: e.response ? e.response?.data?.errors?.message : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.',
            type: 'error'
          };
        } finally {
          this.searching = false;
        }
      }
		},
    redirect(){
      this.$router.push({name: 'Login'})
    }
  }

}
</script>
<style lang="sass">
  .v-card.v-card--material
    > .v-card__title
      > .v-card--material__title
        flex: 1 1 auto
        word-break: break-word
  .full-height
    height: 100vh
</style>
