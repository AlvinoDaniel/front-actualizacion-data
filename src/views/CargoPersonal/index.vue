<template>
  <v-container
    id="cargoPersonal"
    fluid
    tag="section"
    class="pa-0"
  >
    <loader-app v-if="updating" />
    <v-row class="ma-0 pb-3">
      <v-col cols="12" sm="7" md="5" class="pt-1 d-flex align-center">
        <h3 class="blue-grey--text">
          <v-icon color="blue-grey" left>mdi-briefcase-account-outline</v-icon> Cargos de Personal
        </h3>
      </v-col>
      <v-col cols="12" sm="5" md="7" class="pt-1 d-flex align-center justify-end">
        <search-expand v-model="filterData" placeholder="Buscar cargo" />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              color="blue-grey"
              v-bind="attrs"
              v-on="on"
              @click="openCreate()"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              color="blue-grey"
              v-bind="attrs"
              v-on="on"
              @click="getCargos()"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Actualizar</span>
        </v-tooltip>
        <v-pagination
          class="header-pagination"
          v-model="page"
          :length="pageCount"
          circle
          total-visible="0"
        ></v-pagination>
        <span class="text-pagination" v-text="paginationText" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="py-0">
        <v-data-table
          class="inbox"
          hide-default-footer
          no-data-text="No hay cargos de personal registrados"
          :search="filterData"
          :headers="headers"
          :items="itemsData"
          :loading="loading"
          :sort-desc="true"
          :page.sync="page"
          @page-count="pageCount = $event"
          @pagination="infoPagination = $event"
        >
          <template v-slot:item.iconos="{ item }">
            <div class="d-flex justify-center align-center ml-3">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click.stop="edit(item)"
                  >
                    <v-icon size="19" class="mx-2" color="blue-grey">mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteCargoRow(item)"
                  >
                    <v-icon size="19" class="mx-2" color="blue-grey">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <create-and-edit
      v-model="modalShow"
      :action="isCreate ? 'crear' : 'edit'"
      :data="dataSelect"
      :nextCode="nextCode"
      @procesado="getCargos"
      @close="resetModal"
    />
  </v-container>
</template>

<script>
import { getList, deleteCargo } from '@/services/cargos'

export default {
  name: 'CargoPersonal',
  components: {
    CreateAndEdit: () => import(
      /* webpackChunkName: "modal-cargo-personal" */
      './components/CreateAndEdit.vue'
    ),
  },
  data: () => ({
    loading: false,
    updating: false,
    headers: [
      { text: 'Código', value: 'codigo', width: '150px', class: 'blue-grey lighten-5 blue-grey--text' },
      { text: 'Descripción', value: 'descripcion', align: '', class: 'blue-grey lighten-5 blue-grey--text' },
      { text: '', value: 'iconos', align: ' px-0', width: '100px', class: 'blue-grey lighten-5 blue-grey--text' },
    ],
    cargos: [],
    filterData: '',
    page: 1,
    pageCount: 0,
    infoPagination: {
      pageStart: 0,
      pageStop: 0,
      itemsLength: 0,
    },
    modalShow: false,
    isCreate: true,
    dataSelect: {},
    nextCode: '001',
  }),
  computed: {
    paginationText () {
      return this.infoPagination
        ? `${this.infoPagination.pageStart + 1} - ${this.infoPagination.pageStop} de ${this.infoPagination.itemsLength}`
        : ''
    },
    itemsData() {
      return this.cargos
    }
  },
  created () {
    this.getCargos()
  },
  methods: {
    async getCargos () {
      this.loading = true
      try {
        const { cargos_personal, maxCode } = await getList()
        this.cargos = cargos_personal || []
        this.nextCode = String(maxCode + 1).padStart(3, '0')
      } catch (error) {
        console.error(error)
        this.nextCode = '001'
      } finally {
        this.loading = false
      }
    },
    edit(row) {
      this.dataSelect = row
      this.isCreate = false
      this.modalShow = true
    },
    async deleteCargoRow(row) {
      const result = await this.$root.$confirm(
        '¿Está Seguro?',
        `Desea eliminar el cargo de personal ${row?.descripcion}`
      )

      if (result) {
        this.updating = true
        try {
          const { message } = await deleteCargo({ id: row?.id })
          this.getCargos()
          this.$root.$showAlert(message, 'success')
        } catch (error) {
          console.error(error)
          const { response = null } = error
          if (response?.status === 422) {
            this.$root.$showAlert(response?.data?.errors?.message, 'error')
            return
          }
          this.$root.$showAlert(
            'Lo sentimos, hubo un error al intentar realizar esta acción en el Servidor.',
            'error'
          )
        } finally {
          this.updating = false
        }
      }
    },
    resetModal() {
      this.isCreate = true
    },
    openCreate() {
      this.dataSelect = {}
      this.isCreate = true
      this.modalShow = true
    },
  }
}
</script>

<style>
.at {
  width: 40rem;
  max-width: 40rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis !important;
}
</style>
