FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY . .

# Install dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set permission
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

RUN mkdir -p storage/framework/views \
    storage/framework/cache \
    storage/framework/sessions \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]