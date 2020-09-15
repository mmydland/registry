import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { dtmi2path, getDependencies } from './repo-convention.js'

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
        const model = JSON.parse(fs.readFileSync(path.join(modelFolder, fileName), 'utf-8'))
        if (model['@id'] !== d) {
          console.log(`ERROR: LowerCase issue with dependent id ${d}. Was ${model['@id']}. Aborting`)
          process.exit()
        }
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
