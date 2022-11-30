import { FC } from "react"


type PostType = {
    title: string
    author: {
        name: string
        age: number
    }
    createdAt: Date
}

type Props = {
    title: string
}

type DateProps = {
    createdAt: string
}


const PostTitle: FC<Props> = ( { title } ) => {
    return <h1>{ title }</h1>
}


const PostDate: FC<DateProps> = ( { createdAt } ) => {
    return <time>{ createdAt }</time>
}


const Post = ( { post }: { post: PostType } ) => {
    return (
        <div>
            <PostTitle title={ post.title } />
            <span>author: { post.author.name }</span>
            <PostDate createdAt={ post.createdAt.toString() } />
        </div >
    )
}


export default Post