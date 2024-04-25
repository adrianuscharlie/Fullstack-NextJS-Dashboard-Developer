using System;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Threading.Tasks;
using Dashboard_Project.Models;
using System.Data.Common;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Dashboard_Project.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class heartbit : ControllerBase
    {
        // GET: api/<ValuesController>
        [HttpGet]
        public async Task <IActionResult> Get()
        {
            ResponseService responseService = new ResponseService();

            try
            {
                Function.TraceLog("/api/heartbit", "[GET] Heartbit ", "Start Heartbit");
                using (MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    var connectionStringBuilder = new MySqlConnectionStringBuilder(connection.ConnectionString);

                    // Extract server, database, and port from the ConnectionStringBuilder
                    string server = connectionStringBuilder.Server;
                    string database = connectionStringBuilder.Database;
                    int port = (int)connectionStringBuilder.Port;

                    responseService.server = server;
                    responseService.db = database;
                    responseService.port = port.ToString();

                    connection.Open();
                    responseService.err_code = "0";
                    responseService.err_message = "Sukses";
                    responseService.catch_message = "";
                    responseService.port = "";
                    responseService.server = "";
                    responseService.db = "";
                    Function.TraceLog("/api/heartbit", "[GET] Heartbit ", "Success Heartbit");
                    return Ok(responseService);
                }
            }

            catch (Exception ex)
            {
                responseService.err_code = "i303";
                responseService.err_message = "Gagal connect ke DB";
                responseService.catch_message = ex.Message;
                Function.TraceLog("/api/heartbit", "[GET] Heartbit ", "Error Heartbit");
                return StatusCode(500, responseService);
            }
        }


    }
}
