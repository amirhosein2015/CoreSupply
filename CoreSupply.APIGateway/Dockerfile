# مرحله اول: استفاده از ایمیج SDK برای ساخت (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src


# 1. کپی فایل Solution
# Solution در ریشه پروژه است
COPY CoreSupply.sln .

# 2. کپی فایل پروژه Gateway (مسیر جدید)
# پروژه Gateway اکنون داخل src است.
COPY src/CoreSupply.APIGateway/CoreSupply.APIGateway.csproj src/CoreSupply.APIGateway/

# 3. کپی فایل پروژه‌های وابسته (مسیر جدید)
# سرویس‌های Catalog و Quote نیز داخل src هستند.
COPY src/CoreSupply.Catalog.API/CoreSupply.Catalog.API.csproj src/CoreSupply.Catalog.API/
COPY src/CoreSupply.Quote.API/CoreSupply.Quote.API.csproj src/CoreSupply.Quote.API/
# ... هر پروژه دیگری که در Solution شما وجود دارد

# اجرای Restore (بازیابی وابستگی‌ها)
RUN dotnet restore src/CoreSupply.APIGateway/CoreSupply.APIGateway.csproj

# 4. کپی کردن تمام فایل‌های سورس (از ریشه Build)
COPY . .

# 5. انتشار (Publish) پروژه به حالت Release
# تغییر WORKDIR به مسیر نهایی پروژه داخل کانتینر
WORKDIR "/src/src/CoreSupply.APIGateway"
RUN dotnet publish "CoreSupply.APIGateway.csproj" -c Release -o /app/publish

# مرحله دوم: استفاده از ایمیج کم‌حجم‌تر و بهینه‌شده برای اجرا (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80

# کپی کردن فایل‌های منتشر شده از مرحله Build
COPY --from=build /app/publish .

# اجرای برنامه
ENTRYPOINT ["dotnet", "CoreSupply.APIGateway.dll"]