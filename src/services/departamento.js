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

export const getAllDepartaments = async () => {
  try {
    const { data } = await api.get(`departamentos`)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getListDepartaments = async () => {
  try {
    const { data } = await api.get(`departamentos/list`)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const saveDepartament = async ({info, action, id}) => {
  const url = action === 'crear'
    ? 'departamentos'
    : `departamentos/${id}`;

  try {
    const { data } = await api.post(url, info)
    return data
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

export const deleteDepartament = async ({ id }) => {
  try {
    const { data } = await api.delete(`departamentos/${id}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
