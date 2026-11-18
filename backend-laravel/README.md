# Laravel 11 Portfolio Backend API

Complete PHP Laravel REST API source matching the portfolio frontend contract (`GET /api/projects`, `POST /api/contact`, and Sanctum-protected admin endpoints).

## Setup Instructions

1. **Install PHP dependencies**:
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   ```

2. **Configure MySQL in `.env`**:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=mac_portfolio
   DB_USERNAME=root
   DB_PASSWORD=
   FRONTEND_URL=http://localhost:3000
   ```

3. **Run Migrations**:
   ```bash
   php artisan migrate
   ```

4. **Serve Locally**:
   ```bash
   php artisan serve --port=8000
   ```
