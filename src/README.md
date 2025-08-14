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
import React, { useRef } from 'react';
import { IBSheetReact, type IBSheetInstance, type IBSheetOptions } from 'ibsheet-react';

const sheetRef = useRef<IBSheetInstance | null>(null);

function App() {
  const options: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3
    },
    Cols: [
      { Header: "ID", Type: "Text", Name: "id" },
      { Header: "Name", Type: "Text", Name: "name" },
      { Header: "Age", Type: "Int", Name: "age" }
    ]
  };

  const data = [
    { id: "1", name: "John Doe", age: 30 },
    { id: "2", name: "Jane Smith", age: 25 }
  ];

  return (
    <div>
      <h1>My Spreadsheet</h1>
      <IBSheetReact
        options={options}
        data={data}
        ref={sheetRef}
      />
    </div>
  );
}

export default App;
```

### Advanced Usage with Event Handling

```jsx
import React, { useRef } from 'react';
import { IBSheetReact, IB_Preset, type IBSheetInstance, type IBSheetOptions, type IBSheetEvents } from 'ibsheet-react';

type OnAfterChangeParam = Parameters<NonNullable<IBSheetEvents['onAfterChange']>>[0];

function App() {
  const sheetRef = useRef<IBSheetInstance | null>(null);
  let sheetInstance: IBSheetInstance;

  const options: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: {
      SearchMode: 2,
      HeaderMerge: 3
    },
    Cols: [
      { Header: "ID", Type: "Text", Name: "id" },
      { Header: "Name", Type: "Text", Name: "name" },
      { Header: "Age", Type: "Int", Name: "age" },
      { Header: "Ymd", Name: "sDate_Ymd", Extend: IB_Preset.YMD, Width: 110 },
      { Header: "Ym",  Name: "sDate_Ym",  Extend: IB_Preset.YM,  Width: 90 },
      { Header: "Md",  Name: "sDate_Md",  Extend: IB_Preset.MD,  Width: 90 }
    ]
  }

  const data = [
    // Your data
  ];

  const getInstance = (sheet: IBSheetInstance) => {
    console.log('Sheet instance created:', sheet);
    // You can store the sheet instance or perform initial operations
    sheetInstance = sheet;

    if (sheet.addEventListener) {
      sheet.addEventListener('onAfterChange', (event: OnAfterChangeParam) => {
        console.log('Data changed value:', event.val);
      });
    }
  };

  const addRow = () => {
    if (sheetRef) {
      sheetRef.current.addRow();
    }
  };

  const getDataRows = () => {
    if (sheetRef) {
      const data = sheetRef.current.getDataRows();
      console.log('Sheet data:', data);
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
        <button onClick={addRow}>Add Row</button>
        <button onClick={getDataRows}>Get Data</button>
      </div>

      <IBSheetReact
        options={options}
        data={data}
        sync={false}
        style={customStyle}
        ref={sheetRef}
        instance={getInstance}
      />
    </div>
  );
}
```

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
2. **Container ID**: Each instance generates a unique container ID to avoid conflicts when using multiple sheets.
3. **Memory Management**: The component automatically cleans up IBSheet instances when unmounting to prevent memory leaks.
4. **Error Logging**: Check the browser console for initialization errors or warnings.

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

## load to IBSheet

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

## IBSheet Manual

https://docs.ibsheet.com/ibsheet/v8/manual/#docs/intro/1introduce

## Sample

https://github.com/ibsheet/ibsheet-react-sample.git

## License

[MIT](./LICENSE)
