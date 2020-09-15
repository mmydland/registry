import jsonata from 'jsonata'

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

export/**
 * @description Validates all internal IDs follow the namepspace set by the root id
 * @param {any} dtdlJson
 */
const checkIds = dtdlJson => {
  const rootId = dtdlJson['@id']
  console.log(`checkIds: validating root ${rootId}`)
  const ids = jsonata('**."@id"').evaluate(dtdlJson)
  if (Array.isArray(ids)) {
    ids.forEach(id => {
      console.log('found: ' + id)
      if (!id.split(';')[0].startsWith(rootId.split(';')[0])) {
        throw new Error(`ERROR: Document id ${id} does not satisfy the root id ${rootId}`)
      }
    })
    console.log(`checkIds: validated ${ids.length} ids`)
  } else {
    console.log('checkIds: ids not found')
  }
}
