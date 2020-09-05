(async () => {
  /**
   * @typedef {{ path: string, depends: Array<string>}} indexItem
   * @typedef { Object.<string, indexItem>} modelIndex
   */

  /**
   * @type {modelIndex}
   */
  let index

  /**
 * @param {string} id - element id
 * @returns {HTMLElement}
 */
  const gbid = (id) => {
    const el = document.getElementById(id)
    if (el === null) {
      throw new Error('element not found: ' + id)
    }
    return el
  }

  /**
   *
   * @param {string} path
   * @return {Promise<modelIndex>}
   */
  const loadIndex = (path) => new Promise((resolve, reject) => {
    window.fetch(path)
      .then(r => r.json())
      .then(m => resolve(m))
      .catch(e => reject(e))
  })

  /**
   *
   * @param {string} template
   * @param {Array<indexItem>} models
   * @param {string} target
   */
  const bindTemplate = (template, models, target) => {
    gbid(target).innerHTML = Mustache.render(gbid(template).innerHTML, models)
  }

  const init = async () => {
    const path = 'model-index.json'
    index = await loadIndex(path)
    const modelArray = Object.keys(index).map(k => {
      return {
        dtmi: k,
        path: index[k].path,
        depends: index[k].depends
      }
    })
    modelArray.sort(function (a, b) { return (a.dtmi > b.dtmi) ? 1 : -1 })

    bindTemplate('models-list-template', modelArray, 'rendered')
  }
  await init()
})()
