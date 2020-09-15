import superagent from 'superagent'
import { dtmi2path, getDependencies } from './repo-convention.js'

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
