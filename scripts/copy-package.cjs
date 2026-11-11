const fs = require('fs');
const path = require('path');

const basePackage = require('../package.json')

// 필요한 필드만 추출
const distPackage = {
  name: "@ibsheet/react",
  description: "React data grid component: the official wrapper for the IBsheet 8 JavaScript data grid",
  version: basePackage.version,
  license: basePackage.license,
  author: "IB Leaders <support@ibleaders.co.kr>",
  keywords: [
    "react",
    "ibsheet",
    "grid",
    "component",
    "ibsheet8",
    "react-component",
    "data-grid",
    "datagrid",
    "table",
    "spreadsheet",
    "excel",
    "typescript",
    "react-grid",
    "react-data-grid",
    "react-datagrid"
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
  },
  peerDependencies: {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  dependencies: {
    "@ibsheet/interface": "latest"
  }
}

fs.writeFileSync(
  path.resolve(__dirname, '../dist/ibsheet-react/package.json'),
  JSON.stringify(distPackage, null, 2)
)