# ibsheet-react

A React wrapper component for IBSheet, providing a seamless integration of IBSheet spreadsheet functionality into React applications.

## Features

- 🔧 Easy integration with IBSheet library
- ⚡ Automatic initialization and cleanup
- 🎯 TypeScript support
- 🔄 Data synchronization support
- 📝 Imperative API access through refs
- 🎨 Customizable styling

## Installation

Make sure you have IBSheet library loaded in your project before using this component.

Using npm:

```bash
npm install @ibsheet/react
```

Using yarn:

```bash
yarn add @ibsheet/react
```

## Usage

### Basic Usage

```jsx
import { IBSheetReact, type IBSheetInstance, type IBSheetOptions } from '@ibsheet/react';

function App() {
  const options: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3
    },
    Cols: [
      { Header: "ID", Type: "Text", Name: "sId" },
      { Header: "Name", Type: "Text", Name: "name" },
      { Header: "Age", Type: "Int", Name: "age" }
    ]
  };

  const data = [
    { sId: "1", name: "John Doe", age: 30 },
    { sId: "2", name: "Jane Smith", age: 25 }
  ];

  return (
    <div>
      <IBSheetReact
        options={options}
        data={data}
      />
    </div>
  );
}

export default App;
```

Example: https://stackblitz.com/edit/vitejs-vite-ejncmlbw

### Advanced Usage with Event Handling

```jsx
import { useRef } from 'react';
import { 
  IBSheetReact, 
  IB_Preset, 
  type IBSheetInstance, 
  type IBSheetOptions, 
  type IBSheetEvents 
} from '@ibsheet/react';

const handleAfterChange: IBSheetEvents['onAfterChange'] = (param) => { 
  // The type of the parameter is automatically inferred.
  console.log('Data changed value:', param.val); 
};

function App() {
  const sheetRef = useRef<IBSheetInstance | null>(null);

  const options: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3
    },
    Cols: [
      { Header: "ID", Type: "Text", Name: "sId" },
      { Header: "Name", Type: "Text", Name: "name" },
      { Header: "Age", Type: "Int", Name: "age" },
      { Header: "Ymd", Name: "sDate_Ymd", Extend: IB_Preset.YMD, Width: 110 }
    ],
    Events: {
      onAfterChange: handleAfterChange
    }
  }

  const data = [
    // Your data
    { sId: '1', name: 'John Doe', age: 30, sDate_Ymd:'20250923' },
    { sId: '2', name: 'Jane Smith', age: 25, sDate_Ymd:'20251002' }
  ];

  const handleAddRow = () => {
    if (sheetRef && sheetRef.current) {
      sheetRef.current.addRow();
    }
  };

  const handleExportExcel = () => {
    if (sheetRef && sheetRef.current) {
      // exportData method requires the jsZip library
      // When checking for the jsZip library, if it hasn't been loaded separately, the file at ./plugins/jszip.min.js (relative to ibsheet.js) will be loaded automatically.
      sheetRef.current.exportData({fileName:'ibsheet_react_export_example.xlsx'})
    }
  };

  const customStyle = {
    width: '100%',
    height: '600px',
    border: '1px solid #ccc'
  };

  return (
    <div>
      <div>
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleExportExcel}>Export Excel</button>
      </div>

      <IBSheetReact
        options={options}
        data={data}
        style={customStyle}
        ref={sheetRef}
      />
    </div>
  );
}
```

Example: https://stackblitz.com/edit/vitejs-vite-bsfserm2

## Props

| Prop       | Type                               | Required | Default                              | Description                             |
| ---------- | ---------------------------------- | -------- | ------------------------------------ | --------------------------------------- |
| `options`  | `IBSheetOptions`                   | ✅       | -                                    | IBSheet configuration options           |
| `data`     | `any[]`                            | ❌       | `[]`                                 | Initial data for the spreadsheet        |
| `sync`     | `boolean`                          | ❌       | `false`                              | Enable data synchronization             |
| `style`    | `React.CSSProperties`              | ❌       | `{ width: '100%', height: '800px' }` | Container styling                       |
| `instance` | `(sheet: IBSheetInstance) => void` | ❌       | -                                    | Callback when sheet instance is created |
| `exgSheet` | `IBSheetInstance`                  | ❌       | -                                    | Existing IBSheet instance to reuse      |

## Advanced Usage

### Reusing Existing IBSheet Instance

```typescript
const App: React.FC = () => {
  existingSheet?: IBSheetInstance;

  useEffect(() => {
    // Reuse IBSheet instances created elsewhere
    this.existingSheet = someExistingSheetInstance;
  }, []);
});

<IBSheetReact
  options={options}
  exgSheet={existingSheet}

```

## TypeScript Support

The component includes TypeScript definitions. Make sure to define your `IBSheetOptions` interface:

```typescript
interface IBSheetOptions {
  Cfg?: IBSheetProperties
  Def?: object
  Cols?: IBCol[]
  LeftCols?: IBCol[]
  RightCols?: IBCol[]
  Head?: any[]
  Foot?: any[]
  Solid?: any[]
  Filter?: any[]
  Events?: IBSheetEvents
}
```

IBSheet interface: https://www.npmjs.com/package/@ibsheet/interface

## Component Behavior

### Lifecycle Management
IBSheetReact creates IBSheet instances **only on mount** and does not recreate them when props change:

- ✅ Component mount: IBSheet instance created
- ❌ Props change: No recreation (performance optimization)
- ✅ Component unmount: Instance cleanup and disposal

This design prioritizes performance since IBSheet is a heavy library that should avoid unnecessary recreations.

### Props Change Handling

Since the component uses an empty dependency array in `useEffect([])`, prop changes do not trigger IBSheet recreation. This behavior requires specific handling patterns:

## Error Handling

The component includes built-in error handling:

- Validates that `options` prop is provided
- Retries IBSheet initialization up to 50 times (5 seconds total)
- Safely disposes of IBSheet instances on unmount
- Logs errors to console for debugging

### Default Styling

The component applies default dimensions of 100% width and 800px height.

## Important Notes

1. **IBSheet Library**: Ensure the IBSheet library is loaded before this component mounts. The component will retry initialization for up to 5 seconds.
2. **Props Reactivity**: The component does NOT react to prop changes after initial mount. Use instance methods or force remount with `key` prop for dynamic updates.
3. **Container ID**: Each instance generates a unique container ID to avoid conflicts when using multiple sheets.
4. **Memory Management**: The component automatically cleans up IBSheet instances when unmounting to prevent memory leaks, except when using `exgSheet` prop.
5. **Error Logging**: Check the browser console for initialization errors or warnings.
6. **Performance Optimization**: The component prioritizes performance by avoiding unnecessary recreations, which means manual handling is required for dynamic scenarios.

## Troubleshooting

### IBSheet not initializing

- Ensure IBSheet library is loaded before the component mounts
- Check browser console for error messages
- Verify that `options` prop contains valid IBSheet configuration

### IBSheet library not found

```
[initializeIBSheet] IBSheet Initialization Failed: Maximum Retry Exceeded
```

### Performance issues

- Consider using `sync: false` for large datasets
- Implement data pagination for very large datasets
- Use React.memo() to prevent unnecessary re-renders

**Solutions:**

- Confirm IBSheet script is loaded in your `index.html`
- Check network requests to ensure IBSheet files are accessible
- Verify IBSheet version compatibility

## Load the IBSheet Library

Using Including External Script

ex) in index.html

```html
<link rel="stylesheet" href="ibsheet_path/css/default/main.css" />

<script src="ibsheet_path/ibsheet.js"></script>
<script src="ibsheet_path/locale/ko.js"></script>
<script src="ibsheet_path/plugins/ibsheet-common.js"></script>
<script src="ibsheet_path/plugins/ibsheet-dialog.js"></script>
<script src="ibsheet_path/plugins/ibsheet-excel.js"></script>
```

Using IBSheetLoader

- reference: https://www.npmjs.com/package/@ibsheet/loader
- manual: https://ibsheet.github.io/loader-manual

## Local Setup of the IBSheet Library

- Install the IBSheet library in the project's `root/public` directory or a subdirectory within `root/public`
- If you are using the "Including External Script" method, set the path to the IBSheet library in `ibsheet_path`
- If you are using the "IBSheetLoader" method, set the path to the IBSheet library in `baseUrl`

## IBSheet Manual

https://docs.ibsheet.com/ibsheet/v8/manual/#docs/intro/1introduce

## Sample

- https://github.com/ibsheet/ibsheet-react-sample.git
- https://github.com/ibsheet/loader-react-guide-samples.git

## License

[MIT](./LICENSE)
