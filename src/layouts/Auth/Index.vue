<template>
  <div>
    <v-app-bar
      app
      absolute
      color="white"
      elevation="1"
    >
    <v-toolbar-title>
      <v-btn
        link
        text
        small
        :ripple="false"
        @click="redirectGuide"
        class="font-weight-bold py-5"
      >
      <v-avatar color="info" size="25" class="mr-2">
        <v-icon dark size="20">
          mdi-account
        </v-icon>
      </v-avatar>
        <span class="font-weight-bold black--text">Guía de Usuario</span>
      </v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-title>
      <v-img
        :src="
          require('@/assets/Logos/Logo_UDO.png')"
        width="50"
      />
    </v-toolbar-title>
    </v-app-bar>
    <v-main class="d-flex justify-center blue-grey lighten-5">
      <v-container
        fluid
        style="min-height: calc(100vh - 84px);"
      >
          <router-view :key="$route.path" />
      </v-container>
    </v-main>
    <alert-global ref="alertAuth" />
  </div>
</template>
<script>
export default {
  name: 'LayoutAuth',
  mounted() {
      this.$root.$showAlert = this.$refs.alertAuth.show;
    },
  methods:{
    redirectGuide(){
      window.open(`${process.env.VUE_APP_URL}Manual/Manual_de_Usuario.pdf`, '_blank');
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
