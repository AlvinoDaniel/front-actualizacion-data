<template>
  <div>
    <v-row justify="center" class="mt-3">
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
            <div class="text-h2 font-weight-black text-center primary--text px-7 pb-7 pt-3 v-card--material__title">
              SISTEMA DE ACTUALIZACIÓN
              <div class="text-subtitle-1 text-center mb-n4 font-weight-medium">
                Funcionarios Activos
              </div>
            </div>
          </v-card-title>
          <v-card-text :class="{'pa-0':$vuetify.breakpoint.xsOnly, 'px-8':!$vuetify.breakpoint.xsOnly}">
            <validation-observer ref="LOGIN_FORM">
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
                <v-col cols="12" class="mb-0 py-0">
                  <validation-provider name="Contraseña" vid="password" rules="required|min:4" v-slot="{ errors }">
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
                      :disabled="LoadingLogin"
                      @keyup.enter="login"
                      hide-details="auto"
                      class="mt-2"
                    >
                      <template slot="prepend-inner">
                        <v-icon color="label">mdi-lock</v-icon>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" class="d-flex justify-end pb-0 pt-1">
                  <v-btn
                    link
                    text
                    small
                    :ripple="false"
                    :to="{name: 'Recuperar'}"
                    color="black"
                    class="font-weight-bold"
                  >
                    Olvide mi Contraseña
                  </v-btn>
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
                    Acceder
                    <v-icon right>
                      mdi-arrow-right
                    </v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" class="d-flex justify-center align-center pt-0">
                  <span class="text-subtitle-1 label--text mx-2">¿No tienes cuenta registrada?</span>
                  <v-btn
                    link
                    text
                    small
                    :ripple="false"
                    color="secondary"
                    class="text-capitalize"
                    :to="{name: 'Registrar'}"
                  >
                    Registrar Aquí
                  </v-btn>
                </v-col>
              </v-row>
            </validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

      <material-snackbar
        v-model="error.active"
        type="error"
      >
        {{ error.message }}
      </material-snackbar>

  </div>
</template>
<script>
export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        cedula: '',
        password: '',
      },
      ShowPassword: false,
      LoadingLogin: false,
      error:{
        active: false,
        message: '',
      },
    }
  },
  methods:{
    async login () {
      const valid = await this.$refs.LOGIN_FORM.validate();
      if(valid) {
        this.LoadingLogin = true;
        this.$store.dispatch('user/login',this.credentials).then(response => {
          this.$router.push({ path: '/'});
          this.LoadingLogin = false;
        }).catch(e => {
          this.error = {
            active: true,
            message: e.response ? e.response?.data?.errors?.message : 'Lo sentimos, hubo un error al intentar conectar con el Servidor.'
          };
          this.LoadingLogin = false;
        });
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
    height: calc(100vh - 84px)
</style>
