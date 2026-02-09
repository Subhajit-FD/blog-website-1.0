import { NextResponse } from "next/server";
import {
  uploadImage,
  deleteImage,
  updateImage,
} from "@/services/storage.service";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'profile' or 'blog'

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = type === "profile" ? "/profile-images" : "/blog-images";
    // @ts-ignore
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    const response = await uploadImage(buffer, fileName, folder);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("File Upload Error:", error);
    return NextResponse.json(
      { message: "Failed to upload file" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 },
      );
    }

    await deleteImage(fileId);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("File Delete Error:", error);
    return NextResponse.json(
      { message: "Failed to delete file" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileId = formData.get("fileId") as string;
    const type = formData.get("type") as string;

    if (!file || !fileId) {
      return NextResponse.json(
        { message: "File and File ID are required" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = type === "profile" ? "/profile-images" : "/blog-images";
    // @ts-ignore
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

    const response = await updateImage(fileId, buffer, fileName, folder);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("File Update Error:", error);
    return NextResponse.json(
      { message: "Failed to update file" },
      { status: 500 },
    );
  }
}
