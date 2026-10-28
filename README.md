# Different-Levels-of-Search

<div align="center">
  <img src="https://dl.dropboxusercontent.com/scl/fi/15gzbq9z2baabkhy7owkk/different-level-of-search-screenshot.png?rlkey=9lrs5nmxt4yd944zr86i5kpcj" alt="Screenshot of main page">
</div>

Link to website: https://different-levels-of-search.onrender.com/

[![Demo]()](https://dl.dropboxusercontent.com/scl/fi/s31kmqutl5ah0w01vt1q5/keyword_search2.gif?rlkey=hz36pxn0550rogwwecm9k84hg) in GIF

Status: The Front end is Online. You need to reach out to the developer enable the back end.

The website is only available in mobile view. There are no plans to create a tablet or desktop view.

## What?
This website focuses on showcasing different levels of search. Recipes are used as the data for this project. It has a front end app that uses Vue 3 + Vite and a back end app that uses Express.js, SQlite, Meilisearch and Ollama, which uses Clean Architecture. The back end runs in a local machine through a docker container with Ngrok being used for port forwarding.

The most basic search is the keyword search that matches the exact user query. Next is a hybrid search that combines both keyword search and semantic search. This only changes the order of results and it is not very helpful. And then there is the pure semantic search that compares the vector embedding of both the user query and the recipes in Meilisearch/Database.

## How much AI was used to build this?
I see LLMs as tools that can help you make better decisions, find solutions that are outside the box and shoulder most of the repetitive work like in testing. I think it is fair to be honest and transparent in how much work I offloaded to it.  

### Front end
* Most of the Vue 3 code was written by me. I only used ChatGPT to refactor the code. Since I'm not that familiar with Composables, ChatGPT was kind enough to provide me with a few snippets that helped me transfer some of the logic into Composables.
* Some of the web design was provided by ChatGPT.

### Back end
* I already have a boiler plate code for Express.js + Clean Architecture in Javascript. ChatGPT helped me convert that into Typescript.
* ChatGPT created a plan that helped me build the back end in stages.
* Since I'm not familiar with Drizzle, better-sqlite-3 and Meilisearch, it helped me setup those services.
* Unit tests and integration tests.

## Tech Used

* Vue 3 + Vite
* Vueuse
* Vue-router
* Pinia
* SCSS
* Express.js
* better-sqlite-3
* Drizzle ORM
* Meilisearch
* Ollama + nomic-embed-text model
* Vitest
* Supertest
* Ngrok

## What's next?
The semantic search is not that accurate with its results. Meilisearch is responsible for comparing vector embedding. To make adjustments to the accuracy of search results, we need to change the minimum threshold that Meilisearch will allow for each search result. While that can remove some unwanted search results, it is still not enough. 

I think the problem lies on the model that converts our queries into vector. There is probably a way to optimize the query -> vector conversion. Or I can just change to a different model.

