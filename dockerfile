FROM php:8.2.6-fpm

WORKDIR /var/www/html

ENV CONTAINER_PORT=80
ENV CONTAINER_HOST=localhost
ENV APP_ENV=dev
ENV CI_ENV=development
ARG COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update && \
    apt-get install -y \
    libssl-dev \
    curl \
    libcurl4-gnutls-dev \
    libxml2-dev \ 
    libicu-dev \
    libmcrypt4 \
    libmemcached11 \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng16-16 \
    libbz2-dev \
    libpq-dev \
    libicu-dev \
    libgmp-dev \
    sendmail \
    libpng-dev \
    zlib1g-dev \
    libzip-dev \
    autoconf \
    libtool \
    zip \
    make \
    nginx \
    git \
    supervisor \
    openssl

RUN docker-php-ext-install gd
RUN docker-php-ext-configure gd
RUN docker-php-ext-install pdo pdo_mysql mysqli && docker-php-ext-enable pdo_mysql 
RUN docker-php-ext-install opcache bcmath bz2 intl sockets soap gmp && \
    pecl install apcu-5.1.22 && \
    docker-php-ext-enable apcu && \
    pecl install redis && \
    docker-php-ext-enable redis

# # Configure services
COPY docker/nginx/conf/default.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf/fpm-pool.conf /etc/php7/php-fpm.d/www.conf
COPY docker/php/php.ini /etc/php7/conf.d/custom.ini
COPY docker/php/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
#COPY entrypoint.sh /entrypoint.sh

# # Setup document root
RUN mkdir -p /var/www/html

# # Install PHP dependencies
COPY ./api /var/www/html

# # Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer && \
    composer update && \
    composer install

#install xdebug
#RUN pecl install xdebug
#COPY 90-xdebug.ini "${PHP_INI_DIR}"/conf.d

#RUN chmod +x /entrypoint.sh && \
#    chmod -R 777 /var/www/html/storage && \
#    chmod -R +rx /var/www/html/ && \
#    chmod -R 775 /var/www/html/storage

WORKDIR /

#ENTRYPOINT [ "./entrypoint.sh" ]

EXPOSE 80
# Configure a healthcheck to validate that everything is up&running
#HEALTHCHECK --timeout=10s CMD curl --silent --fail http://127.0.0.1:80/fpm-ping
