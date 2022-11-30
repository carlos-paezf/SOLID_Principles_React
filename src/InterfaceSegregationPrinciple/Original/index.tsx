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
    post: PostType
}


const PostTitle: FC<Props> = ( { post } ) => {
    return <h1>{ post.title }</h1>
}


type DateProps = {
    post: PostType
}

const PostDate: FC<DateProps> = ( { post } ) => {
    return <time>{ post.createdAt.toString() }</time>
}


const Post = ( { post }: { post: PostType } ) => {
    return (
        <div>
            <PostTitle post={ post } />
            <span>author: { post.author.name }</span>
            <PostDate post={ post } />
        </div >
    )
}


export default Post