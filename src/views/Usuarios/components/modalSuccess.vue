<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="490"
    >
      <v-card>
        <v-card-title class="d-flex flex-column justify-center align-center">
          <v-avatar size="125" class="avatar-outlined pa-12 my-8">
            <v-icon color="icono" size="60">mdi-checkbox-marked-circle-outline</v-icon>
          </v-avatar>
          <h2 class="primary--text font-weight-bold" v-text="title" />
        </v-card-title>
        <v-card-text class="d-flex justify-center">
          <p class="text-h4" v-text="message" />
        </v-card-text>
        <v-card-actions class="d-flex justify-center pt-0 pb-5">
          <v-btn
            color="red"
            tile
            class="px-4"
            dark
            despress
            @click="goBack"
          >
            Salir
          </v-btn>
          <v-btn
            color="info"
            tile
            despress
            class="px-2"
            @click="confirm"
          >
            Si, Registrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    name: 'ModalSuccess',
    props: {
      title: String,
      message: String,
      value: Boolean,
    },
    data() {
      return {
        dialog: this.value,
      }
    },
    watch: {
      dialog (val, oldVal) {
        if (val === oldVal) return

        this.$emit('input', val)
      },
      value (val, oldVal) {
        if (val === oldVal) return

        this.dialog = val
      },
    },
    methods:{
      goBack () {
        this.dialog = false
        this.$router.go(-1)
      },
      confirm () {
        this.dialog = false
        this.$emit('confirm')
      }
    }
  }
</script>
<style>
.avatar-outlined {
  border-color: #607d8b !important;
  border-style: solid;
  border-width: 1px;
}
</style>
