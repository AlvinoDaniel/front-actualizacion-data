import api from '../util/request.js'

export const getAllUsers = async () => {
  try {
    const { data } = await api.get(`users`)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const getUser = async ({id}) => {
  try {
    const { data } = await api.get(`users/show/${id}`)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const saveUser = async ({ datos }) => {
  try {
    const { data } = await api.post('users', datos)
    return data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const updateUser = async ({ datos, id, personal }) => {
  try {
    const { data } = await api.post(`users/${id}/personal/${personal}`, datos)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const getAllRoles = async () => {
  try {
    const { data } = await api.get(`users/roles`)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const getAllLevels = async () => {
  try {
    const { data } = await api.get(`users/niveles`)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const searchPersonal = async ({cedula}) => {
  try {
    const { data } = await api.get(`personal/search`, {
      params: {
        cedula
      }
    })
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}
