import axios from "axios"
import type { TodoType } from "../types/todo"


export const fetchTodo = () => {
    return axios
        .get<TodoType[]>(`https://jsonplaceholder.typicode.com/todos`)
        .then(res => res.data)
}