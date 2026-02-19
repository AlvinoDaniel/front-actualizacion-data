import api from '../util/request.js'

export const getAllPersonal = async ({admin}) => {
  try {
    const { data } = await api.get(`personal`, {params: {admin}})
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const getAllPersonalLagging = async ({nucleo}) => {
  try {
    const { data } = await api.get(`personal/all-lagging`, {params: {nucleo}})
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

export const updateAuthUser = async ({datos}) => {
  try {
    const { data } = await api.post('user/actualizar', datos)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const downloadListPersonal= async ({ admin }) => {
  try {
    const { data } = await api.get(`personal/donwload/list?admin=${admin}`, { responseType: 'blob'})
    return data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const downloadPersonal = async ({ nucleo , download = null, page = 1, perPage = 10 }) => {
  let PARAMS_URL = new URLSearchParams()

  if(nucleo !== null)
      PARAMS_URL.append('nucleo', nucleo)
  if(download !== null)
      PARAMS_URL.append('download', download)
  else{
    PARAMS_URL.append('page', page)
    PARAMS_URL.append('perPage', perPage)
  }


  const URL_API = `personal/donwload-by-nucleo/list?${PARAMS_URL.toString()}`
  try {
    const { data } = await api.get(URL_API, { responseType: download ? 'blob' : 'application/json' })
    return data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const exportReportPersonal = async ({nucleo}) => {

  const URL_API = `personal/export/list?nucleo=${nucleo}`
  try {
    const { data } = await api.get(URL_API, { responseType: 'blob' })
    return data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const getPersonalByUnid = async ({admin, ejec, nucleo}) => {
  try {
    const { data } = await api.get(`personal/all-by-unidad`, {params: {admin, ejec, nucleo}})
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const getUnidsWithoutLeadership = async () => {
  try {
    const { data } = await api.get(`personal/unids-without-leadership`)
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}
