# the-dark-side-of-the-money

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.com/greguz/the-dark-side-of-the-money.svg?branch=master)](https://travis-ci.com/greguz/the-dark-side-of-the-money)

## What?

Simple currency converter web server written in JavaScript. The project's name is a citation to the song [Money](https://genius.com/Pink-floyd-money-lyrics) by *Pink Floyd* from the album *The Dark Side of the Moon*.

## Setup

Install [Node.js](https://nodejs.org/en/download/) >=8.0.0 and then run `npm install` inside project's directory.

## Start

Simply run `npm start`. By default the server is available at port **8008**.

## Convert

There's only single web route available to convert currencies.

### Route

#### Endpoing

```
GET /convert
```

#### QueryString parameters
- **amount** (number)
- **src_currency** (ISO 3 letters)
- **dest_currency** (ISO 3 letters)
- **reference_date** (YYYY-MM-DD format)

### Postman

You can import the postman collection JSON file to start trying the route.

## How

The web server dynamically fetch a database containing last 90 days exchange rates from the [European Central Bank](https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml). There's a cache timeout of 1h by default for that database.
