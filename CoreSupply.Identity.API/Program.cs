using CoreSupply.Identity.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// حل مشکل خطای 500 (SignInManager نیاز به این سرویس دارد)
builder.Services.AddHttpContextAccessor();

// 2. Database Configuration
var connectionString = builder.Configuration.GetValue<string>("DatabaseSettings:ConnectionString");
builder.Services.AddDbContext<IdentityContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Identity Configuration (API Best Practice)
// به جای AddIdentity از AddIdentityCore استفاده می‌کنیم که برای API مناسب‌تر است
builder.Services.AddIdentityCore<IdentityUser>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequiredLength = 6;
})
.AddRoles<IdentityRole>() // اضافه کردن نقش‌ها
.AddEntityFrameworkStores<IdentityContext>()
.AddSignInManager<SignInManager<IdentityUser>>() // *** رفع خطای UserManager/SignInManager ***
.AddUserManager<UserManager<IdentityUser>>()     // *** رفع خطای UserManager ***
.AddDefaultTokenProviders();

// 4. Authentication Configuration (JWT)
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.ASCII.GetBytes(jwtSettings.GetValue<string>("Secret"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
        ValidateAudience = true,
        ValidAudience = jwtSettings.GetValue<string>("Audience"),
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// 5. Pipeline Configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// اعمال اتوماتیک مایگریشن‌ها
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<IdentityContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        // لاگ کردن خطا اگر دیتابیس وصل نشد
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();
