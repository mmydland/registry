(async () => {
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
