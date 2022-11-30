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

## Principio de Segregación de Interfaces

Este principio dicta que, los clientes no deberían depender de interfaces que no necesitan. Llevando esto al contexto de React, sería como: los componentes no deberían de depender de props que no usan. En ocasiones enviamos un gran conjunto de propiedades, de las que solo usamos unas pocas, pero al momento de hacer alguna modificación en nuestro código, nos debemos asegurar que se sigue enviando todo ese conjunto de propiedades.

Tenemos el siguiente ejemplo de componentes, en el cual observamos un post con algunos elementos internos. Lo importante a resaltar en este ejemplo, es la manera en qla que se están compartiendo en todos los componentes un objeto completo de tipo Post, para luego solo obtener una sola característica del mismo.

```tsx
import { FC } from "react"


type PostType = {
    title: string
    author: {
        name: string
        age: number
    }
    createdAt: Date
}

type Props = {
    post: PostType
}

type DateProps = {
    post: PostType
}


const PostTitle: FC<Props> = ( { post } ) => {
    return <h1>{ post.title }</h1>
}


const PostDate: FC<DateProps> = ( { post } ) => {
    return <time>{ post.createdAt.toString() }</time>
}


const Post = ( { post }: { post: PostType } ) => {
    return (
        <div>
            <PostTitle post={ post } />
            <span>author: { post.author.name }</span>
            <PostDate post={ post } />
        </div >
    )
}


export default Post
```

La manera en la que podemos aplicar el principio de segregación de interfaces, es simplificar las propiedades que se envían a los componentes, de esta manera nos aseguramos de que las propiedad sean claras al momento de modificar o añadir una nueva funcionalidad:

```tsx
import { FC } from "react"


type PostType = {
    title: string
    author: {
        name: string
        age: number
    }
    createdAt: Date
}

type Props = {
    title: string
}

type DateProps = {
    createdAt: string
}


const PostTitle: FC<Props> = ( { title } ) => {
    return <h1>{ title }</h1>
}


const PostDate: FC<DateProps> = ( { createdAt } ) => {
    return <time>{ createdAt }</time>
}


const Post = ( { post }: { post: PostType } ) => {
    return (
        <div>
            <PostTitle title={ post.title } />
            <span>author: { post.author.name }</span>
            <PostDate createdAt={ post.createdAt.toString() } />
        </div >
    )
}


export default Post
```

Es muy recomendable evitar pasar información de más de manera inconsciente como se muestra a continuación. Importante, siempre depende del contexto en que se aplique, por ejemplo, cuando necesitamos enviar 10 propiedades de un objeto de 15, esto es muy diferente a enviar 1 propiedad de un objeto de 15.

```tsx
const Post = ( { post }: { post: PostType } ) => {
    return (
        <div>
            <PostTitle { ...post } />
            ...
        </div >
    )
}
```

## Principio de Inversión de Dependencias

Este principio afirma que uno debería depender de abstracciones y no de implementaciones concretas. Por ejemplo, en el siguiente código tenemos un componente que se encarga de hacer una consulta a una url en especifico, pero se debe acompañar de una función asíncrona que se encarga de hacer el fetch y retornar la respuesta. Aquí estamos haciendo una implementación concreta puesto que pasamos una URL "quemada".

```tsx
import useSWR from 'swr'


const fetcher = async ( url: string ) => {
    const res = await fetch( url )
    return res.json()
}


const Todo = () => {
    const { data } = useSWR( 'https://jsonplaceholder.typicode.com/todos', fetcher )

    if ( !data ) return <p>Loading...</p>

    return (
        <ul>
            {
                data.map( ( todo: any ) => {
                    return (
                        <li>
                            <span>{ todo.id }</span>
                            <span>{ todo.title }</span>
                        </li>
                    )
                } )
            }
        </ul>
    )
}


export default Todo
```

Lo primero que haremos para aplicar el principio, puede ser crear un custom hook en que se determinen mediante interfaces con objetos genéricos, lo que debe ingresar al hook, y lo que debe retornar el mismo:

```tsx
import useSWR from 'swr'


interface UseData<T> {
    key: string
    fetcher: () => Promise<T>
}


interface Response<T> {
    data: T | undefined
    error: string | undefined
    isValidating: boolean
}


export const useData = <T> ( { key, fetcher }: UseData<T> ): Response<T> => {
    const { data, error, isValidating } = useSWR<T, string>( key, fetcher )
    return { data, error, isValidating }
}
```

Ahora, podemos crear un tipo que servirá para determinar de que se conformará el objeto genérico.

```ts
type ResponseType = {
    id: string
    title: string
}
```

En nuestro componente principal, usamos el hook que se encargará de traer la data, del lugar que nosotros queramos, puede ser una url, un mock, del localStorage, de un json, etc. Sin distinción, mientras retornen el tipo de data establecido, podrá ser usado por nuestro hook:

```tsx
import { useData } from './hooks/useData'
import { ResponseType } from './types'
import { fetcher } from './util/fetcher'


const Todo = () => {
    const { data } = useData<ResponseType[]>( { key: '/todos', fetcher } )

    if ( !data ) return <p>Loading...</p>

    return (
        <ul>
            {
                data.map( ( todo: any ) => {
                    return (
                        <li>
                            <span>{ todo.id }</span>
                            <span>{ todo.title }</span>
                        </li>
                    )
                } )
            }
        </ul>
    )
}


export default Todo
```

Por ejemplo, podemos usar cualquiera de los siguientes fetcher (los cuales incluso podrían ser enviados mediante props del componente, o ser extraídos de un contexto global).

```tsx
export const fetcherURL = async (): Promise<ResponseType[]> => {
    const url = 'https://jsonplaceholder.typicode.com/todos'
    const res = await fetch( url )
    return res.json()
}
```

```tsx
export const fetcherLocalStorage = async (): Promise<ResponseType[]> => {
    const todos = localStorage.getItem('todos')
    return todos ? JSON.parse(todos) : []
}
```

```tsx
export const fetcherMock = async (): Promise<ResponseType[]> => {
    return [
        { id: 1, title: 'Prueba' },
        { id: 2, title: 'Test' },
    ]
}
```

En este caso, podemos hacer la modificación únicamente desde la importación del fetcher en el componente en que se hará la consulta:

```tsx
import { fetcherURL as fetcher } from './util/fetcher'
```

```tsx
import { fetcherLocalStorage as fetcher } from './util/fetcher'
```

```tsx
import { fetcherMock as fetcher } from './util/fetcher'
```

La inyección de dependencias que hemos realizado, es verdaderamente potente puesto que podemos ocultar la lógica detrás de la consulta, y abstraemos lo suficiente para solo tener que cambiar pequeñas partes de nuestro código mientras se cumpla el contrato que establecemos (ejemplo el tipo de retorno).
