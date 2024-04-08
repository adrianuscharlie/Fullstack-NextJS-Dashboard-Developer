import executeQuery from "@/utils/db";
import Comment from "@/models/Comment";
import Project from '@/models/Project'
export const GET = async (request, { params }) => {
  try {
    const [project_name,version]=params.id.split("  ")
    const result = await Comment.findByProjectNameAndVersion(project_name,version);
    if (result.length === 0) {
      return new Response(JSON.stringify("No comments retrieved"), {
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

export const POST = async (request) => {
  try {
    const data = await request.json();
    const newComments = new Comment(data);
    const resultID=await newComments.save();
    await Project.updateStatus(newComments.status,newComments.project_name,newComments.version);
    return new Response(
        JSON.stringify({ status: 200, message: "Success adding new comments!", id:resultID }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify("Failed adding new comment", { status: 500 })
    );
  }
};
