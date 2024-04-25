using Microsoft.AspNetCore.Mvc;
using Dashboard_Project.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.AspNetCore.StaticFiles;

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
                Function.TraceLog("/api/files", "[GET] All Files", "Start Getting All Files");
                List<Files> files = new List<Files>();
                files = Files.All();
                if(files.Count != 0)
                {
                    Function.TraceLog("/api/files", "[GET] All Files", "Success Getting All Files");
                    return Ok(files);
                    
                }
                Function.TraceLog("/api/files", "[GET] All Files", "Failed Getting All Files");
                return NotFound("No Files retrived");
            }
            catch(Exception ex)
            {
                Function.TraceLog("/api/files", "[GET] All Files", "Error Getting All Files "+ex.Message);
                return StatusCode(500, "Error to get All Files");
            }
        }
        [HttpGet("comments/{id}")]
        public IActionResult GetUserProjects(string id)
        {
            try
            {
                Function.TraceLog("/api/files/comments/" + id, "[GET] Files by CommentID", "Start getting all files by commentID");
                List<Files> files = Files.FindByCommentID(id);
                if (files != null && files.Count > 0)
                {
                    Function.TraceLog("/api/files/comments/" + id, "[GET] Files by CommentID", "Success getting all files by commentID");
                    return Ok(files);
                }
                Function.TraceLog("/api/files/comments/" + id, "[GET] Files by CommentID", "Failed getting all files by commentID");
                return NotFound("No files retrieved for this comment");
            }
            catch (Exception ex)
            {
                Function.TraceLog("/api/files/comments/" + id, "[GET] Files by CommentID", "Error getting all files by commentID "+ex.Message);
                return StatusCode(500, "Error retrieving projects for user");
            }
        }



        // GET api/<files>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                Function.TraceLog("/api/files/comments/" + id, "[GET] Files by CommentID", "Start getting files by id");
                string[] split = id.Split("_");
                string fileName = split[0];
                string commentID = split[1];
                string projectName = split[2];
                string version = split[3];

                Files file = Files.SingleDownload(commentID);
                if (System.IO.File.Exists(file.filePath))
                {
                    byte[] fileContent = await System.IO.File.ReadAllBytesAsync(file.filePath);
                    string fileExtension = Path.GetExtension(file.filePath);
                    var provider = new FileExtensionContentTypeProvider();
                    string contentType = Files.GetContentType(fileExtension);
                    Function.TraceLog("/api/files/comments/" + id, "[GET] Files by CommentID", "Success getting files by id");
                    return File(fileContent, contentType, file.fileName);
                }
                Function.TraceLog("/api/files/comments/" + id, "[GET] Files by CommentID", "Failed getting files by id");
                return NotFound("File Not Found");
            }
            catch(Exception ex)
            {
                Function.TraceLog("/api/files/comments/" + id, "[GET] Files by CommentID", "Error getting files by id "+ex.Message);
                return StatusCode(500, "Error to downloading file from server");
            }
        }

        // POST api/<files>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] IFormCollection form)
        {
            try
            {
                Function.TraceLog("/api/files/", "[POST] Posting files " , "Start posting files " );
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
                Function.TraceLog("/api/files/", "[POST] Posting files ", "Success posting files ");
                return Ok("Success saving files");
            }
            catch(Exception ex)
            {
                Function.TraceLog("/api/files/", "[POST] Posting files ", "Error posting files "+ex.Message);
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
