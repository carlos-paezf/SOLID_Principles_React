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
                        <span>{todo.id}. {todo.title}</span>
                    </li>
                )
            })}
        </ul>
    )
}


export default TodoList