<template>
    <v-container
      fluid
      tag="section"
      class="pa-0"
    >
    <v-window v-model="steps_data">
      <v-window-item :value="1">
        <v-row class="ma-0 py-4 justify-space-between">
          <v-col cols="12"  md="5" class="pt-1 d-flex align-center">
            <h3 class="black-text">
              Gestión de Jefes
            </h3>
          </v-col>
          <v-col cols="12" md="4" class="pt-1 d-flex align-center justify-end" style="gap: 8px ">
            <v-select
              v-model="nucleoSelected"
              :items="catalogue.nucleo"
              label="Núcleo"
              :loading="load"
              :disabled="load"
              item-text="nombre"
              item-value="codigo_concatenado"
              dense
              outlined
              hide-details
              prepend-inner-icon="mdi-home-city-outline"
              @change="getPersonal"
            ></v-select>
             <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  depressed
                  small
                  dark
                  color="info"
                  class=""
                  v-bind="attrs"
                  v-on="on"
                  @click="modalShow = true"
                  >
                  <v-icon left>mdi-plus</v-icon>
                  Agregar
                </v-btn>
              </template>
              <span>Agregar</span>
            </v-tooltip> -->
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <!-- sort-by="codigo_unidad_ejec" -->
            <v-data-table
              class="inbox"
              no-data-text="No hay Personal Registrado"
              :headers="headers"
              :items="personal"
              :loading="loading"
              >
              <template v-slot:item.iconos="{ item }">
                <div class="d-flex justify-center align-center ml-3">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="editRow(item)"
                        >
                        <v-icon size="19" class="mx-2" color="blue-grey">mdi-account-edit-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>
                </div>
              </template>
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
          <v-col cols="12" class="">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
     <create-and-edit
      v-model="modalShow"
      :action="isCreate ? 'crear' : 'edit'"
      :data="jefe_selected"
      :departments="departamentos"
      @procesado="getPersonal($event)"
      @close="isCreate = $event"
      />
    </v-container>
  </template>
  <script>

  import { getBossAll } from '@/services/admin'
  import { get } from 'vuex-pathify'
  import moment from 'moment'
  import { getCatalogue } from '@/services/catalogue'

  export default {
    name: 'Boss',
    components: {
       CreateAndEdit: () => import(
        /* webpackChunkName: "modal-create" */
        './CreateAndEdit.vue'
      )
    },
    data: () => ({
      downloading: false,
      loading: false,
      loading_personal: false,
      modalShow: false,
      isCreate: true,
      steps_data: 1,
      itemsByPage: [10, 25, 50, 100],
      headers: [
        { text: 'Unidad Administrativa', value: 'descripcion_unidad_admin', class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Cédula Identidad', value: 'cedula_identidad', width: '20%',  class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Nombre Jefe', value: 'nombres_apellidos', width: '20%',  class: 'blue-grey lighten-5 blue-grey--text' },
        { text: 'Cargo', value: 'cargo_jefe',  class: 'blue-grey lighten-5 blue-grey--text px-1 text-center' },
        { text: 'Acciones', value: 'iconos', align: ' px-0', width: '100px',  class: 'blue-grey lighten-5 blue-grey--text' },
      ],
      personal: [],
      personal_by_unidad: [],
      jefe_data: null,
      jefe_selected: null,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      nucleoSelected: '11',
      catalogue:{
        nucleo: [],
      },
      load: false
    }),
    computed: {
      user: get('user/infoBasic'),
      nucleo: get('route/params@nucleo'),
      departamentos(){
        return this.personal.length > 0
        ? this.personal.map((item) => {
          return {
            codigo_unidad_admin: item?.codigo_unidad_admin,
            id_unidad_admin: item?.id_unidad_admin,
            descripcion_unidad_admin: item?.descripcion_unidad_admin
          }
        })
        : []
      }
    },
    created () {
      this.getData();
      this.getPersonal();
    },
    methods: {
      async getPersonal () {
        this.loading = true
        this.personal = []
        try {
          const data  = await getBossAll({
            nucleo: this.nucleoSelected ?? null,
            page: this.page,
            perPage: this.itemsPerPage
          })
          console.log({data})
          this.personal = data
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
      },
      async getData () {
        this.load = true;
        const catalogues = [
          {name: 'nucleo', value: 'nucleo'},
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
            'Lo siento, hubo un error al intentar obtener el listado de Personal registrado.',
            'error',
          )
        } finally {
          this.load = false
        }
      },
      editRow(row){
        this.jefe_selected = {...row};
        this.modalShow = true;
        this.isCreate = false;
      },
      goBack(){
        this.steps_data = 1;
      }
    },
  }
  </script>
