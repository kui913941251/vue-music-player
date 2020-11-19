import axios from "axios"

export function request(config) {
  const instance = axios.create({
    withCredentials: true
  })
  return instance(config)
}