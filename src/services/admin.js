import api from '../util/request.js'

export const getPermissions = async (table) => {
  try {
    const { data } = await api.get('auth/all-permissions')
    return data?.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const registerPermissions = async ({info}) => {
  try {
    const { data } = await api.post('auth/register-permissions', info)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
