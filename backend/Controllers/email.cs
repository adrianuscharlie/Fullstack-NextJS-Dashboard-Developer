using Dashboard_Project.Models;
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
        public string Get(int id)
        {
            return "value";
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

                // Iterate over form.Files and add each file to the attachments list
                foreach (var file in form.Files)
                {
                    attachments.Add(file);
                }
                email.attachments = attachments;
                bool success=await email.SendEmail();
                if(success)
                {
                    return Ok("Success sending email");
                }
                return BadRequest("Failed to send email");
            }
            catch(Exception ex)
            {
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
