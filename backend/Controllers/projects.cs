using Microsoft.AspNetCore.Mvc;
using Dashboard_Project.Models;
using System.Collections.Generic;
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
                List<Project> projects = new List<Project>();
                projects = Project.All();
                if (projects.Count == 0)
                {
                    return BadRequest("No Projects retrived");
                }
                return Ok(projects);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return StatusCode(500, "Error to get All Projects");
            }
        }

        // GET: api/projects/user/{id}
        [HttpGet("user/{id}")]
        public IActionResult GetUserProjects(string id)
        {
            try
            {
                List<Project> projects = Project.FindByNamaLengkap(id);
                if (projects != null && projects.Count > 0)
                {
                    return Ok(projects);
                }
                else
                {
                    return BadRequest("No Projects retrieved for user");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Error retrieving projects for user");
            }
        }

        // GET api/<Projects>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            try
            {
                string[] param = id.Split("  ");
                string project_name = param[0];
                string version = param[1];
                Project project = Project.FindSpecific(project_name, version);
                if (project != null)
                {
                    return Ok(project);
                }
                else
                {
                    return BadRequest("No Project Retrived");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return StatusCode(500, "Error to get project");
            }
          
        }
        [HttpGet("{id}/comments")]
        public IActionResult GetComments(string id)
        {
            try
            {
                string[] param = id.Split("  ");
                string project_name = param[0];
                string version = param[1];

                // Retrieve comments for the specified project
                List < Comment > comments = new List<Comment>();
                comments=Comment.FindByNameAndVersion(project_name,version);
                // Check if comments are found
                if (comments != null && comments.Count > 0)
                {
                    return Ok(comments);
                }
                else
                {
                    return NotFound("No comments found for the project");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return StatusCode(500, "Error retrieving comments for the project");
            }
        }
        [HttpPost("{id}/comments")]
        public IActionResult PostComment([FromBody] Comment request)
        {
            try
            {
                int success = request.Save();
                if (success>0)
                {
                    var responseObject = new
                    {
                        StatusCode = 200, 
                        message = "Success adding new comment!",
                        id=success
                        
                    };
                    return StatusCode(200, responseObject);
                }
                else
                {
                    return BadRequest("Failed adding new comment!");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return StatusCode(500, "Failed adding new comment!");
            }
        }
        // POST api/<Projects>
        [HttpPost]
        public IActionResult Post([FromBody] Project request)
        {
            try
            {
                if (request.Save())
                {
                    return Ok("Success adding new Projects!");
                }
                else
                {
                    return BadRequest("Failed adding new project!");
                }
            }catch(Exception ex)
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
                request.project_name = project_name;
                request.version = version;
                if (request.Update()) return Ok($"Success updating Project {project_name} version {version}");
                else return BadRequest($"Failed to updating project {project_name} version {version}");
            }
            catch(Exception ex)
            {
                Console.Write(ex.Message.ToString());
                return StatusCode(500, $"Failed updating project {project_name} version {version}, error in server");
            }

        }

        // DELETE api/<Projects>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                string[] param = id.Split("  ");
                string project_name = param[0];
                string version = param[1];
                if (Project.Delete(project_name, version)) return Ok(new { message="Success Deleting Projects!" });
                else return BadRequest((new { message = "Failed Deleting Project" }));

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString() );
                return StatusCode(500, "Failed deleting project, error in server");
            }
        }
    }
}
