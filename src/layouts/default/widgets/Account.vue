<template>
  <v-menu
    bottom
    left
    min-width="200"
    offset-y
    origin="top right"
    transition="scale-transition"
    rounded="b-xl"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        min-width="0"
        depressed
        plain
        :ripple="false"
        :small="$vuetify.breakpoint.mobile"
        :class="{'pr-0': true, 'btn-navbar': true }"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon size="32" color="secondary">mdi-account-circle-outline</v-icon>
        <template v-if="$vuetify.breakpoint.smAndUp">
          <div class="d-flex flex-column justify-center align-start mx-2">
            <span
              class="font-weight-bold"
              v-text="basic.personal.nombres_apellidos"
            />
          </div>
          <v-icon size="18">mdi-chevron-down</v-icon>
        </template>
      </v-btn>
    </template>

    <v-list class="py-0" color="secondary">
      <v-list-item class="py-2">
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold white--text" v-text="basic.personal.cargo_jefe" />
        </v-list-item-content>
      </v-list-item>
      <v-divider />
    </v-list>
    <v-list
      class="py-0"
    >
      <v-list-item-group
        color="primary"
      >
        <v-list-item class="py-2" to="/seguridad/gestion-de-usuario/">
          <v-list-item-icon class="ma-2 align-self-center">
            <v-icon>mdi-shield-account-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Contraseña</v-list-item-title>
        </v-list-item>
        <v-divider/>
        <v-list-item class="py-2" @click="barLogout">
          <v-list-item-icon class="ma-2 align-self-center">
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Salir</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { get, call } from 'vuex-pathify'
  export default {
    name: 'DefaultAccount',
    methods:{
      logout: call('user/logout'),
      barLogout(){
        this.logout().then(() => {
          this.$router.replace({ path: '/auth/login/'});
        });
      }
    },
    computed: {
      basic: get('user/infoBasic'),
    },
  }
</script>
<style>
.btn-navbar .v-btn__content {
  opacity: 1 !important;
}
</style>
