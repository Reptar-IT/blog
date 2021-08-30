// require node packages
const mongoose = require("mongoose");

const timestamps = {timestamps: { createdAt: "created_at", updatedAt: "updated_at" }};
const Schema = mongoose.Schema;

// Create schemas
const commentSchema = new Schema({
  description: {type: String, max: 250}, replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }], article: { type: Schema.Types.ObjectId, ref: "Article" }, creator: { type: Schema.Types.ObjectId, ref: "User" } }, timestamps
);

// Create model
const Comment = new mongoose.model("Comment", commentSchema);


module.exports = Comment;