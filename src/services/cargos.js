import api from '../util/request.js'

export const getList = async () => {
  try {
    const { data } = await api.get('cargo-personal')
    const { cargos_personal } = data.data
    let maxCode = 0
    if (cargos_personal && cargos_personal.length > 0) {
      const codes = cargos_personal
        .map(cargo => parseInt(cargo.codigo, 10))
        .filter(code => !isNaN(code))
      if (codes.length > 0) {
        maxCode = Math.max(...codes)
      }
    }
    return { cargos_personal: cargos_personal || [], maxCode }
  } catch (error) {
    return Promise.reject(error)
  }
}

export const saveCargo = async ({ info, action, id }) => {
  const url = action === 'crear'
    ? 'cargo-personal/store'
    : `cargo-personal/update/${id}`;

  try {
    const { data } = await api.post(url, info)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteCargo = async ({ id }) => {
  try {
    const { data } = await api.delete(`cargo-personal/delete/${id}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
