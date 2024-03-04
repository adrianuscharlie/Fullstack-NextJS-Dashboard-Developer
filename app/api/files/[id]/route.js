import { readFile } from "fs/promises";
import { join, extname } from "path";
import mime from "mime-types";
import File from "@/models/File";
const fs = require("fs");
export const GET = async (request, { params }) => {
  try {
    const url=params.id;
    const split= url.split("_");
    const [fileName,commentID,projectID]=split
    const filePath = await File.singleDownload(split);
    console.log(filePath)
    if (fs.existsSync(filePath)) {
      const fileContent = await readFile(filePath);

      // Determine the MIME type based on the file extension
      const fileExtension = extname(filePath);
      const contentType =
        mime.lookup(fileExtension) || "application/octet-stream";
      console.log(fileExtension, contentType);
      // Set the dynamic Content-Type in the headers
      return new Response(fileContent, {
        headers: {
          "Content-Disposition": `attachment; filename=${fileName}`,
          "Content-Type": contentType,
        },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify("File not found"), { status: 404 });
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    return new Response(JSON.stringify("Internal Server Error"), {
      status: 500,
    });
  }
};
