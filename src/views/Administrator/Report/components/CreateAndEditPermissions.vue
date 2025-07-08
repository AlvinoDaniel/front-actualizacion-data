<template>
  <v-dialog
    v-model="show"
    persistent
    :max-width=" $vuetify.breakpoint.xsOnly ? '100%': '25%'"
    scrollable
    content-class="content-scroll"
  >
    <v-card tile>
      <v-card-title class="ma-0 d-flex justify-space-between secondary white--text">
        <span
          class="font-weight-bold"
          :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly,}"
        >
          Gestión de Permisos
        </span>
        <v-btn icon plain @click="cerrar()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-overlay
        :value="loadingAction || loading"
        color="white"
        absolute
        opacity=".8"
      >
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
      </v-overlay>
      <!-- <v-card-text class="px-0">
      </v-card-text> -->
      <v-list
      subheader
      two-line
      flat
    >
      <v-subheader>Seleccione los permisos para la Jefatura del Departamento</v-subheader>
      <v-list-item-group
        v-model="list"
        multiple
      >
      <template v-for="item in permissions">
        <v-list-item :key="'item-'+item.id">
          <template v-slot:default="{ active, }">
            <v-list-item-action>
              <v-checkbox
                v-model="permissions_selected"
                :input-value="active"
                color="primary"
                :value="item.name"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title class="text-uppercase">{{ item.name | convertName }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
         <v-divider
            :key="item.id"
          ></v-divider>
      </template>
      </v-list-item-group>
    </v-list>
      <v-card-actions class="d-flex justify-space-between mb-3">
        <v-btn
          tile
          depressed
          color="blue-grey lighten-5"
          class="px-8 mx-2"
          :small="$vuetify.breakpoint.mobile"
          @click="cerrar()"
        >
          Cancelar
        </v-btn>
        <div>
          <v-btn
            tile
            depressed
            color="primary"
            class="px-8"
            :small="$vuetify.breakpoint.mobile"
            @click="savePermissions"
            >
            Guardar
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { getPermissions, registerPermissions } from '@/services/admin'
import { get } from 'vuex-pathify'

export default {
  name:'ModalPersonal',
  props:{
    value: Boolean,
    jefe:{
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      show: this.value,
      loadingAction: false,
      loading: false,
      permissions_selected: [],
      list: [],
      permissions: [],
    }
  },
  watch: {
    show (val, oldVal) {
      if (val === oldVal) return

      this.$emit('input', val)
    },
    value (val, oldVal) {
      if (val === oldVal) return

      this.show = val
    },
  },
  computed:{},
  filters:{
    convertName(value){
      return value ? value.split('-').join(' ') : ''
    }
  },
  created () {
    this.getPermissions()
  },
  methods: {
    cerrar() {
      this.show = false;
      this.permissions_selected = []
      this.$emit('close', true);
    },
    async getPermissions () {
      this.loading = true
      this.permissions = []
      try {
        const { permissions = [] } = await getPermissions()
        this.permissions = permissions;
        this.permissions_selected = this.jefe?.permissions
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async savePermissions() {
      const valid = this.jefe?.permissions.length === 0 ? this.permissions_selected.length > 0 : true;
      if(!valid){
        this.$root.$showAlert('Debe seleccionar al menos un permiso para continuar', 'error');
        return;
      }
      const data = {
        permissions: this.permissions_selected,
        jefe: this.jefe.id
      }

      try {
        this.loadingAction = true;
        const { message } = await registerPermissions({ info: data })
        this.$emit('reload', true);
        this.cerrar();
        this.$root.$showAlert(message, 'success');
      } catch (error) {
          const { response = null } = error
          console.log({response})
          // if(response?.status === 422){
          //   this.$refs.DEPARTAMENT_FORM.setErrors(response?.data?.errors);
          //   return;
          // }
          this.$root.$showAlert(
            'Lo sentimos, hubo un error al intentar realizar esta acción en el Servidor.',
            'error'
          );
      } finally {
        this.loadingAction = false;
      }
    },
  },
}
</script>
