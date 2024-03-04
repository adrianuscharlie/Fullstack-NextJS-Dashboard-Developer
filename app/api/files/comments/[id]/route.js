import executeQuery from "@/utils/db";
import File from "@/models/File";
export const GET = async (request, { params }) => {
  try {
    const result = await File.findByCommentID(params.id);
    if (result.length === 0) {
      return new Response(JSON.stringify("No Files retrieved"), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify("Error to get all projects", { status: 500 })
    );
  }
};
