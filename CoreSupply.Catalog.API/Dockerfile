# Dockerfile for CoreSupply.Quote.API
#
# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
# 👆 این مسیر داخلی کانتینر است و باید باقی بماند

# 1. Copy Solution File (.sln) and all Project Files (.csproj)
# مسیر کپی کردن از کامپیوتر شما به داخل کانتینر:
COPY ["CoreSupply.sln", "."]
COPY ["CoreSupply.Quote.API/CoreSupply.Quote.API.csproj", "CoreSupply.Quote.API/"]
COPY ["CoreSupply.Catalog.API/CoreSupply.Catalog.API.csproj", "CoreSupply.Catalog.API/"]


# 2. Restore dependencies
RUN dotnet restore "CoreSupply.Quote.API/CoreSupply.Quote.API.csproj"

# 3. Copy the rest of the source code
COPY . .

# 4. Publish the project
WORKDIR /src/CoreSupply.Quote.API
RUN dotnet publish "CoreSupply.Quote.API.csproj" -c Release -o /app/publish

# Stage 2: Publish the application (Final Image)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
# Copy the published output from the build stage
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Quote.API.dll"]