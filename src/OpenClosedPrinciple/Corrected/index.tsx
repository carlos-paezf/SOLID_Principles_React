import { FC } from 'react'
import type { TitleProps, TitleWithButtonProps, TitleWithLinkProps } from './types/title-props'


const Title: FC<TitleProps> = ({ title, children }) => {
    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <h1>{title}</h1>
            {children}
        </div>
    )
}


export const TitleWithLink: FC<TitleWithLinkProps> = ({ title, href, buttonText }) => {
    return <Title title={title}>
        <div>
            <a href={href}>{buttonText}</a>
        </div>
    </Title>
}


export const TitleWithButton: FC<TitleWithButtonProps> = ({ title, buttonText, onClick }) => {
    return <Title title={title}>
        <button onClick={onClick}>{buttonText}</button>
    </Title>
}
