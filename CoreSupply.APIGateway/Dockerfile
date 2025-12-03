# Stage 1: Runtime (Base)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Stage 2: Build (SDK)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# 1. Copy Project Files
COPY ["CoreSupply.APIGateway/CoreSupply.APIGateway.csproj", "CoreSupply.APIGateway/"]
COPY ["CoreSupply.BuildingBlocks/CoreSupply.BuildingBlocks.csproj", "CoreSupply.BuildingBlocks/"]

# 2. Restore Dependencies
RUN dotnet restore "./CoreSupply.APIGateway/CoreSupply.APIGateway.csproj"

# 3. Copy Source Code
COPY . .

# 4. Build & Publish
WORKDIR "/src/CoreSupply.APIGateway"
RUN dotnet build "./CoreSupply.APIGateway.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CoreSupply.APIGateway.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.APIGateway.dll"]
