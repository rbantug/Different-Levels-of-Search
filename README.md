# Different-Levels-of-Search

<div align="center">
  <img src="https://dl.dropboxusercontent.com/scl/fi/15gzbq9z2baabkhy7owkk/different-level-of-search-screenshot.png?rlkey=9lrs5nmxt4yd944zr86i5kpcj" alt="Screenshot of main page">
</div>

Link to website: https://different-levels-of-search.onrender.com/

Status: The Front end is Online. You need to reach out to the developer enable the back end.

Some of the web design was provided by ChatGPT

The website is only available in mobile view. There are no plans to create a mobile or desktop view.

## What?
This website focuses on showcasing different levels of search. Recipes are used as the data for this project. It has a front end app that uses Vue 3 + Vite and a back end app that uses Express.js, SQlite, Meilisearch and Ollama, which uses Clean Architecture. The back end runs in a local machine through a docker container with Ngrok being used for port forwarding.

The most basic search is the keyword search that matches the exact user query. Next is a hybrid search that combines both keyword search and semantic search. This only changes the order of results and it is not very helpful. And then there is the pure semantic search that compares the vector embedding of both the user query and the recipes in Meilisearch/Database.

## Tech Used

* Vue 3 + Vite
* Vueuse
* Vue-router
* Pinia
* SCSS
* Express.js
* better-sqlite-3
* Meilisearch
* Ollama + nomic-embed-text model
* Vitest
* Supertest
* Ngrok
