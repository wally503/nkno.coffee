// src/api/tagsApi.js
import api from './axiosInstance'

export async function getTags(method) {
  const { data } = await api.get('brew/tags/', { params: method ? { method } : {} })
  return Array.isArray(data) ? data : data.results ?? []
}