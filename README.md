# Readme

# Grocery Store Application

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This project is a multi-user application designed for buying grocery items. Users can purchase multiple products from one or multiple sections/categories. The admin can manage categories and products. The application supports Role-Based Access Control (RBAC) and includes backend job scheduling for various tasks.

## Features
- User authentication and authorization with three roles.
- Admin can add, delete, and edit categories and products.
- Users can purchase products from multiple categories.
- Asynchronous jobs for exporting product details as CSV files.
- Scheduled backend jobs for visit alerts and monthly reports.
- Caching using Redis and batch jobs using Celery.

## Technologies Used
- Python
- Flask
- HTML
- CSS
- Bootstrap
- SQLite
- Jinja2
- JavaScript
- Vue.js
- Redis
- Celery
- MailHog

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

