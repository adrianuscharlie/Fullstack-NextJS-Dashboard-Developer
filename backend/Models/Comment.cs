using MySql.Data.MySqlClient;
using Dashboard_Project;
using System.Runtime.CompilerServices;
using Org.BouncyCastle.Utilities;
namespace Dashboard_Project.Models
{
    public class Comment
    {
        public string id { get; set; } = "";
        public string project_name { get; set; }
        public string version { get; set; }
        public string author { get; set; }
        public string text { get; set; }
        public string filePath { get; set; }
        public string status { get; set; }
        public DateTime date { get; set; }

        public Comment(string projectName, string author, string text, string version, string status, string filePath)
        {
            this.project_name = projectName;
            this.author = author;
            this.text = text;
            this.version = version;
            this.filePath = filePath;
            this.status = status;
        }
        public Comment(string id, string project_name, string version, string author, string text, string filePath, string status, DateTime date)
        {
            this.id = id;
            this.project_name = project_name;
            this.version = version;
            this.author = author;
            this.text = text;
            this.filePath = filePath;
            this.status = status;
            this.date = date;
        }


        public Comment() { }

        public static List<Comment> All()
        {
            List <Comment> comments= new List<Comment>();
            try
            {
                using (MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using (MySqlCommand command = new("SELECT * FROM COMMENT ORDER BY id DESC", connection))
                    {
                        connection.Open();
                        using(MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Comment comment = new Comment
                                {
                                    id = reader.GetInt32("id").ToString(),
                                    project_name = reader.GetString("project_name"),
                                    version= reader.GetString("version"),
                                    author=reader.GetString("author"),
                                    text=reader.GetString("text"),
                                    filePath=reader.GetString("filePath"),
                                    status=reader.GetString("status"),
                                    date=reader.GetDateTime("date")
                                };
                                comments.Add(comment);
                            }
                        }
                    }
                }
               
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return comments;
        }

        public static List<Comment> FindByNameAndVersion(string project_name,string version)
        {
            List<Comment> comments = new List<Comment>();
            try
            {
                using (MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using (MySqlCommand command = new($"SELECT * FROM COMMENT WHERE project_name='{project_name}' AND version='{version}' ORDER BY id DESC", connection))
                    {
                        connection.Open();
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Comment comment = new Comment
                                {
                                    id = reader.GetInt32("id").ToString(),
                                    project_name = reader.GetString("project_name"),
                                    version = reader.GetString("version"),
                                    author = reader.GetString("author"),
                                    text = reader.GetString("text"),
                                    filePath = reader.GetString("filePath"),
                                    status = reader.GetString("status"),
                                    date = reader.GetDateTime("date")
                                };
                                comments.Add(comment);
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return comments;
        }

        public int Save()
        {
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    string query= "INSERT INTO COMMENT (project_name,version,author,text,filePath,status,date) VALUES (@ProjectName,@Version,@Author,@Text,@FilePath,@Status,@Date)";
                    using (MySqlCommand command = new(query,connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@ProjectName", project_name);
                        command.Parameters.AddWithValue("@Version", version);
                        command.Parameters.AddWithValue("@Author", author);
                        command.Parameters.AddWithValue("@Text", text);
                        command.Parameters.AddWithValue("@FilePath", filePath);
                        command.Parameters.AddWithValue("@Status", status);
                        command.Parameters.AddWithValue("@Date", DateTime.Now);
                        int sucess = Convert.ToInt32(command.ExecuteNonQuery());
                        return sucess;
                    }
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return -1;
            }
        }

        public static bool DeleteProjectComment(string project_name,string version)
        {
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using(MySqlCommand command=new($"delete from comment where project_name='{project_name}' and version='{version}'", connection))
                    {
                        connection.Open();
                        int success = command.ExecuteNonQuery();
                        if (success > 0) return true;
                        else return false;
                    }
                }
            }catch(Exception ex)
            {
                return false;
            }
        }
    }
}
