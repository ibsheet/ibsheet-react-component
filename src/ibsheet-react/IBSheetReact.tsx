import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  type MutableRefObject,
} from 'react'
import type {
  IBSheetCreateOptions,
  IBSheetInstance,
  IBSheetOptions,
} from '@ibsheet/interface'

interface IBSheetReactProps {
  options: IBSheetOptions
  data?: any[]
  sync?: boolean
  style?: React.CSSProperties
  instance?: (sheet: IBSheetInstance) => void
  exgSheet?: IBSheetInstance
}

interface IBSheetInstanceWithId extends IBSheetInstance {
  id: string
}

// 유틸: 랜덤 ID 생성기
const generateId = (len: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: len }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('')
}

const IBSheetReact = forwardRef<IBSheetInstance | null, IBSheetReactProps>(
  (props, ref) => {
    const {
      options,
      data = [],
      sync = false,
      style = { width: '100%', height: '800px' },
      instance,
      exgSheet,
    } = props

    const [containerId] = useState(() => 'ibsheet-container-' + generateId(10))
    const [sheetId] = useState(() => 'sheet_' + generateId(10))

    const containerRef = useRef<HTMLDivElement | null>(null)
    const sheetObjRef = useRef<IBSheetInstance | null>(null)
    const retryIntervalIdRef = useRef<ReturnType<typeof setInterval> | null>(
      null
    )

    useEffect(() => {
      const containerEl = containerRef.current

      if (!options) {
        console.error('[IBSheetReact] required input "options" not provided')
        throw new Error('[IBSheetReact] "options" is required')
      }

      if (!containerEl) {
        console.error('[IBSheetReact] containerRef.current is null')
        return
      }
      if (sheetObjRef.current) {
        // 이미 인스턴스 존재하면 재생성 금지
        return
      }

      containerEl.id = containerId
      containerEl.className = 'ibsheet-container'

      Object.assign(containerEl.style, style)

      if (exgSheet) {
        const sheet = exgSheet as IBSheetInstanceWithId
        const sheetEl = document.getElementById(sheet.id)

        if (sheetEl && sheetEl.parentElement !== containerEl) {
          try {
            sheetEl.parentElement?.removeChild(sheetEl)
          } catch (err) {
            console.warn(
              '[IBSheetReact] Failed to remove old sheet element:',
              err
            )
          }
          containerEl.appendChild(sheetEl)
        }

        sheetObjRef.current = sheet

        if (ref) {
          if (typeof ref === 'function') ref(sheet)
          else (ref as MutableRefObject<IBSheetInstance | null>).current = sheet
        }
        if (instance) instance(sheet)

        return () => {
          // 재사용 시에는 컴포넌트가 dispose 하지 않음
          sheetObjRef.current = null
        }
      }

      // IBSheet 로딩 및 초기화
      let retryCount = 0
      const maxRetries = 50
      const intervalTime = 100

      retryIntervalIdRef.current = setInterval(() => {
        const IBSheet = (window as any).IBSheet
        const IBSheetLoader = (window as any).IBSheetLoader
        // IBSheetLoader 사용 시, loader가 로드 완료된 후에 IBSheet 객체가 생성되도록 조건 추가
        if (IBSheetLoader && IBSheetLoader.version) {
          const loaderState = IBSheetLoader['_status']
          if (loaderState == 0 && IBSheet && IBSheet.version) {
            if (retryIntervalIdRef.current) {
              clearInterval(retryIntervalIdRef.current)
              retryIntervalIdRef.current = null
            }
            try {
              const opt: IBSheetCreateOptions = {
                id: sheetId,
                el: containerEl,
                options,
                data,
                sync,
              }

              const sheet = IBSheet.create(opt)
              sheetObjRef.current = sheet

              if (ref) {
                if (typeof ref === 'function') ref(sheet)
                else
                  (ref as MutableRefObject<IBSheetInstance | null>).current =
                    sheet
              }

              if (instance) instance(sheet)
            } catch (err) {
              console.error(
                'Error initializing IBSheet:',
                (err as Error).message || err
              )
            }
          }

          retryCount++
          if (retryCount >= maxRetries) {
            if (retryIntervalIdRef.current) {
              clearInterval(retryIntervalIdRef.current)
              retryIntervalIdRef.current = null
            }
            console.error(
              '[IBSheetReact] IBSheet Initialization Failed: Maximum Retry Exceeded'
            )
          }
        } else if (IBSheet && IBSheet.version) {
          if (retryIntervalIdRef.current) {
            clearInterval(retryIntervalIdRef.current)
            retryIntervalIdRef.current = null
          }
          try {
            const opt: IBSheetCreateOptions = {
              id: sheetId,
              el: containerEl,
              options,
              data,
              sync,
            }

            const sheet = IBSheet.create(opt)
            sheetObjRef.current = sheet

            if (ref) {
              if (typeof ref === 'function') ref(sheet)
              else
                (ref as MutableRefObject<IBSheetInstance | null>).current =
                  sheet
            }

            if (instance) instance(sheet)
          } catch (err) {
            console.error(
              'Error initializing IBSheet:',
              (err as Error).message || err
            )
          }
        } else {
          retryCount++
          if (retryCount >= maxRetries) {
            if (retryIntervalIdRef.current) {
              clearInterval(retryIntervalIdRef.current)
              retryIntervalIdRef.current = null
            }
            console.error(
              '[IBSheetReact] IBSheet Initialization Failed: Maximum Retry Exceeded'
            )
          }
        }
      }, intervalTime)

      return () => {
        if (retryIntervalIdRef.current) {
          clearInterval(retryIntervalIdRef.current)
          retryIntervalIdRef.current = null
        }
        if (sheetObjRef.current?.dispose) {
          try {
            sheetObjRef.current.dispose()
          } catch (err) {
            console.warn('Error disposing IBSheet instance:', err)
          }
        }
        sheetObjRef.current = null
        if (ref) {
          if (typeof ref === 'function') ref(null)
          else (ref as MutableRefObject<IBSheetInstance | null>).current = null
        }
        containerEl.innerHTML = '' // 필요 시 초기화
      }
    }, [])

    return <div ref={containerRef} />
  }
)

export { IBSheetReact }
