const path = require('path');
const getLessVars = require('../index')
const source = path.resolve(__dirname, './theme.less');

const result = JSON.stringify({
  "@color-brand": "#2196F3",
  "@header-width": "100px",
  "@font-size": "14px",
  "@card-width": "100px",
  "@width": "100px"
})
const stripedResult = JSON.stringify({
  "color-brand": "#2196F3",
  "header-width": "100px",
  "font-size": "14px",
  "card-width": "100px",
  "width": "100px"
})
const camelcasedResult = JSON.stringify({
  "@colorBrand": "#2196F3",
  "@headerWidth": "100px",
  "@fontSize": "14px",
  "@cardWidth": "100px",
  "@width": "100px"
})

const option1 = {
  stripPrefix: true,
}

const option2 = {
  camelCase: true,
}

it('base test', () => getLessVars(source).then(res => expect(JSON.stringify(res)).toBe(result)))
it('strip variable prefix test', () => getLessVars(source, option1).then(res => expect(JSON.stringify(res)).toBe(stripedResult)))
it('camelcase result key test', () => getLessVars(source, option2).then(res => expect(JSON.stringify(res)).toBe(camelcasedResult)))
