<template>
  <v-container
    id="password"
    fluid
    tag="section"
    class="pa-1 d-flex"
  >
    <v-row class="mt-2" justify="center">
      <v-col cols="11" sm="10" md="10" class="d-flex align-end justify-space-between">
        <span class="text-h2 font-weight-bold">Manual de Usuario</span>
        <v-btn
          link
          text
          small
          :ripple="false"
          :to="{name: 'Login'}"
          color="black"
          class="font-weight-bold"
        >
          <v-icon class="mr-2">mdi-arrow-left</v-icon>
          Regresar
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        sm="10"
        md="10"
      >
      <iframe title="PDF" width="100%" style="height: 100vh;" :src="`/pdfjs-4.10.38-dist/web/viewer.html?file=${documentUrl}&zoom=150&sidebar=1&navpanes=1&toolbar=1`"></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>


  export default {
    name:'UserGuide',
    data: () => ({
      documentUrl: '/Manual/Manual_de_Usuario.pdf'
    }),
  }
</script>
