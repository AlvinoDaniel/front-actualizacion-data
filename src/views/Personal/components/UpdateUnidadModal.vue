<template>
  <v-dialog v-model="show" max-width="40%" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Actualizar Unidad Administrativa</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <p><strong>Personal:</strong> {{ personal.nombres_apellidos || 'N/A' }}</p>
              <p><strong>Cédula:</strong> {{ personal.cedula_identidad || 'N/A' }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="selectedUnidad"
                :items="unidades"
                item-text="descripcion"
                item-value="id"
                label="Seleccionar Unidad Administrativa"
                outlined
                :rules="[v => !!v || 'Unidad es requerida']"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal">
          Cancelar
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="updateUnidad"
          :loading="loading"
          :disabled="!selectedUnidad"
        >
          Actualizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { actualizarUnidadesPersonal } from '@/services/usuario'

export default {
  name: 'UpdateUnidadModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    personal: {
      type: Object,
      default: () => ({})
    },
    selected: {
      type: Object,
      default: () => ({})
    },
    unidades: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    selectedUnidad: null,
    loading: false
  }),
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    value (newVal) {
      if (newVal) {
        this.selectedUnidad = this.personal.id_unidad_admin || null
      }
    },
    selected (newVal) {
      if (Object.values(newVal).length > 0) {
        this.selectedUnidad = newVal?.entidad?.id || null
      } else {
        this.selectedUnidad = null
      }
    }
  },
  methods: {
    closeModal() {
      this.show = false
      this.selectedUnidad = null
    },
    async updateUnidad() {
      console.log('Actualizando unidad administrativa con ID:', this.selected)
      if (!this.selectedUnidad) return
      this.loading = true
      try {
        await actualizarUnidadesPersonal({
          personalUndId: this.selected?.id,
          unidad: this.selectedUnidad
        })
        this.$emit('updated')
        this.closeModal()
        this.$toast.success('Unidad administrativa actualizada exitosamente')
      } catch (error) {
        this.$toast.error('Error al actualizar la unidad administrativa')
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
