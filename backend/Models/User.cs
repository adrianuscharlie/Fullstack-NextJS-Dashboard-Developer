using MySql.Data.MySqlClient;

namespace Dashboard_Project.Models
{
    public class User
    {
        public string namaLengkap {  get; set; }
        public string username { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public bool isActive { get; set; }

        public User() { }

        public User (string namaLengkap, string username, string email,string password, string role, bool isActive)
        {
            this.namaLengkap = namaLengkap;
            this.username = username;
            this.email = email;
            this.password = password;
            this.role = role;
            this.isActive = isActive;
        }


        public  bool Save()
        {
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    string query = "INSERT INTO USERS (username,password,email,namaLengkap,isActive,role) VALUES (@Username,@Password,@Email,@NamaLengkap,@IsActive,@Role)";
                    using(MySqlCommand command = new(query, connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@Username", username);
                        command.Parameters.AddWithValue("@Password", password);
                        command.Parameters.AddWithValue("@Email", email);
                        command.Parameters.AddWithValue("@NamaLengkap", namaLengkap);
                        command.Parameters.AddWithValue("@IsActive", isActive);
                        command.Parameters.AddWithValue("@Role", role);
                        int success=command.ExecuteNonQuery();
                        if (success > 0) return true;
                        else return false;
                    }
                }
            }catch(Exception ex)
            {
                return false;
            }
        }
        
        public static User Get(string namaLengkap)
        {
            User user = null;
            try
            {
                using(MySqlConnection connection = new(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using(MySqlCommand command=new("SELECT * FROM USERS WHERE namaLengkap=@NamaLengkap", connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@NamaLengkap", namaLengkap);
                        using(MySqlDataReader reader = command.ExecuteReader())
                        {
                            if(reader.Read())
                            {
                                user = new User
                                {
                                    username=reader.GetString("username"),
                                    namaLengkap=namaLengkap,
                                    email=reader.GetString("email"),
                                    role=reader.GetString("role"),
                                    isActive=reader.GetBoolean("isActive"),
                                    password=reader.GetString("password")
                                };
                            }
                        }
                    }
                }
            }catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return user;
        }


        public bool Update()
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    string query = "UPDATE USERS SET  username=@Username, email = @Email, namaLengkap = @NamaLengkap, isActive = @IsActive, role = @Role WHERE namaLengkap = @NamaLengkap";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@Username", username);
                        command.Parameters.AddWithValue("@Email", email);
                        command.Parameters.AddWithValue("@NamaLengkap", namaLengkap);
                        command.Parameters.AddWithValue("@IsActive", isActive);
                        command.Parameters.AddWithValue("@Role", role);
                        int success = command.ExecuteNonQuery();
                        if (success > 0) return true;
                        else return false;
                    }
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public bool ChangePassword()
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(Function.GetConfiguration("ApplicationSettings:connectionString")))
                {
                    string query = "UPDATE USERS SET  password=@Password WHERE namaLengkap = @NamaLengkap";
                    using (MySqlCommand command = new MySqlCommand(query, connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@Password", password);
                        command.Parameters.AddWithValue("@NamaLengkap", namaLengkap);
                        int success = command.ExecuteNonQuery();
                        if (success > 0) return true;
                        else return false;
                    }
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }



    }
}
