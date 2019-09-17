const g = require('got')
const _ = require('underscore')
const fs = require('fs')
const log = console.log

let api = {
  $srl: 'https://addons-ecs.forgesvc.net/api/v2/addon',

  search(index, done) {
    let qs = `${api.$srl}/search?gameId=1&index=${index}&pageSize=255&searchFilter=&sort=3`

    // log('searching', qs)
    g.get(qs)
      .then(res => {
        // log(res.body)
        done(res ? JSON.parse(res.body) : null)
      })
      .catch(err => {
        done()
      })
  }
}

let data = []
let index = 0

let fetch = () => {
  log('fetching page', index / 255)
  api.search(index, res => {
    log('ack')
    if (!res) {
      log('error xx')
    } else {
      res = res.map(x => {
        let d = {
          id: x.id,
          key: x.slug,
          dir: [],
          source: 'curse'
        }

        x.latestFiles.forEach(l => {
          d.dir = _.union(d.dir, l.modules.map(m => m.foldername))
        })

        return d
      })

      data = data.concat(res)

      if (res.length < 255) {
        data = JSON.stringify(data, null, 2)
        fs.writeFileSync('db-curse.json', data, 'utf-8')
        log(
          'wrote',
          data.length,
          'records',
          `(${(data.length / 1024).toFixed(0)} KB)`
        )
        return
      }

      index += 255
      fetch()
    }
  })
}

fetch()
