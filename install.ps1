# Script de Instalación - Tiendas Multi-Tenant
# Ejecutar desde la raíz del proyecto

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Tiendas Multi-Tenant - Instalación" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "ERROR: Node.js no está instalado. Instala Node.js 18+ primero." -ForegroundColor Red
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($null -eq $npmVersion) {
    Write-Host "ERROR: npm no está instalado." -ForegroundColor Red
    exit 1
}
Write-Host "npm: $npmVersion" -ForegroundColor Green
Write-Host ""

# Instalar dependencias raíz
Write-Host "Instalando dependencias raíz..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Falló la instalación de dependencias raíz" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Instalar dependencias del backend
Write-Host "Instalando dependencias del backend..." -ForegroundColor Yellow
Set-Location apps\backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Falló la instalación de dependencias del backend" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}
Set-Location ..\..
Write-Host ""

# Instalar dependencias del frontend
Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location apps\frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Falló la instalación de dependencias del frontend" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}
Set-Location ..\..
Write-Host ""

# Preguntar si configurar base de datos
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Configuración de Base de Datos" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$respuesta = Read-Host "¿Quieres configurar la base de datos ahora? (s/n)"

if ($respuesta -eq 's' -or $respuesta -eq 'S') {
    Write-Host ""
    Write-Host "Asegúrate de tener PostgreSQL corriendo..." -ForegroundColor Yellow
    Write-Host "Presiona Enter cuando estés listo..." -ForegroundColor Yellow
    Read-Host
    
    Set-Location apps\backend
    
    Write-Host "Generando Prisma Client..." -ForegroundColor Yellow
    npm run db:generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ADVERTENCIA: Falló la generación de Prisma Client" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Ejecutando migraciones..." -ForegroundColor Yellow
    npm run db:migrate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ADVERTENCIA: Fallaron las migraciones" -ForegroundColor Yellow
        Write-Host "Puedes ejecutarlas manualmente con: npm run db:migrate" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Cargando datos de ejemplo..." -ForegroundColor Yellow
    npm run db:seed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ADVERTENCIA: Falló el seed de datos" -ForegroundColor Yellow
    }
    
    Set-Location ..\..
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  ¡Instalación Completada!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar la aplicación:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Esto iniciará:" -ForegroundColor Cyan
Write-Host "  - Backend: http://localhost:3001" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  - Swagger: http://localhost:3001/api/docs" -ForegroundColor White
Write-Host ""
Write-Host "Datos de acceso (si cargaste el seed):" -ForegroundColor Cyan
Write-Host "  Tenant 1: admin@modaurbana.com / admin123" -ForegroundColor White
Write-Host "  Tenant 2: admin@accesoriosplus.com / admin123" -ForegroundColor White
Write-Host ""
