# Stage 1: Base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8081

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# 1. کپی کردن فایل پروژه Quote (دقت کنید اسمش درست باشد)
COPY ["CoreSupply.Quote.API/CoreSupply.Quote.API.csproj", "CoreSupply.Quote.API/"]
# 2. کپی کردن پروژه مشترک (چون رفرنس دارد)
COPY ["CoreSupply.BuildingBlocks/CoreSupply.BuildingBlocks.csproj", "CoreSupply.BuildingBlocks/"]

# بازیابی پکیج‌ها
RUN dotnet restore "./CoreSupply.Quote.API/CoreSupply.Quote.API.csproj"

# کپی سورس کد
COPY . .
WORKDIR "/src/CoreSupply.Quote.API"
RUN dotnet build "./CoreSupply.Quote.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CoreSupply.Quote.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Quote.API.dll"]
