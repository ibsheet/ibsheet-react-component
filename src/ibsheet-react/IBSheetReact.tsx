import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import type { IBSheetOptions } from './IBSheetReact.Interface';

interface IBSheetReactProps {
  options: IBSheetOptions;
  data?: any[];
  sync?: boolean;
  style?: React.CSSProperties;
  onSheetInstance?: (sheet: any) => void;
}

// 유틸: 랜덤 ID 생성기
const generateId = (len: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: len }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
};

const IBSheetReact = forwardRef<any, IBSheetReactProps>((props, ref) => {
  const {
    options,
    data = [],
    sync = false,
    style = { width: '100%', height: '800px' },
    onSheetInstance,
  } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerId] = useState(() => 'ibsheet-container-' + generateId(10));
  const [sheetId] = useState(() => 'sheet_' + generateId(10));

  const sheetObjRef = useRef<any>(null);
  const retryIntervalRef = useRef<any>(null);

  // 외부에서 sheet 인스턴스 접근 가능하도록 ref 노출
  useImperativeHandle(ref, () => ({
    getSheetInstance: () => sheetObjRef.current,
  }));

  useEffect(() => {
    if (!options) {
      console.error ('[IBSheetAngular] required input value "options" not set');
      throw new Error ('[IBSheetAngular] "options" is a required input; you must provide an IBSheet setting object');
    }

    // 컨테이너 생성
    const containerDiv = document.createElement('div');
    containerDiv.id = containerId;
    containerDiv.className = 'ibsheet-container';

    Object.assign(containerDiv.style, style);

    if (containerRef.current) {
      containerRef.current.appendChild(containerDiv);
    }

    // IBSheet 로딩 및 초기화
    let retryCount = 0;
    const maxRetries = 50;
    const intervalTime = 100;

    retryIntervalRef.current = setInterval(() => {
      const IBSheet = (window as any).IBSheet;
      if (IBSheet && IBSheet.version) {
        clearInterval(retryIntervalRef.current);

        try {
          const sheet = IBSheet.create({
            id: sheetId,
            el: containerDiv,
            options,
            data,
            sync,
          });

          sheetObjRef.current = sheet;

          if (onSheetInstance) {
            onSheetInstance(sheet);
          }
        } catch (err) {
          console.error('Error initializing IBSheet:', err);
        }
      } else {
        retryCount++;
        if (retryCount >= maxRetries) {
          clearInterval(retryIntervalRef.current);
          console.error ('[initializeIBSheet] IBSheet Initialization Failed: Maximum Retry Exceeded');
        }
      }
    }, intervalTime);

    // 언마운트 시 정리
    return () => {
      clearInterval(retryIntervalRef.current);
      if (sheetObjRef.current && sheetObjRef.current.dispose) {
        try {
          sheetObjRef.current.dispose();
        } catch (err) {
          console.warn('Error disposing IBSheet instance:', err);
        }
      }
    };
  }, [options, data, sync, style, onSheetInstance, containerId, sheetId]);

  return <div ref={containerRef} />;
});

// export default IBSheetReact;
export { IBSheetReact };
