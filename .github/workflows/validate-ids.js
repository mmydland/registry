import fs from 'fs'
import { argv } from 'process'
import { checkIds } from '../../repo-convention.js'

for (let i = 2; i < argv.length; i++) {
  const file = argv[i]
  if (file.indexOf('dtmi')>=0){
    console.log('\nchecking: ' + file)
    if (fs.existsSync(file)) {
      checkIds(JSON.parse(fs.readFileSync(file, 'utf-8')))
    } else {
      console.error('File not found: ' + file)
    }
  }
}
