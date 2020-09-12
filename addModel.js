const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

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

/**
 * @param {string} file
 */
const addModel = (file) => {
  if (!fs.existsSync(file)) {
    console.error('file not found:' + file)
    process.exit()
  }
  const rootJson = JSON.parse(fs.readFileSync(file, 'utf-8'))

  if (rootJson['@context'] && rootJson['@context'] === 'dtmi:dtdl:context;2') {
    const id = rootJson['@id']

    const deps = getDependencies(rootJson)
    deps.forEach(d => {
      const { modelFolder, fileName } = dtmi2path(d)
      if (fs.existsSync(path.join(modelFolder, fileName))) {
        console.log(`Dependency ${d} found in the index`)
      } else {
        console.error(`ERROR: Dependency ${d} NOT found. Aborting`)
        process.exit()
      }
    })

    const { modelFolder, fileName } = dtmi2path(id)
    if (fs.existsSync(path.join(modelFolder, fileName))) {
      console.log(`ERROR: ID ${id} already exists at ${modelFolder}/${fileName} . Aborting `)
      process.exit()
    }
    mkdirp(modelFolder).then(m => {
      console.log(`folder created ${modelFolder}`)
      fs.copyFileSync(file, path.join(modelFolder, fileName))
      console.log(`Model ${id} added successfully to ${modelFolder}/${fileName}.`)
    })
  } else {
    console.error(`File ${file} is not a valid DTDL 2 interface`)
  }
}

const main = () => {
  const file = process.argv[2]
  console.log(`processing: ${file}`)
  addModel(file)
}
main()
