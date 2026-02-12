// Central model import file - ensures all models are registered
// Must be imported before using models to avoid MissingSchemaError

import { User } from "./user.model";
import { Blog } from "./blog.model";
import { Category } from "./category.model";
import { Comment } from "./comment.model";
import { Interaction } from "./interaction.model";

// Export all models
export { User, Blog, Category, Comment, Interaction };

// This ensures models are registered in mongoose.models
export const models = {
  User,
  Blog,
  Category,
  Comment,
  Interaction,
};
