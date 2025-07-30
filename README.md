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

```bash
yarn install ibsheet-react
```

## Usage

### Basic Usage

```jsx
import React from 'react';
import { IBSheetReact, type IBSheetOptions } from 'ibsheet-react';

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
      />
    </div>
  );
}

export default App;
```

### Advanced Usage with IBSheetInstance

```jsx
import React from 'react';
import { IBSheetReact, IB_Preset, type IBSheetInstance, type IBSheetOptions } from 'ibsheet-react';

function App() {
  let sheetRef: IBSheetInstance;

  const options: IBSheetOptions = {
    // Your IBSheet configuration options
    Cfg: { 
      SearchMode: 0, 
      HeaderMerge: 1
    },
    Cols: [
      {"Header": "문자열(Text)","Type": "Text","Name": "TextData","Width": 100,"Align": "Center","CanEdit": 1},
      {"Header": "줄넘김문자열(Lines)","Type": "Lines","Name": "LinesData","MinWidth": 250,"Align": "Center","CanEdit": 1,"RelWidth": 1},
      {"Header": "콤보(Enum)","Type": "Enum","Name": "ComboData","Width": 100,"Align": "Right","Enum": "|대기|진행중|완료","EnumKeys": "|01|02|03"},
      { Header: "Ymd", Name: "sDate_Ymd", Extend: IB_Preset.YMD, Width: 110 },
      { Header: "Ym",  Name: "sDate_Ym",  Extend: IB_Preset.YM,  Width: 90 },
      { Header: "Md",  Name: "sDate_Md",  Extend: IB_Preset.MD,  Width: 90 }  
    ]
  }

  const data = [
    // Your data
  ];

  const handleSheetInstance = (sheet: IBSheetInstance) => {
    console.log('Sheet instance created:', sheet);
    // You can store the sheet instance or perform initial operations
    sheetRef = sheet;
  };

  const addRow = () => {
    if (sheetRef) {
      sheetRef.addRow();
    }
  };

  const getData = () => {
    if (sheetRef) {
      const data = sheetRef.getDataRows();
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
        <button onClick={getData}>Get Data</button>
      </div>
      
      <IBSheetReact
        options={options}
        data={data}
        sync={true}
        onSheetInstance={handleSheetInstance}
        style={customStyle}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `IBSheetOptions` | ✅ | - | IBSheet configuration options |
| `data` | `any[]` | ❌ | `[]` | Initial data for the spreadsheet |
| `sync` | `boolean` | ❌ | `false` | Enable data synchronization |
| `style` | `React.CSSProperties` | ❌ | `{ width: '100%', height: '800px' }` | Container styling |
| `onSheetInstance` | `(sheet: any) => void` | ❌ | - | Callback when sheet instance is created |

## TypeScript Support

The component includes TypeScript definitions. Make sure to define your `IBSheetOptions` interface:

```typescript
interface IBSheetOptions {
  Cfg?: IBSheetProperties;
  Def?: object;
  Cols?: IBCol[];
  LeftCols?: IBCol[];
  RightCols?: IBCol[];
  Head?: any[];
  Foot?: any[];
  Solid?: any[];
  Filter?: any[];
  Events?: IBSheetEvents;
}
```

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

### Performance issues

- Consider using `sync: false` for large datasets
- Implement data pagination for very large datasets
- Use React.memo() to prevent unnecessary re-renders

## License

Please refer to your IBSheet license for usage terms and conditions.