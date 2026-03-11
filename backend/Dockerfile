FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create Laravel project directly in /var/www from scratch
RUN mkdir -p /var/www
WORKDIR /var/www
RUN composer create-project laravel/laravel:^12.0 /tmp/laravel --no-interaction --prefer-dist \
    && cp -a /tmp/laravel/. /var/www/ \
    && rm -rf /tmp/laravel

# Install Sanctum
RUN composer require laravel/sanctum --no-interaction

# Copy ONLY our custom source files
COPY app/Actions/         app/Actions/
COPY app/Http/Controllers/ app/Http/Controllers/
COPY app/Models/          app/Models/
COPY app/Providers/       app/Providers/
COPY database/migrations/ database/migrations/
COPY database/seeders/    database/seeders/
COPY routes/api.php       routes/api.php
COPY routes/web.php       routes/web.php
COPY routes/console.php   routes/console.php
COPY bootstrap/app.php    bootstrap/app.php
COPY config/sanctum.php   config/sanctum.php
COPY config/cors.php      config/cors.php
COPY config/database.php  config/database.php
COPY config/auth.php      config/auth.php

# Copy .env
COPY .env /var/www/.env

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
