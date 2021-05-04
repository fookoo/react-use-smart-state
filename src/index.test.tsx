import React, { useCallback, useEffect, useState } from 'react'
import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'

import { useSmartState } from './index'

const ExampleComponent = () => {
  const [value, setValue] = useSmartState<boolean>(false)
  const [updated, setUpdated] = useSmartState<number>(0)

  const setTrue = useCallback(() => setValue(true), [setValue])
  const setFalse = useCallback(() => setValue(false), [setValue])

  useEffect(() => {
    setUpdated((v) => v + 1)
  }, [value])

  return (
    <div>
      <div>value: {value.toString()}</div>
      <div>
        updated: <span data-testid="count">{updated}</span>
      </div>
      <div onClick={setTrue}>true</div>
      <div onClick={setFalse}>false</div>
    </div>
  )
}

const ExampleComponentUseState = () => {
  const [value, setValue] = useState({ value: false })
  const [updated, setUpdated] = useSmartState<number>(0)

  const setTrue = useCallback(() => setValue({ value: true }), [setValue])
  const setFalse = useCallback(() => setValue({ value: false }), [setValue])

  useEffect(() => {
    setUpdated((v) => v + 1)
  }, [value])

  return (
    <div>
      <div>value: {value.toString()}</div>
      <div>
        updated: <span data-testid="count">{updated}</span>
      </div>
      <div onClick={setTrue}>true</div>
      <div onClick={setFalse}>false</div>
    </div>
  )
}

interface IPerson {
  name: string
  lastname: string
  age: number
  address: {
    street: string
    houseNumber: number
  }
}
const ExampleComponentObj = () => {
  const [value, setValue] = useSmartState<IPerson>({
    name: 'John',
    lastname: 'Doe',
    age: 50,
    address: {
      street: 'Flower',
      houseNumber: 10,
    },
  })
  const [updated, setUpdated] = useSmartState<number>(0)

  const setName = useCallback(
    () =>
      setValue({
        ...value,
        name: 'Merry',
      }),
    [setValue, value]
  )
  const setAge = useCallback(
    () =>
      setValue({
        ...value,
        age: 42,
      }),
    [setValue, value]
  )

  const setAddress = useCallback(
    () =>
      setValue({
        ...value,
        address: {
          ...value.address,
          houseNumber: 20,
        },
      }),
    [setValue, value]
  )

  useEffect(() => {
    setUpdated((v) => v + 1)
  }, [value])

  return (
    <div>
      <div>value: {value.toString()}</div>
      <div>
        updated: <span data-testid="count">{updated}</span>
      </div>
      <div onClick={setName}>name</div>
      <div onClick={setAge}>age</div>
      <div onClick={setAddress}>address</div>
    </div>
  )
}

const ExampleComponentFn = () => {
  const [value, setValue] = useSmartState({
    value: false,
  })
  const [updated, setUpdated] = useSmartState<number>(0)

  const setTrue = useCallback(
    () => setValue((prev) => (prev ? { value: true } : { value: true })),
    [setValue]
  )

  useEffect(() => {
    setUpdated((v) => v + 1)
  }, [value])

  return (
    <div>
      <div>value: {value.toString()}</div>
      <div>
        updated: <span data-testid="count">{updated}</span>
      </div>
      <div onClick={setTrue}>true</div>
    </div>
  )
}

describe('useSmartState', () => {
  it('useState for reference', () => {
    const { getByText, getByTestId } = render(<ExampleComponentUseState />)
    const trueButton = getByText('true')
    const falseButton = getByText('false')
    const count = () => Number(getByTestId('count').innerHTML)

    expect(count()).toEqual(1)

    fireEvent.click(falseButton)
    fireEvent.click(falseButton)

    expect(count()).toEqual(3)

    fireEvent.click(trueButton)
    fireEvent.click(trueButton)
    fireEvent.click(trueButton)

    expect(count()).toEqual(6)
  })

  it('Should trigger the change only on real value change', () => {
    const { getByText, getByTestId } = render(<ExampleComponent />)
    const trueButton = getByText('true')
    const falseButton = getByText('false')
    const count = () => Number(getByTestId('count').innerHTML)

    expect(count()).toEqual(1)

    fireEvent.click(falseButton)
    fireEvent.click(falseButton)

    expect(count()).toEqual(1)

    fireEvent.click(trueButton)
    fireEvent.click(trueButton)
    fireEvent.click(trueButton)

    expect(count()).toEqual(2)
  })

  it('Should trigger the change only on real value change, object', () => {
    const { getByText, getByTestId } = render(<ExampleComponentObj />)
    const name = getByText('name')
    const age = getByText('age')
    const count = () => Number(getByTestId('count').innerHTML)

    expect(count()).toEqual(1)

    fireEvent.click(name)
    fireEvent.click(name)

    expect(count()).toEqual(2)

    fireEvent.click(name)
    fireEvent.click(name)
    fireEvent.click(age)
    fireEvent.click(age)
    fireEvent.click(age)

    expect(count()).toEqual(3)
  })

  it('Should trigger the change only on real value change, object nested', () => {
    const { getByText, getByTestId } = render(<ExampleComponentObj />)
    const address = getByText('address')

    const count = () => Number(getByTestId('count').innerHTML)

    expect(count()).toEqual(1)

    fireEvent.click(address)
    fireEvent.click(address)

    expect(count()).toEqual(2)
  })

  it('Should behave as useState when function is passed to modify object', () => {
    const { getByText, getByTestId } = render(<ExampleComponentFn />)
    const trueButton = getByText('true')
    const count = () => Number(getByTestId('count').innerHTML)

    expect(count()).toEqual(1)

    fireEvent.click(trueButton)
    fireEvent.click(trueButton)

    expect(count()).toEqual(3)

    fireEvent.click(trueButton)
    fireEvent.click(trueButton)
    fireEvent.click(trueButton)

    expect(count()).toEqual(6)
  })
})
