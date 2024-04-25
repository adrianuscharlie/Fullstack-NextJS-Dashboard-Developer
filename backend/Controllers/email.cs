using Dashboard_Project.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dashboard_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class email : ControllerBase
    {
        // GET: api/<email>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<email>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            try
            {
                Function.TraceLog("/api/email/" + id, "[GET] Developer and Support Email", "Start getting developer and support email");
                string[] split = id.Split("_");
                string project_name = split[0];
                string version = split[1];
                List<string> namaLengkap = Project.GetEmail(project_name, version);
                if (namaLengkap != null && namaLengkap.Count() > 0)
                {
                    string developer = Email.FindByNamaLengkap(namaLengkap[0]);
                    string support = Email.FindByNamaLengkap(namaLengkap[1]);
                    if (developer != null && support != null)
                    {
                        var objectEmail = new
                        {
                            emailDeveloper = developer,
                            emailSupport = support
                        };
                        Function.TraceLog("/api/email/" + id, "[GET] Developer and Support Email", "Success getting developer and support email");
                        return Ok(objectEmail);
                    }
                }
                Function.TraceLog("/api/email/" + id, "[GET] Developer and Support Email", "Failed getting developer and support email");
                return NotFound("Email not found");
            }
            catch (Exception ex)
            {
                Function.TraceLog("/api/email/" + id, "[GET] Developer and Support Email", "Error getting developer and support email "+ex.Message);
                return StatusCode(500, "Error when finding emails");
            }
        }

        // POST api/<email>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] IFormCollection form)
        {
            try
            {
                var emailJson = form["email"];
                Email email= JsonConvert.DeserializeObject<Email>(emailJson);
                List<IFormFile> attachments = new List<IFormFile>();
                Function.TraceLog("/api/email/", "[POST] Sendimg email to " +email.to, "Start sending email to "+email.to);
                foreach (var file in form.Files)
                {
                    attachments.Add(file);
                }
                email.attachments = attachments;
                bool success = false;
                success = await email.SendEmail();          
                if(success)
                {
                    Function.TraceLog("/api/email/", "[POST] Sendimg email to " + email.to, "Success sending email to " + email.to);
                    return Ok("Success sending email");
                }
                Function.TraceLog("/api/email/", "[POST] Sendimg email to " + email.to, "Failed sending email to " + email.to);
                return BadRequest("Failed to send email");
            }
            catch(Exception ex)
            {
                Function.TraceLog("/api/email/", "[POST] Sendimg email  ", "Error sending email  "+ex.Message );
                return StatusCode(500, "Error when trying sending email");
            }
        }

        // PUT api/<email>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<email>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
