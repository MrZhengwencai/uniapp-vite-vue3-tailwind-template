let apis = {}

const files = import.meta.globEager('./*.js')
Object.keys(files).forEach((key) => {
  apis = { ...apis, ...files[key] }
})
export default apis
