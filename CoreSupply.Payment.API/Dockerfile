# Stage 1: Base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["CoreSupply.Payment.API/CoreSupply.Payment.API.csproj", "CoreSupply.Payment.API/"]
COPY ["CoreSupply.BuildingBlocks/CoreSupply.BuildingBlocks.csproj", "CoreSupply.BuildingBlocks/"]

RUN dotnet restore "./CoreSupply.Payment.API/CoreSupply.Payment.API.csproj"

COPY . .
WORKDIR "/src/CoreSupply.Payment.API"
RUN dotnet build "./CoreSupply.Payment.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CoreSupply.Payment.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Payment.API.dll"]
