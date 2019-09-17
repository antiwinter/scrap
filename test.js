import ava from 'ava'
import fs from 'fs'
import curse from './wowa/curse'

const log = console.log

let ccc = 1
function nme(x) {
  return ccc++ + '-' + x
}

ava.serial.cb(nme('update'), t => {
  curse.fetch(data => {
    data = JSON.stringify(data, null, 2)
    fs.writeFileSync('wowa/db-curse.json', data, 'utf-8')
    log(
      'wrote',
      data.length,
      'records',
      `(${(data.length / 1024).toFixed(0)} KB)`
    )
    t.end()
  })
})

ava.serial.cb(nme('check'), t => {
  let data = JSON.parse(fs.readFileSync('wowa/db-curse.json', 'utf-8'))
  log(data.length)
  t.end()
})
