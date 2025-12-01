# ایمیج پایه (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

# ایمیج بیلد (SDK)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# کپی کردن فایل‌های پروژه
COPY ["CoreSupply.Ordering.API/CoreSupply.Ordering.API.csproj", "CoreSupply.Ordering.API/"]
COPY ["CoreSupply.BuildingBlocks/CoreSupply.BuildingBlocks.csproj", "CoreSupply.BuildingBlocks/"]

# بازیابی پکیج‌ها
RUN dotnet restore "./CoreSupply.Ordering.API/CoreSupply.Ordering.API.csproj"

# کپی کردن کل سورس کد
COPY . .
WORKDIR "/src/CoreSupply.Ordering.API"
RUN dotnet build "./CoreSupply.Ordering.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# انتشار نهایی
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CoreSupply.Ordering.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# اجرای نهایی
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Ordering.API.dll"]
