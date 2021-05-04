# React useSmartState

useSmartState is just a useState on steroids. For simple values like string, boolean, number works exactly the same as useState, but for nested objects it prevent from unnecessary updates

## Getting started

```
yarn add react-use-smart-state
```

## Usage

```jsx
import React, { useState, useEffect } from 'react'
import { useWhenMounted } from 'react-use-when-mounted'

interface IPerson {
    name: string
    lastname: string
    age: number
}

export const TestExample: React.FC<{}> = () => {
    const [value, setValue] = useSmartState<IPerson>({
        name: 'John',
        lastname: 'Doe',
        age: 50,
    })
    
    useEffect(() => {
        console.log('I am called only when really change')
        
        // calling this 10 times
        // setValue({ ...value, age: 52 })
        // will cause just one update
    }, [value])
    
    return (<div>
        Look how awsome it is!
        
        <div onClick={() => setValue({ ...value, age: 52 })}>Click Me</div>
    </div>)
}
```
