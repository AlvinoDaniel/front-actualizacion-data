<template>
  <v-container
    id="recibidos-bandeja"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="loading" />
    <v-row class="ma-0 py-4 justify-space-between">
      <v-col cols="12" class="pt-1 d-flex flex-column">
        <div>
          <v-btn text @click="goBack()" color="primary" class="px-1">
            <v-icon class="mr-2">mdi-arrow-left</v-icon> Regresar al Listado
          </v-btn>
        </div>
        <div class="ml-2 mt-2">
          <h3 class="text-uppercase">{{ nombreUnidad }}</h3>
          <small>Jefe de Unidad: <strong> {{ nombreJefe }} </strong> </small>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-data-table
          sort-by="codigo_unidad_ejec"
          class="inbox"
          no-data-text="No hay Personal Registrado"
          :headers="headers"
          :items="data"
          :loading="loading"
          :sort-desc="true"
          >
          <template v-slot:item.nombres_apellidos="{ item }">
          <span
            v-if="item.nombres_apellidos"
            class="font-weight-bold"
              v-text="item.nombres_apellidos"
          />
          </template>
          <template v-slot:item.cedula_identidad="{ item }">
          <span
            v-if="item.cedula_identidad"
            class=""
          >
            {{ item.cedula_identidad | FormatCurrency }}
          </span>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>


export default {
  name: 'PersonalUnidad',
  props:{
    value: Boolean,
    data:{
      type: Array,
      default: () => ([]),
    },
    jefe:{
      type: Object,
      default: () => ({}),
    },
    unidad:{
      type: Object,
      default: () => ({}),
    },
    loading:{
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      headers: [
        { text: 'Cédula Identidad', value: 'cedula_identidad', class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Nombres y Apellidos', value: 'nombres_apellidos',  class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Tipo Personal', value: 'tipo_personal_descripcion',  class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Cargo', value: 'cargo_opsu',  class: 'blue-grey lighten-5 blue-grey--text'},
        { text: 'Nùcleo', value: 'nucleo_nombre',  class: 'blue-grey lighten-5 blue-grey--text'},
      ],
    }
  },
  computed: {
    nombreJefe(){
      return this.jefe !== null ? this.jefe?.nombres_apellidos : ''
    },
    nombreUnidad(){
      return this.unidad !== null ? this.unidad?.descripcion_unidad_admin : ''
    }
  },
  methods: {
    goBack(){
      this.$emit('back', true);
    }
  },
}
</script>

