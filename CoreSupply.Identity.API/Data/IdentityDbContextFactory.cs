using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CoreSupply.Identity.API.Data
{
    // این کلاس فقط موقعی که دستور dotnet ef را می‌زنید اجرا می‌شود
    // تا مشکل پیدا نکردن تنظیمات را حل کند
    public class IdentityDbContextFactory : IDesignTimeDbContextFactory<IdentityContext>
    {
        public IdentityContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<IdentityContext>();

            // این یک کانکشن موقت است که فقط برای ساخت فایل مایگریشن استفاده می‌شود
            // اهمیت ندارد که درست باشد یا نه، فقط فرمت آن مهم است
            // اضافه کردن Port=6433 برای اتصال از بیرون داکر
            optionsBuilder.UseNpgsql("Host=localhost;Port=6433;Database=identitydb;Username=admin;Password=Password12!");


            return new IdentityContext(optionsBuilder.Options);
        }
    }
}
