import axios from 'axios'
import { Safari, StrapiResponse, StrapiSingleResponse, Destination, ExperienceType, Highlight } from '../types/safari'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const API_TOKEN = process.env.STRAPI_API_TOKEN

// Configurar axios
const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
})

// Interceptor para logs en desarrollo
if (process.env.NODE_ENV === 'development') {
  strapiApi.interceptors.request.use((config) => {
    console.log(`🌐 Strapi API: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  })

  strapiApi.interceptors.response.use(
    (response) => {
      console.log(`✅ Strapi API: ${response.status} ${response.config.url}`)
      return response
    },
    (error) => {
      console.error(`❌ Strapi API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data)
      return Promise.reject(error)
    }
  )
}

// Servicios para Safaris
export const safariService = {
  // Obtener todos los safaris en un idioma específico
  async getAll(locale: string = 'es'): Promise<Safari[]> {
    try {
      const response = await strapiApi.get<StrapiResponse<Safari>>(`/safaris?locale=${locale}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching safaris:', error)
      return []
    }
  },

  // Obtener un safari específico por código
  async getByCode(code: string, locale: string = 'es'): Promise<Safari | null> {
    try {
      const response = await strapiApi.get<StrapiResponse<Safari>>(`/safaris?filters[code][$eq]=${code}&locale=${locale}`)
      return response.data.data[0] || null
    } catch (error) {
      console.error(`Error fetching safari with code ${code}:`, error)
      return null
    }
  },

  // Obtener un safari específico por ID
  async getById(id: string, locale: string = 'es'): Promise<Safari | null> {
    try {
      const response = await strapiApi.get<StrapiSingleResponse<Safari>>(`/safaris/${id}?locale=${locale}`)
      return response.data.data
    } catch (error) {
      console.error(`Error fetching safari with id ${id}:`, error)
      return null
    }
  },

  // Buscar safaris por criterios
  async search(params: {
    locale?: string
    location?: string
    difficulty?: string
    minPrice?: number
    maxPrice?: number
    minDuration?: number
    maxDuration?: number
  }): Promise<Safari[]> {
    try {
      const queryParams = new URLSearchParams()
      
      queryParams.append('locale', params.locale || 'es')
      
      if (params.location) {
        queryParams.append('filters[location][$eq]', params.location)
      }
      
      if (params.difficulty) {
        queryParams.append('filters[difficulty][$eq]', params.difficulty)
      }
      
      if (params.minPrice) {
        queryParams.append('filters[priceFrom][$gte]', params.minPrice.toString())
      }
      
      if (params.maxPrice) {
        queryParams.append('filters[priceFrom][$lte]', params.maxPrice.toString())
      }
      
      if (params.minDuration) {
        queryParams.append('filters[durationDays][$gte]', params.minDuration.toString())
      }
      
      if (params.maxDuration) {
        queryParams.append('filters[durationDays][$lte]', params.maxDuration.toString())
      }

      const response = await strapiApi.get<StrapiResponse<Safari>>(`/safaris?${queryParams.toString()}`)
      return response.data.data
    } catch (error) {
      console.error('Error searching safaris:', error)
      return []
    }
  }
}

// Servicios para otros content types
export const destinationService = {
  async getAll(locale: string = 'es'): Promise<Destination[]> {
    try {
      const response = await strapiApi.get<StrapiResponse<Destination>>(`/destinations?locale=${locale}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching destinations:', error)
      return []
    }
  }
}

export const experienceTypeService = {
  async getAll(locale: string = 'es'): Promise<ExperienceType[]> {
    try {
      const response = await strapiApi.get<StrapiResponse<ExperienceType>>(`/experience-types?locale=${locale}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching experience types:', error)
      return []
    }
  }
}

export const highlightService = {
  async getAll(locale: string = 'es'): Promise<Highlight[]> {
    try {
      const response = await strapiApi.get<StrapiResponse<Highlight>>(`/highlights?locale=${locale}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching highlights:', error)
      return []
    }
  }
}

// Función de utilidad para verificar la conexión con Strapi
export const testConnection = async (): Promise<boolean> => {
  try {
    await strapiApi.get('/safaris?pagination[limit]=1')
    return true
  } catch (error) {
    console.error('Strapi connection test failed:', error)
    return false
  }
}
