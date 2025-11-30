# مرحله اول: استفاده از ایمیج SDK برای ساخت (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. کپی فایل Solution
# Solution در ریشه کانتینر (/src) کپی می‌شود.
COPY CoreSupply.sln .

# 2. کپی فایل‌های پروژه (.csproj) برای بازیابی وابستگی‌ها (Restore)
# 🎯 FIX: مسیردهی اکنون به صورت "ProjectFolder/ProjectFile.csproj" است (بدون src/).
COPY CoreSupply.APIGateway/CoreSupply.APIGateway.csproj CoreSupply.APIGateway/
COPY CoreSupply.Catalog.API/CoreSupply.Catalog.API.csproj CoreSupply.Catalog.API/
COPY CoreSupply.Quote.API/CoreSupply.Quote.API.csproj CoreSupply.Quote.API/

# اجرای Restore (بازیابی وابستگی‌ها)
RUN dotnet restore CoreSupply.APIGateway/CoreSupply.APIGateway.csproj

# 3. کپی کردن تمام فایل‌های سورس (از ریشه Build)
# تمام پوشه‌های پروژه (CoreSupply.APIGateway، CoreSupply.Catalog.API و CoreSupply.Quote.API) کپی می‌شوند.
COPY . .

# 4. انتشار (Publish) پروژه به حالت Release
# 🎯 FIX: WORKDIR اکنون به مسیر صحیح داخل کانتینر تنظیم شده است.
WORKDIR "/src/CoreSupply.APIGateway"
RUN dotnet publish "CoreSupply.APIGateway.csproj" -c Release -o /app/publish

# مرحله دوم: استفاده از ایمیج کم‌حجم‌تر و بهینه‌شده برای اجرا (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80

# کپی کردن فایل‌های منتشر شده از مرحله Build
COPY --from=build /app/publish .

# اجرای برنامه
ENTRYPOINT ["dotnet", "CoreSupply.APIGateway.dll"]