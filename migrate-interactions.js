const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: String,
    views: Number,
    viewedBy: [String],
    likes: [String],
  },
  { collection: "blogs" },
);

const InteractionSchema = new mongoose.Schema(
  {
    blog: mongoose.Schema.Types.ObjectId,
    type: String,
    deviceId: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "interactions" },
);

async function migrate() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blog-website");
    const Blog = mongoose.model("Blog", BlogSchema);
    const Interaction = mongoose.model("Interaction", InteractionSchema);

    const blogs = await Blog.find({});

    for (const blog of blogs) {
      console.log(`Processing blog: ${blog.title}`);

      // Migrate Views
      for (const deviceId of blog.viewedBy) {
        const exists = await Interaction.findOne({
          blog: blog._id,
          deviceId,
          type: "view",
        });
        if (!exists) {
          await Interaction.create({ blog: blog._id, deviceId, type: "view" });
          console.log(`  Added view for device: ${deviceId}`);
        }
      }

      // Migrate Likes
      for (const deviceId of blog.likes) {
        const exists = await Interaction.findOne({
          blog: blog._id,
          deviceId,
          type: "like",
        });
        if (!exists) {
          await Interaction.create({ blog: blog._id, deviceId, type: "like" });
          console.log(`  Added like for device: ${deviceId}`);
        }
      }

      // Sync counts
      blog.views = await Interaction.countDocuments({
        blog: blog._id,
        type: "view",
      });
      await blog.save();
    }

    console.log("\nMigration completed successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrate();
