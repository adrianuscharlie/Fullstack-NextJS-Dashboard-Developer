using System.Net;
using System.Net.Mail;
using Dashboard_Project.Controllers;
using static Org.BouncyCastle.Bcpg.Attr.ImageAttrib;

namespace Dashboard_Project.Models
{
    public class Email
    {
        public string subject { get; set; }
        public string body { get; set; }
        public string from { get; set; } = Function.GetConfiguration("ApplicationSettings:EmailUsername");
        public string to { get; set; }
        public string cc { get; set; }
        public List<IFormFile> attachments { get; set; } = new List<IFormFile>();
        public Email() { }

        public Email(string subject, string body, string from, string to, string cc, List<IFormFile> attachments)
        {
            this.subject = subject;
            this.body = body;
            this.from = Function.GetConfiguration("ApplicationSettings:EmailUsername");
            this.to = to;
            this.cc = cc;
            this.attachments = attachments;
        }


        public async Task<bool> SendEmail()
        {
            try
            {
                using(MailMessage email = new())
                {
                    email.From=new MailAddress(from);
                    string[] recipients = to.Split(";");
                    foreach (string recipient in recipients)
                    {
                        if (recipient != "")
                        {
                            email.To.Add(recipient);
                        }
                    }
                    string[] ccs = cc.Split(";");
                    foreach (String cc in ccs)
                    {
                        if (cc != "")
                        {
                            email.CC.Add(cc);
                        }
                    }
                    email.Subject = subject;
                    email.Body = body;
                    if (attachments != null && attachments.Count > 0)
                    {
                        foreach (var file in attachments)
                        {
                            if (file != null && file.Length > 0)
                            {
                                using (MemoryStream ms = new MemoryStream())
                                {
                                    await file.CopyToAsync(ms);
                                    byte[] fileBytes = ms.ToArray();
                                    email.Attachments.Add(new Attachment(new MemoryStream(fileBytes), file.FileName));
                                }
                            }
                        }
                    }

                    using (SmtpClient client=new SmtpClient(Function.GetConfiguration("ApplicationSettings:EmailServerSend")))
                    {
                        client.Port = Convert.ToInt32(Function.GetConfiguration("ApplicationSettings:EmailPortSend"));
                        client.Credentials = new NetworkCredential(Function.GetConfiguration("ApplicationSettings:EmailUserName"), Function.GetConfiguration("ApplicationSettings:EmailPass"));
                        client.EnableSsl = true;
                        client.Send(email);
                    }
                    return true;
                }
            }catch(Exception ex)
            {
                return false;
            }
        }

    }
}
