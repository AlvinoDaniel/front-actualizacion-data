import api from '../util/request.js'

export const getAllPersonal = async () => {
  try {
    const { data } = await api.get(`personal`)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const deletePersonal = async ({ id }) => {
  try {
    const { data } = await api.delete(`personal/${id}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const savePersonal = async ({info, action, id}) => {
  const url = action === 'crear'
    ? 'personal'
    : `personal/${id}`;

  try {
    const { data } = await api.post(url, info)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const searchPersonal = async ({cedula}) => {
  try {
    const { data } = await api.get(`personal/search/${cedula}`)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}
