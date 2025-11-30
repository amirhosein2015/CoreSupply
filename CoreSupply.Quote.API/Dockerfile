# مرحله اول: استفاده از ایمیج SDK برای ساخت (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# 👆 WORKDIR /src مسیر داخلی کانتینر است و ارتباطی به پوشه src حذف شده در کامپیوتر شما ندارد.

# 1. کپی فایل Solution
# Context: ریشه پروژه (CoreSupply)
COPY CoreSupply.sln .

# 2. کپی فایل‌های پروژه (.csproj) برای بازیابی وابستگی‌ها (Restore)
# 🎯 مسیردهی اکنون به صورت "ProjectFolder/ProjectFile.csproj" است (ساختار فلت).
COPY CoreSupply.Quote.API/CoreSupply.Quote.API.csproj CoreSupply.Quote.API/
COPY CoreSupply.Catalog.API/CoreSupply.Catalog.API.csproj CoreSupply.Catalog.API/
# اگر Quote.API به پروژه‌های دیگری وابسته است، آن .csprojها هم باید اینجا کپی شوند.

# 3. اجرای Restore (بازیابی وابستگی‌ها)
RUN dotnet restore CoreSupply.Quote.API/CoreSupply.Quote.API.csproj

# 4. کپی کردن تمام فایل‌های سورس (تمام محتوای ریشه پروژه)
COPY . .

# 5. انتشار (Publish) پروژه به حالت Release
WORKDIR "/src/CoreSupply.Quote.API"
RUN dotnet publish "CoreSupply.Quote.API.csproj" -c Release -o /app/publish

# مرحله دوم: استفاده از ایمیج کم‌حجم‌تر و بهینه‌شده برای اجرا (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
# پورت داخلی کانتینر برای Quote API
EXPOSE 8081 

# کپی کردن فایل‌های منتشر شده از مرحله Build
COPY --from=build /app/publish .

# اجرای برنامه
ENTRYPOINT ["dotnet", "CoreSupply.Quote.API.dll"]