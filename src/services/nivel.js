import api from '../util/request.js'

export const getLevels = async () => {
  try {
    const { data } = await api.get(`nivel`)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const saveLevel = async ({info, action, id}) => {
  const url = action === 'crear'
    ? 'nivel'
    : `nivel/${id}`;

  try {
    const { data } = await api.post(url, info)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteLevel = async ({ id }) => {
  try {
    const { data } = await api.delete(`nivel/${id}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
