FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN mkdir -p /var/www
WORKDIR /tmp
RUN composer create-project laravel/laravel:^12.0 laravel-app --no-interaction --prefer-dist \
    && cp -a laravel-app/. /var/www/ \
    && rm -rf laravel-app

WORKDIR /var/www

COPY app/Actions/          app/Actions/
COPY app/Http/Controllers/ app/Http/Controllers/
COPY app/Models/           app/Models/
COPY app/Providers/        app/Providers/
COPY database/migrations/  database/migrations/
COPY database/seeders/     database/seeders/
COPY routes/api.php        routes/api.php
COPY routes/web.php        routes/web.php
COPY routes/console.php    routes/console.php
COPY bootstrap/app.php     bootstrap/app.php
COPY config/sanctum.php    config/sanctum.php
COPY config/cors.php       config/cors.php
COPY config/database.php   config/database.php
COPY config/auth.php       config/auth.php

RUN composer require laravel/sanctum --no-interaction

RUN chown -R www-data:www-data /var/www \
    && chmod -R 777 /var/www/storage \
    && chmod -R 777 /var/www/bootstrap/cache

EXPOSE 8080

CMD php artisan key:generate --force && php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
