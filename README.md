# MY BENCH SERVER (API)

MY BENCH APPで用いるWeb APIです。

# Features

Express + Sequelize + PostgreSQL  
ログイン認証にはPassportを使用

# Requirement

* node v18.15.0

# Installation

```bash
cd {my-bench-app}
git clone {https://github.com/yu03-dev/my-bench-server.git}
npm install
echo DB_DEV_URL=postgres://{username}:{password}@localhost:5432/{db_name} >> .env
echo SESSION_SECRET={your_secret_key}
```

# Usage

```bash
npm run local-start
```


# Note

MY BENCH APPでAPIとして使用しますが  
単体で動作する時はPostmanを使うことができます。

# Author

* yu03-dev
