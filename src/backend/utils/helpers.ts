export const serializeMessage = (type, data, error = null) => (JSON.stringify({
  type,
  data,
  error
}))
