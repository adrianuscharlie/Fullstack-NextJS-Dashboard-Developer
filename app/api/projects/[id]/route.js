import executeQuery from "@/utils/db";
import Project from "@/models/Project";
export const GET = async (request, { params }) => {
  try {
    const [project_name,version]=params.id.split("  ")
    const result = await Project.findSpecific(project_name,version);
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
export const PUT = async (request) => {
  try {
    const data = await request.json();
    const project = new Project(data);
    const existingProject = await Project.find(project.id);
    Object.assign(existingProject, project);
    console.log(existingProject);
    const affectedRows = await Project.update(
      existingProject.id,
      existingProject
    );
    if (affectedRows > 0) {
      return new Response(
        JSON.stringify({
          status: 200,
          message: "Success Updating Projects!",
          id: existingProject.id,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify("Failed updating project", { status: 400 })
      );
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return new Response(
      JSON.stringify("Failed updating project, error in server", {
        status: 500,
      })
    );
  }
};
export const DELETE = async (request, { params }) => {
  try {
    const affectedRows = await Project.delete(params.id);
    if (affectedRows > 0) {
      return new Response(
        JSON.stringify({
          status: 200,
          message: "Success Deleting Projects!",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify("Failed Deleting Project", { status: 400 })
      );
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return new Response(
      JSON.stringify("Failed deleting project, error in server", {
        status: 500,
      })
    );
  }
};
