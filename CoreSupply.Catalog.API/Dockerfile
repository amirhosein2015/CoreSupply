# Stage 1: Base Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# کپی کردن فایل پروژه کاتالوگ
COPY ["CoreSupply.Catalog.API/CoreSupply.Catalog.API.csproj", "CoreSupply.Catalog.API/"]

# بازیابی پکیج‌ها
RUN dotnet restore "./CoreSupply.Catalog.API/CoreSupply.Catalog.API.csproj"

# کپی کردن کل کدها
COPY . .

# بیلد کردن پروژه
WORKDIR "/src/CoreSupply.Catalog.API"
RUN dotnet build "./CoreSupply.Catalog.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CoreSupply.Catalog.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Catalog.API.dll"]
