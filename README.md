# Aplicando principios SOLID en REACT

[![wakatime](https://wakatime.com/badge/user/8ef73281-6d0a-4758-af11-fd880ca3009c/project/b2e92dd4-30d5-4da9-9326-7ce28a2c7337.svg)](https://wakatime.com/badge/user/8ef73281-6d0a-4758-af11-fd880ca3009c/project/b2e92dd4-30d5-4da9-9326-7ce28a2c7337)

[Principios SOLID en React.js (Buenas prácticas) con ejemplos prácticos](https://www.youtube.com/watch?v=jKdt-BnTTR0&ab_channel=midulive)

<FONT COLOR="red" SIZE="5">SOLID</FONT> es el acrónimo de los siguientes 5 principios:

- Single Responsibility Principle (SRP)
- Open-Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

Estaba pensado inicialmente a la programación orientada a objetos, pero se ha ido implementando en otros modelos de diseño de software (ej, programación funcional).

## Principio de Responsabilidad Única

El principio original dicta que cada clase debe tener una responsabilidad o tarea única. Este principio es fácil de interpretar y de extrapolar a nuestro contexto. Siguiendo este principio, podemos mejorar drásticamente nuestro código, ya que podemos:

- Romper grandes componentes dentro de unos más pequeños
- Extraer código no relacionado a la funcionalidad principal del componente, dentro de funciones separadas
- Encapsular información conectada dentro de custom hooks

En el primer ejemplo tenemos un componente para una lista de tareas por hacer. Pero este componente tiene 3 tareas a su cargo:

1. Gestionar el estado de la data
2. Fetching de datos
3. Renderizar el contenido

```tsx
import axios from "axios"
import { useEffect, useState } from "react"


type TodoType = {
    id: number
    userId: number
    title: string
    completed: boolean
}


const TodoList = () => {
    const [data, setData] = useState<TodoType[]>([])
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        axios
            .get<TodoType[]>(`https://jsonplaceholder.typicode.com/todos`)
            .then((res) => setData(res.data))
            .catch((e) => console.log(e))
            .finally(() => setIsFetching(false))
    }, [])

    if (isFetching) {
        return <p>...Loading</p>
    }

    return (
        <ul>
            {data.map((todo) => {
                return (
                    <li>
                        <span>{todo.id}</span>
                        <span>{todo.title}</span>
                    </li>
                )
            })}
        </ul>
    )
}


export default TodoList
```

En React, normalmente, cuando tenemos un `useEffect` podemos crear un custom hook para separar la lógica del componente. Con esto en mente, lo primero que haremos será crear un hook para traer la data:

```tsx
const useFetchTodo = () => {
    const [data, setData] = useState<TodoType[]>([])
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        axios
            .get<TodoType[]>(`https://jsonplaceholder.typicode.com/todos`)
            .then((res) => setData(res.data))
            .catch((e) => console.log(e))
            .finally(() => setIsFetching(false))
    }, [])

    return { data, isFetching }
}
```

Luego, dentro del componente llamamos las propiedades que retornamos de la función:

```tsx
const TodoList = () => {
    const { data, isFetching } = useFetchTodo()

    if (isFetching) return <p>...Loading</p>

    return (
        <ul>
            {data.map((todo) => {
                return (
                    <li>
                        <span>{todo.id}</span>
                        <span>{todo.title}</span>
                    </li>
                )
            })}
        </ul>
    )
}
```

Si queremos ir un poco más allá, podemos notar que el custom hook se dedica a la gestión del estado y por otro al fetching de datos, es decir que tiene 2 responsabilidades. Podemos separar las tareas de la siguiente manera: Exportamos un servicio que se encarga de traer la data, y luego lo llamamos dentro de nuestro hook

```tsx
export const fetchTodo = () => {
    return axios
        .get<TodoType[]>(`https://jsonplaceholder.typicode.com/todos`)
        .then(res => res.data)
}
```

```tsx
export const useFetchTodo = () => {
    const [data, setData] = useState<TodoType[]>([])
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        fetchTodo()
            .then(todos => setData(todos))
            .catch(e => console.log(e))
            .finally(() => setIsFetching(false))
    }, [])

    return { data, isFetching }
}
```

Ahora bien, lo anterior lo podemos ir sacando en ficheros nuevos, lo que nos permite mantener un código más legible y tratable. [SingleResponsibilityPrinciple](./src/SingleResponsibilityPrinciple/).

## Principio de Abierto-Cerrado

Este principio dicta que las entidades de nuestro software deben estar abiertas para extensión, pero cerradas para modificación. En ocasiones necesitamos que alguna parte de nuestro software o algún componente ejecute algo diferente a lo que ha estado mostrando. En lugar de tocar dentro del componente, ya que podría generar errores en la lógica que ya estaba en funcionamiento, el ideal sería extender la funcionalidad del componente desde fuera del mismo.

Tenemos el siguiente componente de ejemplo:

```tsx
import { FC } from 'react'


type Props = {
    title: string
    type: 'default' | 'withLinkButton' | 'withNormalButton'
    href?: string
    buttonText?: string
    onClick?: () => void
}


const Title: FC<Props> = ({
    title,
    type,
    href,
    buttonText,
    onClick
}) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>{title}</h1>
            {type === 'withLinkButton' && (
                <button onClick={onClick}>
                    <a href={href}>{buttonText}</a>
                </button>
            )}

            {type === 'withLinkButton' && (
                <button onClick={onClick}>{buttonText}</button>
            )}
        </div>
    )
}


export default Title
```

¿Que pasaría si tenemos que añadir un nuevo tipo de botón? Pues, tenemos que hacer la condicional para renderizar el nuevo elemento, lo cual es una clara violación al principio de abierto-cerrado. Lo que vamos a hacer para solucionar este problema, es crear nuevos componentes y hacer uso de componentes hijos:

```tsx
import { FC } from 'react'
import type { TitleProps, TitleWithButtonProps, TitleWithLinkProps } from './types/title-props'


const Title: FC<TitleProps> = ({ title, children }) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <h1>{title}</h1>
            {children}
        </div>
    )
}


export const TitleWithLink: FC<TitleWithLinkProps> = ({ title, href, buttonText }) => {
    return <Title title={title}>
        <div>
            <a href={href}>{buttonText}</a>
        </div>
    </Title>
}


export const TitleWithButton: FC<TitleWithButtonProps> = ({ title, buttonText, onClick }) => {
    return <Title title={title}>
        <button onClick={onClick}>{buttonText}</button>
    </Title>
}
```

Ahora, cada que necesitamos un nuevo elemento dentro del titulo, solo debemos extender la funcionalidad del componente Title. Además tenemos la oportunidad de que las propiedades ya no son opcionales, por lo que también vamos a evitar errores tales como, no pasar la lógica del botón por que el componente no lo pidió.

## Principio de Sustitución de Liskov

Se puede definir básicamente como una relación entre objetos, en donde un subtipo de objetos debería ser sustituible por el supertipo de dichos objetos.

Asumamos que tenemos un componente botón, en cual recibimos cómo props un color, un tamaño y un elemento hijo. Dependiendo del valor ingresado en el tamaño, se determina el tamaño de la letra.

```tsx
import { FC, ReactNode } from "react"


type ButtonProps = {
    children: ReactNode
    color: string
    size: 'xl' | 'm'
}


const Button: FC<ButtonProps> = ( { children, color, size } ) => {
    return <button style={ { color, fontSize: size === 'xl' ? '32px' : '16px' } }>
        { children }
    </button>
}
```

Ahora bien, hemos decidido crear un nuevo componente que se encargue de usar el botón que creamos, pero al momento de establecer las props del nuevo componente, decidimos no crear el tamaño, sino enviar una nueva propiedad que luego será evaluada y ajustará el tamaño del botón.

```tsx
type RedButtonProps = {
    children: ReactNode
    isBig: boolean
}

const RedButton: FC<RedButtonProps> = ( { children, isBig } ) => <Button size={ isBig ? 'xl' : 'm' } color="red">{ children }</Button>
```

Cuando decidimos usar el nuevo componente, debemos pasar su propiedad y con ello veremos en funcionamiento lo que hemos creado.

```tsx
export const BadImplementation = () => {
    return <RedButton isBig={ true }>
        Mala implementación
    </RedButton>
}
```

El problema surge cuando queremos usar el componente de botón original, y no el componente personalizado, si intentamos reemplazar el nombre del componente, obtendremos un error puesto que las props no coinciden.

```tsx
export const BadImplementation = () => {
    return <Button isBig={ true }> //! La propiedad 'isBig' no existe en el tipo 'IntrinsicAttributes & ButtonProps'.
        Mala implementación
    </Button>
}
```

La mejor práctica consiste en usar las mismas propiedades para el componente hijo, pero teniendo en cuenta que algunas propiedad serán opcionales:

```tsx
type ButtonProps = {
    children: ReactNode
    color?: string
    size: 'xl' | 'm'
}


const Button: FC<ButtonProps> = ( { children, color, size } ) => {
    return <button style={ { color, fontSize: size === 'xl' ? '32px' : '16px' } }>
        { children }
    </button>
}


const RedButton: FC<ButtonProps> = ( { children, size } ) => <Button size={ size } color="red">{ children }</Button>
```

De esta manera podremos usar el componente hijo, y si queremos, luego podemos reemplazarlo por el componente general o de supertipo:

```tsx
export const BestPractice = () => {
    return <RedButton size="xl">
        Mejor práctica
    </RedButton>
}
```

```tsx
export const BestPractice = () => {
    return <Button size="xl">
        Mejor práctica
    </Button>
}
```

