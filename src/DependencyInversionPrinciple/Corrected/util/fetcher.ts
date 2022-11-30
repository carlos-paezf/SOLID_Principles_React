import { ResponseType } from "../types"


export const fetcherURL = async (): Promise<ResponseType[]> => {
    const url = 'https://jsonplaceholder.typicode.com/todos'
    const res = await fetch( url )
    return res.json()
}


export const fetcherLocalStorage = async (): Promise<ResponseType[]> => {
    const todos = localStorage.getItem( 'todos' )
    return todos ? JSON.parse( todos ) : []
}


export const fetcherMock = async (): Promise<ResponseType[]> => {
    return [
        { id: 1, title: 'Prueba' },
        { id: 2, title: 'Test' },
    ]
}