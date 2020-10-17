"use strict"

function csvParser(stringBuffer, title) {
  try {
    const columnTitle = stringBuffer.split("\r\n").slice(0, 1).map(el => { return el.split(",") })[0]
    let columnContent = stringBuffer.split("\r\n").slice(1).map(el => { return el.split(",") })
    if (columnContent[columnContent.length - 1][0] === "") columnContent = columnContent.slice(0, columnContent.length - 1)
    const json = columnContent.map(el => {
      let content = {}
      let i = 0
      while (i < columnTitle.length) {
        content[columnTitle[i].toLowerCase()] = el[i]
        i++
      }
      return content
    })
    return json
  } catch (error) {
    throw new Error(`Invalid ${title} CSV file`)
  }
}

function csvParserWithQuotes(stringBuffer, title) {
  try {
    const columnTitle = stringBuffer.split("\r\n").slice(0, 1).map(el => { return el.split(",") })[0]
    let columnContent = stringBuffer.split("\r\n").slice(1).map(el => { return el.split(',"') }).map(el => { return el.map(e => { return e.split(",") }) })
    if (columnContent[columnContent.length - 1][0][0] === "") columnContent = columnContent.slice(0, columnContent.length - 1)
    const json = columnContent.map(el => {
      let content = {}
      let i = 0
      while (i < columnTitle.length - 1) {
        content[columnTitle[i].toLowerCase()] = el[0][i]
        i++
      }
      content[columnTitle[columnTitle.length - 1].toLowerCase()] = el[1].map(e => { return e.replace('\"', '') })
      return content
    })
    return json
  } catch (error) {
    throw new Error(`Invalid ${title} CSV file`)
  }

}

module.exports = { csvParser, csvParserWithQuotes }