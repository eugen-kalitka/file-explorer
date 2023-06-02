export const serializeMessage = (type, data) => (JSON.stringify({
  type,
  data
}))
