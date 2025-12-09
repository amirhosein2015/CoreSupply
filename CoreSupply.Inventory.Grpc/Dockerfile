# Stage 1: Base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# کپی کردن فایل‌های پروژه (دقت کنید به مسیر BuildingBlocks)
COPY ["CoreSupply.Inventory.Grpc/CoreSupply.Inventory.Grpc.csproj", "CoreSupply.Inventory.Grpc/"]
COPY ["CoreSupply.BuildingBlocks/CoreSupply.BuildingBlocks.csproj", "CoreSupply.BuildingBlocks/"]

RUN dotnet restore "./CoreSupply.Inventory.Grpc/CoreSupply.Inventory.Grpc.csproj"

COPY . .
WORKDIR "/src/CoreSupply.Inventory.Grpc"
RUN dotnet build "./CoreSupply.Inventory.Grpc.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CoreSupply.Inventory.Grpc.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Inventory.Grpc.dll"]
