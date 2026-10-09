<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const errorCode = computed(() => {
  return route.params.errorCode
})

const errorTitle = computed(() => {
  if (errorCode.value === '404') {
    return 'Oops! Recipe missing.'
  }

  return 'Oops! Something went wrong.'
})

const errorDescription = computed(() => {
  if (errorCode.value === '404') {
    return 'Looks like this recipe wandered out of the kitchen.'
  }

  return 'Please contact the developer to run the backend in his machine'
})

const imgPath = computed(() => 'https://dl.dropboxusercontent.com/scl/fi/fnmbailtpmnmaf1udrgz1/error-page-img.avif?rlkey=x606cbgq9sjyizhwx8ofk8uhq')
  
</script>

<template>
  <main class="error-page">
    <section class="error-illustration">
      <img :src="imgPath" alt="" />
    </section>

    <section class="error-message">
      <span class="error-code">
        {{ errorCode }}
      </span>

      <h1>
        {{ errorTitle }}
      </h1>

      <p>
        {{ errorDescription }}
      </p>
    </section>

    <router-link to="/" class="home-btn">
      <span class="home-btn-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 48 48">
          <path d="M0 0h48v48H0z" fill="none" />
          <g
            fill="none"
            stroke="#fff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
          >
            <path d="M12 34h24v8H12zm17 0V20m-7 14v-8" />
            <path d="M12 25v9h24v-9s5-3 5-8s-4-7-9-7c0-2-3-6-8-6s-8 4-8 6c-4 0-9 2-9 7s5 8 5 8" />
          </g>
        </svg>
      </span>
      <span class="home-btn-text">Find a recipe</span>
    </router-link>
  </main>
</template>

<style lang="scss" scoped>
.error-page {
  flex-direction: column;
  height: 100vh;
  background-color: #f6f2e7;

  @include m-flex-center;
}

.error-illustration {
  img {
    height: 15rem;
    width: 100%;
  }
}

.error-message {
  padding: 0 1rem;
  flex-direction: column;
  row-gap: 1rem;

  @include m-flex-center;

  h1,
  p {
    text-align: center;
  }

  p {
    color: $color-text-secondary;
  }

  .error-code {
    padding: 0.25rem 1rem;
    background-color: $color-primary-light;
    color: $color-primary;
    border-radius: 2rem;
    font-weight: 700;
  }
}

.home-btn {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: $color-primary;
  border-radius: 2rem;
  text-decoration: none;

  .home-btn-text {
    margin-left: 0.5rem;
    display: flex;
    color: white;
    font-weight: 600;
  }
}
</style>
