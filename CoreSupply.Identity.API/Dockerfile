# استفاده از ایمیج پایه دات‌نت 8
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

# مرحله بیلد
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# کپی کردن فایل پروژه (با توجه به ساختار فلت)
COPY ["CoreSupply.Identity.API/CoreSupply.Identity.API.csproj", "CoreSupply.Identity.API/"]
COPY ["CoreSupply.BuildingBlocks/CoreSupply.BuildingBlocks.csproj", "CoreSupply.BuildingBlocks/"]
# بازیابی پکیج‌ها
RUN dotnet restore "./CoreSupply.Identity.API/CoreSupply.Identity.API.csproj"

# کپی کردن باقی فایل‌ها
COPY . .
WORKDIR "/src/CoreSupply.Identity.API"
RUN dotnet build "./CoreSupply.Identity.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# مرحله انتشار
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CoreSupply.Identity.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# مرحله نهایی
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Identity.API.dll"]
