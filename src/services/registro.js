import api from '../util/request.js'

export const saveAccount = async ({ datos }) => {
  try {
    const { data } = await api.post('auth/register', datos)
    return data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const searchPersonal = async ({cedula}) => {
  try {
    const { data } = await api.post(`search-worker`, {cedula})
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}
