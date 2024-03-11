import executeQuery from "@/utils/db";
import Project from "@/models/Project";
export const GET = async (request) => {
  try {
    const result = await Project.all();
    if (result.length === 0) {
      return new Response(JSON.stringify("No projects retrieved"), {
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
    const newProject = new Project(data);
    const resultID = await newProject.save();
    return new Response(
      JSON.stringify({
        status: 200,
        message: "Success adding new Projects!",
        id: resultID,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify("Failed adding new project", { status: 500 })
    );
  }
};