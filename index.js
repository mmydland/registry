import { dtmi2path } from './dtmi2path.js'

(async () => {
  const gbid = (id) => {
    const el = document.getElementById(id)
    if (el === null) {
      throw new Error('element not found: ' + id)
    }
    return el
  }

  const loadModel = path => {
    return new Promise((resolve, reject) => {
      window.fetch(path)
        .then(r => r.json())
        .then(m => resolve(m))
        .catch(e => reject(e))
    })
  }

  const init = () => {
    const button = gbid('search')
    button.onclick = async () => {
      const query = gbid('q')
      const results = gbid('results')
      const { modelFolder, fileName } = dtmi2path(query.value)
      try {
        const json = await loadModel(`${modelFolder}/${fileName}`)
        results.innerHTML = `${json['@id']} found in <a href=${modelFolder}/${fileName}>${modelFolder}/${fileName}</a>`
      } catch (e) {
        console.log(e)
        results.innerText = `Not Found at ${modelFolder}/${fileName}`
      }
    }
  }
  init()
})()
