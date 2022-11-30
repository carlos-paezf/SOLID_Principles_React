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