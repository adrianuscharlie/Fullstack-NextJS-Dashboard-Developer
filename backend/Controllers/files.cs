using Microsoft.AspNetCore.Mvc;
using Dashboard_Project.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dashboard_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class files : ControllerBase
    {
        // GET: api/<files>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Files> files = new List<Files>();
                files = Files.All();
                if(files.Count == 0)
                {
                    return BadRequest("No Files retrived");
                }
                return Ok(files);

            }catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return StatusCode(500, "Error to get All Files");
            }
        }

        // GET api/<files>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            return Ok();
        }

        // POST api/<files>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] IFormCollection form)
        {
            try
            {
                var headerJson = form["header"].ToString();
                dynamic header = JsonConvert.DeserializeObject<dynamic>(headerJson);

                var files = form.Files;

                foreach(var file in files)
                {
                    var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "files/"+header.folder);
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                        Console.WriteLine("Folder created at :" + folderPath);
                    }
                    folderPath = folderPath  +"/"+header.version;
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                        Console.WriteLine("Folder created at :" + folderPath);
                    }

                    string filePath = Path.Combine(folderPath, file.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    Console.WriteLine("File Saved at " + filePath);

                    Files fileObject = new Files((string)file.FileName,(string) header.id,(string) header.project_name,(string) header.version, filePath);
                    bool success = fileObject.Save();
                }

                return Ok("Success saving files");
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return StatusCode(500, "Failed to save file");
            }
        }

        // PUT api/<files>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<files>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
