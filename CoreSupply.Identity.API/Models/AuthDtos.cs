using System.ComponentModel.DataAnnotations;

namespace CoreSupply.Identity.API.Models
{
    // مدل ورودی برای ثبت‌نام
    public class RegisterRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; } 
    }


    public class LoginRequestDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    // مدل خروجی که توکن را برمی‌گرداند
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public DateTime Expiration { get; set; }
    }
}
