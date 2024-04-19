using MySql.Data.MySqlClient;
using Dashboard_Project;
using System.Runtime.CompilerServices;

namespace Dashboard_Project.Models
{
    public class Project
    {

        public  string project_name { get; set; }
        public  string developer {  get; set; }
        public  string support { get; set; }
        public  string notes { get; set; }
        public string status { get; set; }
        public  string version { get; set; }
        public  string businessAnalyst { get; set; }
        public  string details {  get; set; }

        public Project() { }

        public Project(string project_name,string developer, string support ,string notes,string status, string version, string businessAnalyst, string details)
        {
            this.project_name=project_name;
            this.developer=developer;
            this.support=support;
            this.notes=notes;
            this.status=status;
            this.version=version;
            this.businessAnalyst=businessAnalyst;
            this.details=details;
        }

        public  static List<Project> All()
        {
            List<Project> projects = new List<Project>();
            try
            {
                using (MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using (MySqlCommand command = new("SELECT * FROM project ORDER BY project_name ASC,version DESC", connection))
                    {
                        connection.Open();
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Project project = new Project
                                {
                                    project_name = reader.GetString("project_name"),
                                    developer = reader.GetString("developer"),
                                    support = reader.GetString("support"),
                                    notes = reader.GetString("notes"),
                                    status = reader.GetString("status"),
                                    version = reader.GetString("version"),
                                    businessAnalyst = reader.GetString("businessAnalyst"),
                                    details = reader.GetString("details")
                                };
                                projects.Add(project);
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            return projects;
        }

        public  static List<Project> FindByNamaLengkap(string namaLengkap)
        {
            List<Project> projects = new List<Project>();
            try
            {
                using (MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using (MySqlCommand command = new($"SELECT * FROM project WHERE developer='{namaLengkap}' or support='{namaLengkap}' ORDER BY project_name ASC,version DESC", connection))
                    {
                        connection.Open();
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Project project = new Project
                                {
                                    project_name = reader.GetString("project_name"),
                                    developer = reader.GetString("developer"),
                                    support = reader.GetString("support"),
                                    notes = reader.GetString("notes"),
                                    status = reader.GetString("status"),
                                    version = reader.GetString("version"),
                                    businessAnalyst = reader.GetString("businessAnalyst"),
                                    details = reader.GetString("details")
                                };
                                projects.Add(project);
                            }
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return projects;
        }

        public bool  Save()
        {
            try
            {
                using (MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    string query = "INSERT INTO PROJECT (project_name,developer,support,notes,status,version,businessAnalyst,details) VALUES (@ProjectName,@Developer,@Support,@Notes,@Status,@Version,@BusinessAnalyst,@Details)";
                    using (MySqlCommand command = new(query, connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@ProjectName", project_name);
                        command.Parameters.AddWithValue("@Developer", developer);
                        command.Parameters.AddWithValue("@Support", support);
                        command.Parameters.AddWithValue("@Notes", notes);
                        command.Parameters.AddWithValue("@Status", status);
                        command.Parameters.AddWithValue("@Version", version);
                        command.Parameters.AddWithValue("@BusinessAnalyst", businessAnalyst);
                        command.Parameters.AddWithValue("@Details", details);
                        int sucess = command.ExecuteNonQuery();
                        if (sucess > 0) return true;
                        else return false;
                    }
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        public static Project FindSpecific(string project_name,string version)
        {
            Project project = null;
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using(MySqlCommand command=new("SELECT * FROM project WHERE project_name=@ProjectName and version=@Version", connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@ProjectName", project_name);
                        command.Parameters.AddWithValue("@Version", version);
                        using(MySqlDataReader reader = command.ExecuteReader())
                        {
                            if(reader.Read())
                            {
                                project = new Project
                                {
                                    project_name = reader.GetString("project_name"),
                                    developer = reader.GetString("developer"),
                                    support = reader.GetString("support"),
                                    notes = reader.GetString("notes"),
                                    status = reader.GetString("status"),
                                    version = reader.GetString("version"),
                                    businessAnalyst = reader.GetString("businessAnalyst"),
                                    details = reader.GetString("details")

                                };
                            }
                        }
                    }
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return project;
        }


        public static bool  UpdateStatus(string project_name,string version,string status)
        {
            try
            {
                using (MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using(MySqlCommand command=new($"UPDATE project SET status='{status}' WHERE project_name = '{project_name}' and version='{version}'"))
                    {
                        connection.Open();
                        int success=command.ExecuteNonQuery();
                        if (success > 0) return true;
                        else return false;
                    }
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.Message.ToString());
                return false;
            }
        }

        public static bool Delete(string project_name,string version)
        {
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using(MySqlCommand command=new($"DELETE FROM project WHERE project_name='{project_name}' and version='{version}'",connection))
                    {
                        connection.Open();
                        int success=command.ExecuteNonQuery();
                        Comment.DeleteProjectComment(project_name, version);
                        if (success > 0) return true;
                        else return false;
                    }
                }
                

            }catch( Exception ex )
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        public bool Update()
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    string query = "UPDATE PROJECT SET developer = @Developer, support = @Support, notes = @Notes, status = @Status, businessAnalyst = @BusinessAnalyst, details = @Details WHERE project_name = @ProjectName AND version = @Version";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ProjectName", project_name);
                        command.Parameters.AddWithValue("@Developer", developer);
                        command.Parameters.AddWithValue("@Support", support);
                        command.Parameters.AddWithValue("@Notes", notes);
                        command.Parameters.AddWithValue("@Status", status);
                        command.Parameters.AddWithValue("@Version", version);
                        command.Parameters.AddWithValue("@BusinessAnalyst", businessAnalyst);
                        command.Parameters.AddWithValue("@Details", details);

                        connection.Open();
                        int success = command.ExecuteNonQuery();
                        return success > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

    }
}
