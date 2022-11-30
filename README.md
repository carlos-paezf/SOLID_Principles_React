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
