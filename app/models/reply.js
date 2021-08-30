// require node packages
const mongoose = require("mongoose");

const timestamps = {timestamps: { createdAt: "created_at", updatedAt: "updated_at" }};
const Schema = mongoose.Schema;

// Create schemas
const replySchema = new Schema({
  description: {type: String, max: 250}, article: { type: Schema.Types.ObjectId, ref: "Article" }, comment: { type: Schema.Types.ObjectId, ref: "Comment" }, creator: { type: Schema.Types.ObjectId, ref: "User" } }, timestamps
);

// Create model
const Reply = new mongoose.model("Reply", replySchema);

module.exports = Reply;