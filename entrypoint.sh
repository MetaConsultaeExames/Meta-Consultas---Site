#!/bin/bash

echo "start app configuration..."

APP_DIR="/var/www/html"

cd $APP_DIR

#php artisan config:cache
#php artisan event:cache
#php artisan view:cache

echo "starting supervisor...";

supervisord -c /etc/supervisor/conf.d/supervisord.conf