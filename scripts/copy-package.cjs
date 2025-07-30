const fs = require('fs');
const path = require('path');

const basePackage = require('../package.json')

// 필요한 필드만 추출
const distPackage = {
  name: basePackage.name.replace('-component', ''),
  version: basePackage.version,
  license: basePackage.license,
  keywords: [
    "react",
    "ibsheet",
    "grid",
    "component"
  ],
  repository: {
    "type": "git",
    "url": "https://github.com/ibsheet/ibsheet-react-component.git"
  },
  bugs: {
    "url": "https://github.com/ibsheet/ibsheet-react-component/issues"
  },
  homepage: "https://www.ibsheet.com/",
  main: './ibsheet-react.cjs.js',
  module: './ibsheet-react.es.js',
  types: './index.d.ts',
  exports: {
    ".": {
      "import": "./ibsheet-react.es.js",
      "require": "./ibsheet-react.cjs.js",
      "types": "./index.d.ts"
    }
  }
}

fs.writeFileSync(
  path.resolve(__dirname, '../dist/ibsheet-react/package.json'),
  JSON.stringify(distPackage, null, 2)
)