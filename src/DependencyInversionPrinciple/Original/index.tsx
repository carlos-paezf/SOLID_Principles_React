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