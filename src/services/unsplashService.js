import axios from 'axios'

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos'
const UNSPLASH_ACCESS_KEY = '8Y5tbe6ivAzYyYTIn-uzxiNrPDQBwdtKAh79LAKMwLw'

export const searchImages = async (query) => {
  try {
    const response = await axios.get(UNSPLASH_API_URL, {
      params: { query, client_id: UNSPLASH_ACCESS_KEY, per_page: 4 }, // Agregamos el parámetro per_page
    })
    return response.data.results
  } catch (error) {
    console.error('Error buscando imágenes:', error)
    return []
  }
}
