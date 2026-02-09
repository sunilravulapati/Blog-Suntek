import { Schema, model } from 'mongoose'

//create userCommentSchema
const userCommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "blog-user"
    },
    comment: {
        type: String
    }
})
//create article schema
const articleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "blog-user",
        required: [true, "author id is required"]
    },
    title: {
        type: String,
        required: [true, "title is required"]
    },
    category: {
        type: String,
        required: [true, "category is required"],
    },
    content: {
        type: String,
        required: [true, "description is required"]
    },
    comments: [userCommentSchema],
    isArticleActive: {
        type: Boolean,
        default: true
    }
}, {
    strict: "throw",
    timestamps: true,
    versionKey: false
})

export const ArticleModel = model("blog-article", articleSchema)