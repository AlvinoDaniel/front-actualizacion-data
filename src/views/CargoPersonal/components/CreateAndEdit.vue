<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="50%"
    scrollable
    content-class="content-scroll"
  >
    <v-card tile>
      <v-card-title class="ma-0 d-flex justify-space-between secondary white--text">
        <span
          class="font-weight-bold"
          :class="{'text-h4': $vuetify.breakpoint.smAndUp, 'text-h5': $vuetify.breakpoint.xsOnly,}"
        >
          Gestión de Cargo Personal
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

      <v-card-text class="pt-4">
        <validation-observer ref="CARGO_FORM" tag="div">
          <v-row>
            <v-col cols="12" md="6" class="pt-2 pb-0">
              <label class="font-weight-medium button black--text text-h6 mb-2">Código</label>
              <validation-provider name="Código" vid="codigo" rules="required|max:19|regex:^[0-9]+$" v-slot="{ errors }">
                <v-text-field
                  v-model="cargoInfo.codigo"
                  outlined
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" md="6" class="pt-2 pb-0">
              <label class="font-weight-medium button black--text text-h6 mb-2">Descripción</label>
              <validation-provider name="Descripción" vid="descripcion" rules="required|max:255" v-slot="{ errors }">
                <v-text-field
                  v-model="cargoInfo.descripcion"
                  outlined
                  :error-messages="errors[0]"
                />
              </validation-provider>
            </v-col>
          </v-row>
        </validation-observer>
      </v-card-text>

      <v-card-actions class="d-flex justify-end mb-3">
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

        <v-btn
          tile
          depressed
          color="primary"
          class="px-8"
          :small="$vuetify.breakpoint.mobile"
          @click="actionGroup"
        >
          {{ action === 'edit' ? 'Actualizar' : 'Crear' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { saveCargo } from '@/services/cargos'

const dataDefault = () => ({
  codigo: null,
  descripcion: null,
})

export default {
  name: 'ModalCargoPersonal',
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: 'crear'
    },
    nextCode: {
      type: String,
      default: '001'
    }
  },
  data () {
    return {
      show: this.value,
      loadingAction: false,
      cargoInfo: dataDefault()
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
    data (val) {
      if (Object.values(val).length > 0) {
        this.cargoInfo = { ...val }
      } else {
        this.cargoInfo = dataDefault()
        this.cargoInfo.codigo = this.nextCode
      }
    }
  },
  methods: {
    cerrar () {
      this.show = false
      this.cargoInfo = dataDefault()
      this.$refs.CARGO_FORM.reset()
      this.$emit('close', true)
    },
    async actionGroup () {
      const valid = await this.$refs.CARGO_FORM.validate()
      if (!valid) return

      try {
        this.loadingAction = true
        const { message } = await saveCargo({
          info: { ...this.cargoInfo },
          action: this.action,
          id: this.cargoInfo?.id ?? null
        })

        this.$emit('procesado', true)
        this.cerrar()
        this.$root.$showAlert(message, 'success')
      } catch (error) {
        const { response = null } = error
        if (response?.status === 422) {
          this.$refs.CARGO_FORM.setErrors(response?.data?.errors)
          return
        }
        this.$root.$showAlert('Lo sentimos, hubo un error al intentar realizar esta acción en el Servidor.', 'error')
      } finally {
        this.loadingAction = false
      }
    }
  }
}
</script>
