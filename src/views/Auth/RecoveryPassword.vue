<template>
  <div class="d-flex justify-center align-center" style="min-height: calc(100vh - 84px);">
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card
          style="z-index:10"
          :flat="$vuetify.breakpoint.xsOnly"
          :color="$vuetify.breakpoint.xsOnly ? 'transparent' : ''"
          class="v-card--material"
        >
          <v-card-title class="align-center flex-column mb-3">
            <div class="d-flex justify-center">
              <v-img
                :src="
                  require('@/assets/Logos/Logo_UDO.png')"
                width="90"
              />
            </div>
            <div class="text-h3 font-weight-black text-center primary--text px-7 pt-3 v-card--material__title">
              RECUPERAR CONTRASEÑA
            </div>
          </v-card-title>
          <v-window v-model="stepsReset">
            <v-window-item :value="1">
              <v-card-text :class="{'pa-0':$vuetify.breakpoint.xsOnly, 'px-8':!$vuetify.breakpoint.xsOnly}">
                <validation-observer ref="SEARCH_FORM">
                  <v-row>
                    <v-col cols="12" class="mb-0 pb-0">
                      <label class="font-weight-medium button black--text text-h6 mb-2">Cédula de Identidad</label>
                      <validation-provider name="Cedula" vid="cedula" rules="required|numeric|max:8|min:6" v-slot="{ errors }">
                        <v-text-field
                          v-model="credentials.cedula"
                          outlined
                          clearable
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin"
                          color="label"
                          class="mt-2"
                        >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-account</v-icon>
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
                        @click="login"
                        :loading="LoadingLogin"
                      >
                        Continuar
                      </v-btn>
                    </v-col>

                  </v-row>
                </validation-observer>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="2">
              <v-card-text :class="{'pa-0':$vuetify.breakpoint.xsOnly, 'px-8':!$vuetify.breakpoint.xsOnly}">
                <validation-observer ref="EMAIL_FORM">
                  <v-row>
                    <v-col cols="12" class="mb-0 pb-0">
                      <label class="font-weight-medium button black--text text-h6 mb-2">Correo Electrónico</label>
                      <validation-provider name="Cedula" vid="cedula" rules="required|email" v-slot="{ errors }">
                        <v-text-field
                          v-model="credentials.email"
                          outlined
                          readonly
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin"
                          :value="credentials.email"
                          color="label"
                          class="mt-2"
                          hide-details
                        >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-email-check</v-icon>
                          </template>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="mb-0 pb-0 text-center">
                      <p class="font-weight-medium">Se enviará un correo electrónico con un <b>código de validación</b> a la direccion registrada en nuestro sistema. Si ya tiene el código dar click en Omitir Envío</p>
                    </v-col>

                  </v-row>
                  <v-row>
                    <v-col cols="12" class="d-flex justify-center mt-5">
                    <v-btn
                        color="secondary"
                        depressed
                        class="px-12 mx-2"
                        @click="send_reset(false)"
                        :loading="LoadingLogin"
                      >
                        Enviar Correo
                        <v-icon size="20" class="ml-2">mdi-email-send-outline</v-icon>
                      </v-btn>
                    <v-btn
                        color="primary"
                        depressed
                        class="px-12 mx-2"
                        @click="omitirStep"
                        :disabled="LoadingLogin"
                      >
                        Omitir envío
                        <v-icon size="20" class="ml-2">mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-col>

                  </v-row>
                </validation-observer>
              </v-card-text>
            </v-window-item>
            <v-window-item :value="3">
              <v-card-text :class="{'pa-0':$vuetify.breakpoint.xsOnly, 'px-8':!$vuetify.breakpoint.xsOnly}">
                <v-row v-if="!hasToken">
                  <v-col cols="12" class="mb-0 pb-0">
                    <v-alert
                      text
                      prominent
                      type="success"
                      icon="mdi-email-check-outline"
                    >
                     <h4>Correo Enviado</h4>
                     Se ha enviado el código de validacion a {{credentials.email}}. Por favor revise su correo electrónico
                    </v-alert>
                  </v-col>
                </v-row>
                <validation-observer ref="RESET_FORM">
                  <v-row>
                    <v-col cols="12" class="mb-0 pb-0">
                      <label class="font-weight-medium button black--text text-h6 mb-2">Código de Validación</label>
                      <validation-provider name="Código" vid="token" rules="required|max:6|min:6" v-slot="{ errors }">
                        <v-text-field
                          v-model="reset.token"
                          outlined
                          clearable
                          :error-messages="errors[0]"
                          :disabled="LoadingLogin"
                          color="label"
                          class="mt-2"
                          hint="Ingrese el código de 6 caracteres enviado"
                          persistent-hint
                        >
                          <template slot="prepend-inner">
                            <v-icon color="label">mdi-file-edit</v-icon>
                          </template>
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" class="mb-0 py-0">
                      <validation-provider name="Contraseña" vid="password" rules="required" v-slot="{ errors }">
                        <label for="" class="font-weight-medium button black--text text-h6">Contraseña</label>
                        <v-text-field
                          v-model="reset.password"
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
                    <v-col cols="12" class="mb-0 py-0">
                      <validation-provider name="Confirmar Contraseña" vid="confirm_password" rules="required|confirmed:password" v-slot="{ errors }">
                        <label for="" class="font-weight-medium button black--text text-h6">Confirmar Contraseña</label>
                        <v-text-field
                          v-model="reset.confirm_password"
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
                    <v-col cols="12" class="d-flex justify-center mt-5">
                      <v-btn
                        color="secondary"
                        depressed
                        class="px-12 mx-2"
                        :loading="LoadingLogin"
                        @click="password_reset"
                      >
                        Establecer Contraseña
                      </v-btn>
                      <v-btn
                      v-if="!hasToken"
                        color="primary"
                        depressed
                        class="px-12 mx-2"
                        @click="send_reset(true)"
                        :loading="LoadingLogin"
                      >
                        Reenviar Correo
                        <v-icon size="20" class="ml-2">mdi-email-send-outline</v-icon>
                      </v-btn>
                    </v-col>

                  </v-row>
                </validation-observer>
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-flex justify-center align-center pt-0">
        <v-btn
          link
          text
          small
          :ripple="false"
          color="secondary"
          class="text-capitalize"
          :to="{name: 'Login'}"
        >
          REGRESAR
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { searchUser, sendReset, resendReset, resetPassword } from '@/services/registro'
export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        cedula: '',
        email: '',
        id: '',
      },
      reset: {
        password: '',
        confirm_password: '',
        token: '',
      },
      ShowPassword: false,
      LoadingLogin: false,
      error:{
        active: true,
        message: '',
      },
      stepsReset:1,
      workerExists: false,
      hasToken: false
    }
  },
  methods:{
    omitirStep(){
      this.stepsReset = 3;
      this.hasToken = true;
    },
    async login () {
      const valid = await this.$refs.SEARCH_FORM.validate();
      if(valid) {
        this.LoadingLogin = true;
        try {
          const { email = null, id = null } = await searchUser({cedula: this.credentials.cedula})
          this.workerExists = true;
          this.credentials.email = email ? email.toLowerCase() : '';
          this.credentials.id = id;
          this.stepsReset++;
        } catch (e) {
          if(e.response)
            this.$root.$showAlert(e.response?.data?.errors?.message ?? 'Lo sentimos, hubo un error al intentar conectar con el Servidor.', 'error');
        } finally {
          this.LoadingLogin = false;
        }
      }
		},
    async send_reset (resend  = false) {
      const valid = await this.$refs.EMAIL_FORM.validate();
      if(valid) {
        this.LoadingLogin = true;
        try {
          const response = resend ? await resendReset({email: this.credentials.email}) : await sendReset({email: this.credentials.email})
          if(!resend)
            this.stepsReset++;
          else {
            this.$root.$showAlert('Correo reenviado exitosamente', 'success');
          }

        } catch (e) {
          if(e.response)
            this.$root.$showAlert(e.response?.data?.errors?.message ?? 'Lo sentimos, hubo un error al intentar conectar con el Servidor.', 'error');
        } finally {
          this.LoadingLogin = false;
        }
      }
		},
    async password_reset () {
      const valid = await this.$refs.RESET_FORM.validate();
      if(valid) {
        this.LoadingLogin = true;
        try {
          const data = await resetPassword({
            datos: {
              ...this.reset,
              cedula: this.credentials.cedula,
            }
          })
          this.$root.$showAlert('Contraseña actualizada exitosamente', 'success');
          this.$router.push({name: 'Login'})
        } catch (e) {
          if(e.response)
            this.$root.$showAlert(e.response?.data?.errors?.message ?? 'Lo sentimos, hubo un error al intentar conectar con el Servidor.', 'error');
        } finally {
          this.LoadingLogin = false;
        }
      }
		},
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
