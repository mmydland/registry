const superagent = require('superagent')
/**
 * @description "Converts DTMI to folder/file convention"
 * @param {string} dtmi
 * @returns {(string,string)}
 */
const dtmi2path = (dtmi) => {
  const idAndVersion = dtmi.toLowerCase().split(';')
  const ids = idAndVersion[0].split(':')
  const fileName = `${ids[ids.length - 1]}-${idAndVersion[1]}.json`
  ids.pop()
  const modelFolder = ids.join('/')
  return { modelFolder, fileName }
}

/**
 * @param {{ extends: any[]; contents: any[]; }} rootJson
 * @returns {Array<string>}
 */
const getDependencies = (rootJson) => {
  const deps = []
  if (rootJson.extends) {
    if (Array.isArray(rootJson.extends)) {
      rootJson.extends.forEach(e => deps.push(e))
    } else {
      deps.push(rootJson.extends)
    }
  }
  if (rootJson.contents) {
    const comps = rootJson.contents.filter(c => c['@type'] === 'Component')
    comps.forEach(c => {
      if (typeof c.schema !== 'object') {
        if (deps.indexOf(c.schema) === -1) {
          deps.push(c.schema)
        }
      }
    })
  }
  return deps
}

const repo = 'https://iotmodels.github.io/registry'
const dtmi = 'dtmi:my:device:model;3'
const { modelFolder, fileName } = dtmi2path(dtmi)
const url = `${repo}/${modelFolder}/${fileName}`
console.log(url)

superagent.get(url)
  .then(d => {
    const deps = getDependencies(d.body)
    deps.forEach(d => {
      const { modelFolder, fileName } = dtmi2path(d)
      const url = `${repo}/${modelFolder}/${fileName}`
      console.log(url)
    })
  })
  .catch(e => console.error(e))
