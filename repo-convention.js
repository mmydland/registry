export /**
 * @description Converts DTMI to dtmi/com/example/device-1.json path
 * @param {string} dtmi
 * @returns {(string,string)}
 */
const dtmi2path = dtmi => {
  const idAndVersion = dtmi.toLowerCase().split(';')
  const ids = idAndVersion[0].split(':')
  const fileName = `${ids.pop()}-${idAndVersion[1]}.json`
  const modelFolder = ids.join('/')
  return { modelFolder, fileName }
}

export /**
 * @description Returns external IDs in extend and component schemas
 * @param {{ extends: any[]; contents: any[]; }} rootJson
 * @returns {Array<string>}
 */
const getDependencies = rootJson => {
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
