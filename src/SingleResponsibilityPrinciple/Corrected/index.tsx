import { useFetchTodo } from "./hooks/useFetchTodo"


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


export default TodoList