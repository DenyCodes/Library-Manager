#!/bin/bash
set -e

echo "🚀 Iniciando Library Manager..."

# Copy .env if not exists
if [ ! -f backend/.env ]; then
    echo "📄 Criando arquivo .env do backend..."
    cp backend/.env
fi

# Start Docker containers
echo "🐳 Subindo containers Docker..."
docker-compose up -d --build

# Wait for MySQL to be ready
echo "⏳ Aguardando MySQL ficar pronto..."
sleep 15

# Generate APP_KEY
echo "🔑 Gerando APP_KEY..."
docker-compose exec app php artisan key:generate --force

# Run migrations
echo "📦 Executando migrations..."
docker-compose exec app php artisan migrate --force

# Run seeders
echo "🌱 Populando banco com livros..."
docker-compose exec app php artisan db:seed --force

echo ""
echo "✅ Projeto iniciado com sucesso!"
echo ""
echo "🌐 Frontend:  http://localhost:3000"
echo "🔧 Backend:   http://localhost:8000"
echo "🗄️  MySQL:     localhost:3306"
echo ""
echo "📚 Para parar: docker-compose down"
