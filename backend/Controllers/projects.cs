using Microsoft.AspNetCore.Mvc;
using Dashboard_Project.Models;
using System.Collections.Generic;
using Org.BouncyCastle.Asn1.Ocsp;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dashboard_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class projects : ControllerBase
    {
        // GET: api/<Projects>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                Function.TraceLog("/api/projects", "[GET] All Project", "Start Getting All Project");
                List<Project> projects = new List<Project>();
                projects = Project.All();
                if (projects.Count != 0)
                {
                    Function.TraceLog("/api/projects", "[GET] All Project", "Success to get all project, return all project");
                    return Ok(projects);
                    
                }
                Function.TraceLog("/api/projects", "[GET] All Project", "Failed to get all project, return Not Found");
                return NotFound("No Projects retrived");
            }
            catch(Exception ex)
            {
                Function.TraceLog("/api/projects", "[GET] All Project", "Error to get all project : "+ex.Message);
                return StatusCode(500, "Error to get All Projects");
            }
        }

        // GET: api/projects/user/{id}
        [HttpGet("user/{id}")]
        public IActionResult GetUserProjects(string id)
        {
            try
            {
                Function.TraceLog("/api/projects/user/"+id, "[GET] All Project By Nama Lengkap", "Start Getting All Project");
                List<Project> projects = Project.FindByNamaLengkap(id);
                if (projects != null && projects.Count > 0)
                {
                    Function.TraceLog("/api/projects/user/" + id, "[GET] All Project By Nama Lengkap", "Success to get all project, return all project");
                    return Ok(projects);
                }
                Function.TraceLog("/api/projects/user/" + id, "[GET] All Project By Nama Lengkap", "Failed to get all project, return Not Found");
                return NotFound ("No Projects retrieved for user");
            }
            catch (Exception ex)
            {
                Function.TraceLog("/api/projects/user/" + id, "[GET] All Project By Nama Lengkap", "Error to get all project : " + ex.Message);
                return StatusCode(500, "Error retrieving projects for user");
            }
        }

        // GET api/<Projects>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            try
            {
                Function.TraceLog("/api/projects/" + id, "[GET] Project by ID", "Start Getting All Project");
                string[] param = id.Split("  ");
                string project_name = param[0];
                string version = param[1];
                Project project = Project.FindSpecific(project_name, version);
                if (project != null)
                {
                    Function.TraceLog("/api/projects/" + id, "[GET] Project by ID", "Success to get the project, return project");
                    return Ok(project);
                }
                Function.TraceLog("/api/projects/" + id, "[GET] Project by ID", "Failed to get the project, return Not Found");
                return NotFound("No Project Retrived");
            }
            catch (Exception ex)
            {
                Function.TraceLog("/api/projects/" + id, "[GET] Project by ID", "Error to get all project : " + ex.Message);
                return StatusCode(500, "Error to get project");
            }
          
        }
        [HttpGet("{id}/comments")]
        public IActionResult GetComments(string id)
        {
            try
            {
                Function.TraceLog("/api/projects/comments" + id, "[GET] All comment from Project "+id, "Start Getting All Comments By Project Name");
                string[] param = id.Split("  ");
                string project_name = param[0];
                string version = param[1];

                // Retrieve comments for the specified project
                List < Comment > comments = new List<Comment>();
                comments=Comment.FindByNameAndVersion(project_name,version);
                // Check if comments are found
                if (comments != null && comments.Count > 0)
                {
                    Function.TraceLog("/api/projects/comments" + id, "[GET] All comment from Project " + id, "Succes Getting All Comments By Project Name");
                    return Ok(comments);
                }
                Function.TraceLog("/api/projects/comments" + id, "[GET] All comment from Project " + id, "Failed Getting All Comments By Project Name,return Not Found");
                return NotFound("No comments found for the project");
            }
            catch (Exception ex)
            {
                Function.TraceLog("/api/projects/comments" + id, "[GET] All comment from Project " + id, "Error Getting All Comments By Project Name : "+ex.Message);
                return StatusCode(500, "Error retrieving comments for the project");
            }
        }
        [HttpPost("{id}/comments")]
        public IActionResult PostComment([FromBody] Comment request)
        {
            try
            {
                Function.TraceLog("/api/projects/comments", "[POST] comment from Project :" + request.project_name+" Version : "+request.version, "Start posting comment for project");
                int success = request.Save();
                if (success>=0&& Project.UpdateStatus(request.status,request.project_name,request.version))
                {
                    var responseObject = new
                    {
                        message = "Success adding new comment!",
                        id=success,
                        date=DateTime.Now.ToString("HH:mm dd-MM-yyyy")
                        
                    };
                    Function.TraceLog("/api/projects/comments", "[POST] comment from Project :" + request.project_name + " Version : " + request.version, "Success posting comment for project");
                    return Ok(responseObject);
                }
                Function.TraceLog("/api/projects/comments", "[POST] comment from Project :" + request.project_name + " Version : " + request.version, "Failed posting comment for project");
                return BadRequest("Failed adding new comment!");
            }
            catch (Exception ex)
            {
                Function.TraceLog("/api/projects/comments", "[POST] comment from Project :" + request.project_name + " Version : " + request.version, "Error posting comment for project" +ex.Message);
                return StatusCode(500, "Failed adding new comment!");
            }
        }
        // POST api/<Projects>
        [HttpPost]
        public IActionResult Post([FromBody] Project request)
        {
            try
            {
                Function.TraceLog("/api/projects", "[POST] Post new Project :" + request.project_name + " Version : " + request.version, "Start posting new Project");
                if (request.Save())
                {
                    Function.TraceLog("/api/projects", "[POST] Post new Project :" + request.project_name + " Version : " + request.version, "Success posting new Project");
                    return Ok("Success adding new Projects!");
                }
                Function.TraceLog("/api/projects", "[POST] Post new Project :" + request.project_name + " Version : " + request.version, "Failed posting new Project");
                return BadRequest("Failed adding new project!");
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return StatusCode(500,"Error while adding new project!");
            }
        }

        // PUT api/<Projects>/5
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] Project request)
        {
            string[] param = id.Split("  ");
            string project_name = param[0];
            string version = param[1];
            try
            {
                Function.TraceLog("/api/projects/"+id, "[PUT] Updating Project :" + request.project_name + " Version : " + request.version, "Start Updating Project");
                request.project_name = project_name;
                request.version = version;
                if (request.Update())
                {
                    Function.TraceLog("/api/projects", "[POST] Post new Project :" + request.project_name + " Version : " + request.version, "Success Updating Project");
                    return Ok($"Success updating Project {project_name} version {version}");
                }
                Function.TraceLog("/api/projects", "[POST] Post new Project :" + request.project_name + " Version : " + request.version, "Failed Updating Project");
                return BadRequest($"Failed to updating project {project_name} version {version}");
            }
            catch(Exception ex)
            {
                Console.Write(ex.Message.ToString());
                return StatusCode(500, $"Error updating project {project_name} version {version}, error in server "+ex.Message);
            }

        }

        // DELETE api/<Projects>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            string[] param = id.Split("  ");
            string project_name = param[0];
            string version = param[1];
            try
            {
                Function.TraceLog("/api/projects/" + id, "[DELETE] Delete Project :" + project_name + " Version : " + version, "Start Deleting Project");
                if (Project.Delete(project_name, version))
                {
                    Function.TraceLog("/api/projects/" + id, "[DELETE] Delete Project :" + project_name + " Version : " + version, "Success Deleting Project");
                    return Ok(new { message = "Success Deleting Projects!" });
                }
                Function.TraceLog("/api/projects/" + id, "[DELETE] Delete Project :" + project_name + " Version : " + version, "Failed Deleting Project");
                return BadRequest((new { message = "Failed Deleting Project" }));
            }
            catch(Exception ex)
            {
                Function.TraceLog("/api/projects/" + id, "[DELETE] Delete Project :" + project_name + " Version : " + version, "Error Deleting Project "+ex.Message);
                return StatusCode(500, "Failed deleting project, error in server");
            }
        }
    }
}
