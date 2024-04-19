using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Dashboard_Project.Models
{
    public class ResponseService
    {
        public string err_code { get; set; }
        public string err_message { get; set; }
        public string catch_message { get; set; }
        public string server { get; set; }
        public string port { get; set; }
        public string db { get; set; }
        public ResponseService() { }
        public ResponseService(string err_code, string err_message, string catch_message, string server, string port, string db)
        {
            this.err_code = err_code;
            this.err_message = err_message;
            this.catch_message = catch_message;
            this.server = server;
            this.port = port;
            this.db = db;
        }
    }
}
