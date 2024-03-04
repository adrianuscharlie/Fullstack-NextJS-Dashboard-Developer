import File from "@/models/File";
const fs = require("fs");
const path = require("path");

export const POST = async (request) => {
  try {
    const data = await request.formData();
    const header = JSON.parse(data.get("header"));
    data.delete("header");
    const publicFolderPath = path.join(process.cwd(), "public");
    const folderPath = path.join(publicFolderPath, "files", header.folder);

    console.log("Folder Path:", folderPath);

    // Ensure that the folder exists, create it if not
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Folder created at ${folderPath}`);
    }

    // Iterate over files and save them
    for (const [name, file] of data.entries()) {
      const originalFileName = file.name; // Get the original file name with extension
      const filePath = path.join(folderPath, originalFileName);
      const fileObject = new File({
        fileName: originalFileName,
        commentID: header.id,
        projectID: header.project_id,
        filePath: filePath,
      });
      console.log(fileObject)
      const buffer = await file.arrayBuffer();
      await fs.promises.writeFile(filePath, Buffer.from(buffer));
      console.log(`File saved at ${filePath}`);
      const resultID=await fileObject.save();
      console.log(resultID)
    }

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed", { status: 500 });
  }
};
