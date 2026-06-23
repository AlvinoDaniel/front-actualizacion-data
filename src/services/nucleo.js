import api from '../util/request.js'

export const getNucleoList = async () => {
  try {
    const { data } = await api.get('nucleo')
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const saveNucleo = async ({info, action, id}) => {
  const url = action === 'crear'
    ? 'nucleo/store'
    : `nucleo/update/${id}`;

  try {
    const { data } = await api.post(url, info)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteNucleo = async ({ id }) => {
  try {
    const { data } = await api.delete(`nucleo/delete/${id}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
