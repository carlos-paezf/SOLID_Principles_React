import { ReactElement } from "react"


export type TitleProps = {
    title: string
    children: ReactElement
}


export type TitleWithLinkProps = {
    title: string
    href: string
    buttonText: string
}


export type TitleWithButtonProps = {
    title: string
    buttonText: string
    onClick: () => void
}