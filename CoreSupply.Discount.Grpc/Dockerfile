# Stage 1: Base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# پورت‌های gRPC (معمولاً HTTP2 روی 8080 یا پورت خاص دیگر)
EXPOSE 8080
EXPOSE 8081

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# کپی کردن فایل‌های پروژه
COPY ["CoreSupply.Discount.Grpc/CoreSupply.Discount.Grpc.csproj", "CoreSupply.Discount.Grpc/"]
COPY ["CoreSupply.BuildingBlocks/CoreSupply.BuildingBlocks.csproj", "CoreSupply.BuildingBlocks/"]

# بازیابی پکیج‌ها
RUN dotnet restore "./CoreSupply.Discount.Grpc/CoreSupply.Discount.Grpc.csproj"

# کپی سورس کد
COPY . .
WORKDIR "/src/CoreSupply.Discount.Grpc"
RUN dotnet build "./CoreSupply.Discount.Grpc.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./CoreSupply.Discount.Grpc.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CoreSupply.Discount.Grpc.dll"]
