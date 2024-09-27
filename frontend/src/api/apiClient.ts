import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Базовый URL для всех запросов
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient
