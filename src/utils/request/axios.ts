import axios, { type AxiosResponse } from 'axios'


const service = axios.create({
  // baseURL: import.meta.env.VITE_APP_API_BASE_URL,
})

service.interceptors.request.use(
  (config) => {
      // config.headers.Authorization = `Bearer fastgpt-vKzZcNb0Yc2RnB0yJvWGxP5y3kIlyPnI`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200){
			return response
		} else {
			throw new Error(response.status.toString())
		}
  },
	(error) => {
    return Promise.reject(error)
  },
)

export default service
