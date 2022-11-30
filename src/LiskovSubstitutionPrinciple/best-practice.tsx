import { FC, ReactNode } from "react"


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


export const BestPractice = () => {
    return <RedButton size="xl">
        Mejor práctica
    </RedButton>
    /*
    return <Button size="xl"> //* Sin errores
        Mejor práctica
    </Button>
    */
}