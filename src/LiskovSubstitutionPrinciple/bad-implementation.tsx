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


type RedButtonProps = {
    children: ReactNode
    isBig: boolean
}

const RedButton: FC<RedButtonProps> = ( { children, isBig } ) => <Button size={ isBig ? 'xl' : 'm' } color="red">{ children }</Button>


export const BadImplementation = () => {
    return <RedButton isBig={ false }>
        Mala implementación
    </RedButton>
    /*
    return <Button isBig={ true }> //! La propiedad 'isBig' no existe en el tipo 'IntrinsicAttributes & ButtonProps'.
        Mala implementación
    </Button>
    */
}