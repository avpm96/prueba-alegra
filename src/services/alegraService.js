import axios from 'axios'

const ALEGRA_API_BASE_URL = 'https://api.alegra.com/api/v1'

const ALEGRA_API_SELLERS = `${ALEGRA_API_BASE_URL}/sellers`
const ALEGRA_API_INVOICES = `${ALEGRA_API_BASE_URL}/invoices`
const ALEGRA_API_ITEMS = `${ALEGRA_API_BASE_URL}/items/2`
const client_id = '1'
const USER_EMAIL = 'andrea.perezm993@gmail.com'
const API_TOKEN = 'df3016a678b75167215d'

export const getSellers = async () => {
  try {
    const authString = `${USER_EMAIL}:${API_TOKEN}`
    const response = await axios.get(ALEGRA_API_SELLERS, {
      headers: {
        Authorization: `Basic ${btoa(authString)}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error obteniendo vendedores:', error)
    return []
  }
}

export const getItems = async () => {
  try {
    const authString = `${USER_EMAIL}:${API_TOKEN}`
    const response = await axios.get(ALEGRA_API_ITEMS, {
      headers: {
        Authorization: `Basic ${btoa(authString)}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error obteniendo vendedores:', error)
    return []
  }
}

export const createInvoice = async ({ seller_id, items }) => {
  try {
    const authString = `${USER_EMAIL}:${API_TOKEN}`
    const response = await axios.post(
      ALEGRA_API_INVOICES,
      {
        client: { id: 1 },
        dueDate: '2020-04-05',
        date: '2020-04-02',
        seller: seller_id,
        items,
      },
      {
        headers: {
          Authorization: `Basic ${btoa(authString)}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error obteniendo vendedores:', error)
    return []
  }
}

export const getDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0')

  const formattedDate = `${year}-${month}-${day}`
  return formattedDate
}
