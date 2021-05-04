import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import equal from 'fast-deep-equal/es6'

type UseSmartStateResponse<T> = [value: T, setter: Dispatch<SetStateAction<T>>]

export const useSmartState = <T,>(initial?: T | (() => T)): UseSmartStateResponse<T> => {
  const [state, setState] = useState<T>(initial as T)

  const smartSetter = useCallback(
    (value?: SetStateAction<T>) => {
      switch (typeof value) {
        case 'function':
          setState(value)
          break
        case 'object':
          if (!equal(value, state)) {
            setState(value)
          }
          break
        default:
          if (state !== value) {
            setState(value as T)
          }
      }
    },
    [state, setState]
  )
  return [state, smartSetter]
}
