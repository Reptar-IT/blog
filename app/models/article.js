// require node packages
const mongoose = require("mongoose");

const timestamps = {timestamps: { createdAt: "created_at", updatedAt: "updated_at" }};
const Schema = mongoose.Schema;

// Create schemas
const articleSchema = new Schema({
  title: {type: String, max: 30}, spiel: {type: String, max: 3000}, comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], creator: { type: Schema.Types.ObjectId, ref: "User"} }, timestamps
);

// Create  model
const Article = new mongoose.model("Article", articleSchema);

module.exports = Article;