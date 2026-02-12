import dbConnect from "@/lib/db";
import { Category } from "@/models";
import { NavbarClient } from "./navbar-client";

const Navbar = async () => {
  await dbConnect();
  // Fetch categories using lean() for better performance and plain objects
  const categories = await Category.find({}).lean();

  // Serialize the categories to pass to client component
  const serializedCategories = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
  }));

  return <NavbarClient categories={serializedCategories} />;
};

export default Navbar;
