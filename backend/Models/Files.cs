using MySql.Data.MySqlClient;
using Org.BouncyCastle.Utilities;

namespace Dashboard_Project.Models
{
    public class Files
    {
        public string fileName { get; set; }
        public string commentID { get; set; }
        public string project_name { get; set; }
        public string version { get; set; }
        public string filePath { get; set; }

        public Files() { }

        public Files (string fileName, string commentID, string project_name, string version, string filePath)
        {
            this.fileName = fileName;
            this.commentID = commentID;
            this.project_name = project_name;
            this.version = version;
            this.filePath = filePath;
        }


        public static List<Files> All()
        {
            List<Files> files = new();
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using(MySqlCommand command=new("SELECT * FROM FILES", connection))
                    {
                        connection.Open();
                        using(MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Files file = new Files
                                {
                                    fileName = reader.GetString("fileName"),
                                    commentID = reader.GetString("commentID"),
                                    project_name = reader.GetString("project_name"),
                                    version = reader.GetString("version"),
                                    filePath = reader.GetString("filePath")
                                };
                                files.Add(file);
                            }
                        }
                    }
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return files;
        }


        public static Files SingleDownload(string commentID)
        {
            Files file = null;
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using(MySqlCommand command=new($"SELECT * FROM FILES WHERE commentID='{commentID}'", connection))
                    {
                        connection.Open();
                        using(MySqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                file = new Files
                                {
                                    fileName = reader.GetString("fileName"),
                                    commentID = reader.GetString("commentID"),
                                    project_name = reader.GetString("project_name"),
                                    version = reader.GetString("version"),
                                    filePath = reader.GetString("filePath")
                                };
                            }
                        }
                    }
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return file;
        }

        public  bool Save()
        {
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("applicationSettings:ConnectionString")))
                {
                    string query = "INSERT INTO FILES (fileName,commentID,project_name,version,filePath) VALUES (@FileName,@CommentID,@ProjectName,@Version,@FilePath)";
                    using(MySqlCommand command = new(query, connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@ProjectName", project_name);
                        command.Parameters.AddWithValue("@FileName", fileName);
                        command.Parameters.AddWithValue("@CommentID", commentID);
                        command.Parameters.AddWithValue("@Version", version);
                        command.Parameters.AddWithValue("@FilePath", filePath);
                        int success = command.ExecuteNonQuery();
                        if (success > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return false;
            }
        }
    }
}
