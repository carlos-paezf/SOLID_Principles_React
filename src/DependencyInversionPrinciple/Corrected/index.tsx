import { useData } from './hooks/useData'
import { ResponseType } from './types'
import { fetcherMock as fetcher } from './util/fetcher'


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