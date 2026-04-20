import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const detail = err?.response?.data?.detail
    if (detail) {
      err.message = typeof detail === 'string' ? detail : JSON.stringify(detail)
    }
    return Promise.reject(err)
  },
)
