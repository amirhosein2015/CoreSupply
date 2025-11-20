# Dockerfile for CoreSupply.Quote.API
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 1. Copy Solution File
# Context: ریشه پروژه (E:\...\CoreSupply)
COPY ["CoreSupply.sln", "."]

# 2. Copy Project File
# مسیر پروژه: CoreSupply.Quote.API/
COPY ["CoreSupply.Quote.API/CoreSupply.Quote.API.csproj", "CoreSupply.Quote.API/"]

# 3. Restore dependencies
RUN dotnet restore "CoreSupply.Quote.API/CoreSupply.Quote.API.csproj"

# 4. Copy Everything
COPY . .

# 5. Publish the project
WORKDIR /src/CoreSupply.Quote.API
RUN dotnet publish "CoreSupply.Quote.API.csproj" -c Release -o /app/publish

# Stage 2: Final Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Quote.API.dll"]