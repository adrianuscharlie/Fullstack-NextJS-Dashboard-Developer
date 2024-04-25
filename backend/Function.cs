using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
namespace Dashboard_Project
{
    public class Function
    {


        public static string GetConfiguration(string settings)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .Build();

            string connectionString = configuration[settings];
            return connectionString;
        }


        public static void TraceLog(string api, string action, string message)
        {
            try
            {
                using(MySqlConnection connection = new(GetConfiguration("ApplicationSettings:connectionString")))
                {
                    using(MySqlCommand command=new("INSERT INTO TRACELOG (api,action,message,date) VALUES (@Api,@Action,@Message,now())",connection))
                    {
                        connection.Open();
                        command.Parameters.AddWithValue("@Api", api);
                        command.Parameters.AddWithValue("@Action",action);
                        command.Parameters.AddWithValue("@Message", message);
                        command.ExecuteNonQuery();
                    }
                }
            }catch (Exception ex)
            {

            }
        }


    }
}
