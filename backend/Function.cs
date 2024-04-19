using Microsoft.Extensions.Configuration;
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

    }
}
