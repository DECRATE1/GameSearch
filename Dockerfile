# --- Stage 1: Build ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем csproj и восстанавливаем зависимости
COPY backend.csproj .
RUN dotnet restore

# Копируем всё остальное и публикуем
COPY . .
RUN dotnet publish -c Release -o /app/publish

# --- Stage 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Копируем опубликованное приложение
COPY --from=build /app/publish .

# Открываем порт
EXPOSE 3001

# Настраиваем URL для ASP.NET Core
ENV ASPNETCORE_URLS=http://0.0.0.0:3001

# Запуск приложения
ENTRYPOINT ["dotnet", "backend.dll"]
