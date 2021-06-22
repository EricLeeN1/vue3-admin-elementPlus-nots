import { readFileSync, readdirSync } from 'fs'

let idPerfix = ''
const svgTitle = /<svg([^>+].*?)>/
const clearHeightWidth = /(width|height)="([^>+].*?)"/g

const hasViewBox = /(viewBox="[^>+].*?")/g

const clearReturn = /(\r)|(\n)/g

function findSvgFile(dir) {
  const svgRes = []
  const dirents = readdirSync(dir, {
    withFileTypes: true
  })
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      svgRes.push(...findSvgFile(`${dir + dirent.name}/`))
    } else {
      const svg = readFileSync(dir + dirent.name)
        .toString()
        .replace(clearReturn, '')
        .replace(svgTitle, ($1, $2) => {
          let width = 0
          let height = 0
          let content = $2.replace(clearHeightWidth, (s1, s2, s3) => {
            if (s2 === 'width') {
              width = s3
            } else if (s2 === 'height') {
              height = s3
            }
            return ''
          })
          if (!hasViewBox.test($2)) {
            content += `viewBox="0 0 ${width} ${height}"`
          }
          return `<symbol id="${idPerfix}-${dirent.name.replace('.svg', '')}" ${content}>`
        })
        .replace('</svg>', '</symbol>')
      svgRes.push(svg)
    }
  })
  return svgRes
}
const svgLoader = (path, perfix = 'icon') => {
  if (path === '') {
    return false
  }
  idPerfix = perfix
  const res = findSvgFile(path)
  // const res = []
  return {
    name: 'svg-transform',
    transformIndexHtml(html) {
      return html.replace(
        '<body>',
        `
            <body>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
                ${res.join('')}
              </svg>
          `
      )
    }
  }
}

export default svgLoader
