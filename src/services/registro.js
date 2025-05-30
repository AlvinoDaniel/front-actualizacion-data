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

export const searchUser = async ({cedula}) => {
  try {
    const { data } = await api.post(`search-user`, {cedula})
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const sendReset = async ({email}) => {
  try {
    const { data } = await api.post(`send-email-reset`, {email})
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const resendReset = async ({email}) => {
  try {
    const { data } = await api.post(`resend-email-reset`, {email})
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const resetPassword = async ({datos}) => {
  try {
    const { data } = await api.post(`reset-password`, datos)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}
