using System.Net.Mail;
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
        public string Get(string id)
        {
            return "value";
        }

        [HttpGet("{emailAddress}/forgotPassword")]
        public IActionResult ForgotPassword(string emailAddress)
        {
            try
            {
                Function.TraceLog("/api/user/" + emailAddress+"/forgotPassword", "[GET] Forgot Password "+emailAddress, "Start Forgot Password "+emailAddress);
                User user = new();
                user.email= emailAddress;
                string password = user.ForgotPassword();
                if (password != null)
                {
                    Email email = new Email();
                    email.to = emailAddress;
                    email.from = "adrianus.charlie@idmsukses.co.id";
                    email.subject = "[Forgot Password] Password Reset";
                    email.body = $"Dear User,<br/><br/>Your password has been reset successfully.<br/><br/>New Password: {password}<br/><br/>For security reasons, we recommend that you change your password after logging in.<br/><br/>If you did not request this password reset, please contact support immediately.<br/><br/>Best regards,<br/> KIS Group";
                    string resetPasswordLink = "http://localhost:3000/login"; // Your reset password link
                    email.body += $"<br/><br/><a href='{resetPasswordLink}'>Click here to reset your password</a>";
                    if (email.SendForgotPassword())
                    {
                        Function.TraceLog("/api/user/" + emailAddress + "/forgotPassword", "[GET] Forgot Password " + emailAddress, "Success Forgot Password " + emailAddress);
                        return Ok("Success resetting password, please kindly check your email");
                    }
                }
                Function.TraceLog("/api/user/" + emailAddress + "/forgotPassword", "[GET] Forgot Password " + emailAddress, "Failed Forgot Password " + emailAddress);
                return BadRequest("Failed to reset password because email not found");
            }
            catch(Exception ex)
            {
                Function.TraceLog("/api/user/" + emailAddress + "/forgotPassword", "[GET] Forgot Password " + emailAddress, "Error Forgot Password " + emailAddress+" "+ex.Message);
                return StatusCode(500, "Error when resetting password");
            }
        }

        // POST api/<user>
        [HttpPost]
        public IActionResult Post([FromBody] User request)
        {
            try
            {
                Function.TraceLog("/api/user/", "[POST] Create new user " , "Start creating new user");
                if (request.Save())
                {
                    var responseObject = new
                    {
                        message = "Succes creating new user",
                        StatusCode = 200 // Custom status code
                    };
                    Function.TraceLog("/api/user/", "[POST] Create new user ", "Success creating new user");
                    return StatusCode(200, responseObject);
                }
                return BadRequest("Failed creating new user");
            }
            catch(Exception ex)
            {
                Function.TraceLog("/api/user/", "[POST] Create new user ", "Error creating new user "+ex.Message);
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
                    Function.TraceLog("/api/user/", "[PUT] Update user profile "+id, "Start update user profile");
                    string namaLengkap = body.GetProperty("namaLengkap").GetString();
                    string username = body.GetProperty("username").GetString();
                    string role = body.GetProperty("role").GetString();
                    string email=body.GetProperty("email").GetString();
                    string password = body.GetProperty("password").GetString();
                    User request = new User(namaLengkap, username, email,password, role, true);
                    User existing = Dashboard_Project.Models.User.Get(request.namaLengkap);
                    PasswordManager passwordManager = new();
                    if (existing != null)
                    {
                        if (passwordManager.VerifyPassword(existing.password,request.password,existing.salt))
                        {
                            if (request.Update())
                            {
                                Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Success update user profile");
                                return Ok("Success updating user profile");
                            }
                            Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Failed update user profile");
                            return BadRequest("Failed to update user profile");
                        }
                        Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Incorrect password and failed to update user profile");
                        return BadRequest("Incorect password");
                    }
                    Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "User not found");
                    return NotFound("User Not Found");
                }
                catch (Exception ex)
                {
                    Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Error updating user profile "+ex.Message);
                    return StatusCode(500, "Error while updating user profile");
                }
            }
            else
            {
                try
                {
                    Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Start changing password");
                    string namaLengkap = body.GetProperty("namaLengkap").GetString();
                    string password = body.GetProperty("password").GetString();
                    string newPassword = body.GetProperty("newPassword").GetString();
                    User existing = Dashboard_Project.Models.User.Get(namaLengkap);
                    PasswordManager passwordManager = new();
                    if (existing != null)
                    {
                        if (passwordManager.VerifyPassword(existing.password, password, existing.salt))
                        {
                            string hashedPassword = passwordManager.HashPassword(newPassword, existing.salt);
                            existing.password = hashedPassword;
                            if (existing.ChangePassword())
                            {
                                Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Successs changing password");
                                return Ok("Success changing password");
                            }
                            Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Failed changing password");
                            return BadRequest("Failed to change password");
                        }
                        Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Incorrect password and failed to changing password");
                        return BadRequest("Incorect password");
                    }
                    Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "User Not Found");
                    return BadRequest("User Not Found");
                }catch(Exception ex)
                {
                    Function.TraceLog("/api/user/", "[PUT] Update user profile " + id, "Error changin user password");
                    return StatusCode(500, "Error while changing user password");
                }
            }
         
        }
        // DELETE api/<user>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
