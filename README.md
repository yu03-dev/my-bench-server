# MY BENCH SERVER (API)

MY BENCH APPで用いるWeb APIです。

## Features

Express + Sequelize + PostgreSQL  
CRUD処理とログイン認証を実装

ログイン認証にはPassportを使用

## Requirement

* node v18.15.0

## Installation

```bash
git clone https://github.com/yu03-dev/my-bench-server.git
cd {my-bench-app}
npm install
echo DB_DEV_URL=postgres://{username}:{password}@localhost:5432/{db_name} >> .env
echo SESSION_SECRET={your_secret_key} >> .env
```

## Usage

```bash
npm run local-start
```

## Note

MY BENCH APPでAPIとして使用しますが  
単体で動作する時はPostmanを使うことができます。

## Author

yu03-dev  
大学院で機械学習の研究をしています
