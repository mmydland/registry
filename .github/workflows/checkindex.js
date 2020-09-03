const fs = require('fs')

/**
 * @description "removes the dtmi prefix and the version, and replaces : with -"
 * @param {string} dtmi
 * @returns {string}
 */
const dtmi2folder = (dtmi) => {
  const parts = dtmi.toLowerCase().split(';')[0].split(':')
  parts.shift()
  return parts.join('-')
}

const main = () => {
  const index = JSON.parse(fs.readFileSync('model-index.json', 'utf-8'))
  Object.keys(index).forEach(id=>{
    const path = index[id].path
    const folder = dtmi2folder(id)
    if (!fs.existsSync(path)) {
      console.error(`ERROR: dtmi ${id} not found in ${path}`) 
      process.exit(-1)
    }
    const deps = index[id].depends || []
    
    deps.forEach(d => {
      if (!index[d]) {
        console.error(`ERROR: dtmi ${id} depends on ${d} but was not found in index`)
        process.exit(-1)
      }
    })
  })
  console.log('Model Index validated successfully.')
}
main()