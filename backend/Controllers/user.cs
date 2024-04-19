using Dashboard_Project.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dashboard_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class user : ControllerBase
    {
        // GET: api/<user>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<user>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<user>
        [HttpPost]
        public IActionResult Post([FromBody] User request)
        {
            try
            {
                if (request.Save())
                {
                    var responseObject = new
                    {
                        message = "Succes creating new user",
                        StatusCode = 200 // Custom status code
                    };
                    return StatusCode(200, responseObject);
                }
                else
                {
                    return BadRequest("Failed creating new user");
                }

            }catch(Exception ex)
            {
                return StatusCode(500, "Error while creating new user");
            }
        }

        // PUT api/<user>/5
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] dynamic body)
        {
            if (id.Split("__")[0] == "edit")
            {
                try
                {
                    string namaLengkap = body.GetProperty("namaLengkap").GetString();
                    string username = body.GetProperty("username").GetString();
                    string role = body.GetProperty("role").GetString();
                    string email=body.GetProperty("email").GetString();
                    string password = body.GetProperty("password").GetString();
                    User request = new User(namaLengkap, username, email,password, role, true);
                    User existing = Dashboard_Project.Models.User.Get(request.namaLengkap);
                    if (existing != null)
                    {
                        if (request.password == existing.password)
                        {
                            if (request.Update())
                            {
                                return Ok("Success updating user profile");
                            }
                            else
                            {
                                return BadRequest("Failed to update user profile");
                            }
                        }
                        return BadRequest("Incorect password");
                    }
                    return BadRequest("User Not Found");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Error while updating user profile");
                }
            }
            else
            {
                string namaLengkap = body.GetProperty("namaLengkap").GetString();
                string password = body.GetProperty("password").GetString();
                string newPassword = body.GetProperty("newPassword").GetString();
                User existing = Dashboard_Project.Models.User.Get(namaLengkap);

                if (existing != null)
                {
                    if (password == existing.password)
                    {
                        existing.password = newPassword;
                        if (existing.ChangePassword())
                        {
                            return Ok("Success changing password");
                        }
                        else
                        {
                            return BadRequest("Failed to change password");
                        }
                    }
                    return BadRequest("Incorect password");
                }
                return BadRequest("User Not Found");
            }
         
        }
            


        // DELETE api/<user>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
