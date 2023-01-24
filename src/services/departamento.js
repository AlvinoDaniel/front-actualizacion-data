import api from '../util/request.js'

export const getDepartamentoList = async ({ nucleo }) => {
  try {
    const { data } = await api.get('nucleo/byDepartamentos', {
      params:{
        nucleo
      }
    })
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getNucleoList = async () => {
  try {
    const { data } = await api.get('nucleo')
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getInfoClient = async ({ id }) => {
  try {
    const { data } = await api.get(`clientes/${id}/potenciales`)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const updateInfoClient = async ({ id, datos }) => {
  try {
    const { data } = await api.put(`clientes/${id}/potenciales`, datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
