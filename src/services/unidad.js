import api from '../util/request.js'

export const getUnidadList = async ({type=''}) => {
  try {
    const { data } = await api.get(`unidad/${type}`)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const saveUnidad = async ({info, action, id, type = ''}) => {
  const url = action === 'crear'
    ? `unidad/${type}/store`
    : `unidad/${type}/update/${id}`;

  try {
    const { data } = await api.post(url, info)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteUnidad = async ({ id, type = '' }) => {
  try {
    const { data } = await api.delete(`unidad/${type}/${id}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
