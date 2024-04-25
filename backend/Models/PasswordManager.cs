using System;
using System.Security.Cryptography;
using System.Text;

namespace Dashboard_Project.Models
{
    public class PasswordManager
    {
        public string HashPassword(string password, string salt)
        {
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password + salt);
            using (var sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(passwordBytes);
                return Convert.ToBase64String(hashedBytes);
            }
        }

        public bool VerifyPassword(string hashedPassword, string inputPassword, string salt)
        {
            string hashedInputPassword = HashPassword(inputPassword, salt);
            return hashedInputPassword == hashedPassword;
        }

        public string GenerateSalt()
        {
            byte[] saltBytes = new byte[16];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }
    }
}
