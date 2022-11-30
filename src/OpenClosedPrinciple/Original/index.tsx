import { FC } from 'react'


type Props = {
    title: string
    type: 'default' | 'withLinkButton' | 'withNormalButton'
    href?: string
    buttonText?: string
    onClick?: () => void
}


const Title: FC<Props> = ({
    title,
    type,
    href,
    buttonText,
    onClick
}) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <h1>{title}</h1>
            {type === 'withLinkButton' && (
                <button onClick={onClick}>
                    <a href={href}>{buttonText}</a>
                </button>
            )}

            {type === 'withNormalButton' && (
                <button onClick={onClick}>{buttonText}</button>
            )}
        </div>
    )
}


export default Title