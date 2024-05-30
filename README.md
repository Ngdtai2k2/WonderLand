# WonderLand

Welcome to the WonderLand project! This README file will guide you through setting up and running the project locally.

## Table of Contents

- [WonderLand](#wonderland)
  - [Introduction](#introduction)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
  - [API Endpoints](#api-endpoints)
  - [Contributing](#contributing)
  - [License](#license)

## Introduction

WonderLand is a fun and interactive web application that integrates various APIs to fetch random images of cats and dogs. It provides a delightful user experience with random animal pictures.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Node.js and npm installed on your machine. You can download them from [Node.js](https://nodejs.org/).
- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Ngdtai2k2/WonderLand.git
    cd wonderland
    ```

2. Install the dependencies:
    ```sh
    cd frontend
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```env
REACT_APP_BASE_URL = "http://localhost:8000/api/v1"
REACT_APP_SERVER_URL = "http://localhost:8000"
REACT_APP_DOMAIN = "http://localhost:3000"

REACT_APP_API_THE_CAT_RANDOM = "https://api.thecatapi.com/v1/images/search"
REACT_APP_API_THE_DOG_RANDOM = "https://api.thedogapi.com/v1/images/search"
REACT_APP_API_THE_DOG_FUNNY_RANDOM = "https://random.dog/woof.json"
REACT_APP_IMAGES_NO_DATA = "https://th.bing.com/th/id/OIG1.Rbga5cgtax9AVm6V49u3?pid=ImgGn"
