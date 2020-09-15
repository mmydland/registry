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
