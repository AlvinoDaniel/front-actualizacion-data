<template>
  <div>
    <v-dialog
      v-model="alert"
      persistent
      max-width="490"
    >
      <v-card>
        <v-card-title class="d-flex flex-column justify-center align-center">
          <v-avatar size="125" class="avatar-outlined pa-6 my-8">
            <v-icon color="warning" size="60">mdi-shield-alert-outline</v-icon>
          </v-avatar>
          <h2 class="primary--text font-weight-bold">COMPLETAR ACTUALIZACION</h2>
        </v-card-title>
        <v-card-text class="d-flex justify-center">
          <p class="text-h4 text-center">
            Debe actualizar todos los datos requeridos para acceder a este módulo.
          </p>
        </v-card-text>
        <v-card-actions class="d-flex justify-center pt-0 pb-5">
          <v-btn
            color="info"
            tile
            despress
            class="px-2"
            @click="close"
          >
            aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { get } from 'vuex-pathify'
export default {
  name: 'DefaultAlert',

  computed: {
    alert: get('app/alert'),
  },

  methods:{
    close () {
      this.$store.dispatch('app/setAlert', false);
    },
  }


}
</script>
