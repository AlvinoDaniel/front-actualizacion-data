import api from '../util/request.js'

export const getCatalogue = async (table) => {
  try {
    const { data } = await api.post('catalogue', table)
    return data?.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}
