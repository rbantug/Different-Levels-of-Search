<script setup lang="ts">
import { type PropType, computed } from 'vue'

type StatusEnum = 'checking' | 'successful' | 'failed'

const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String as PropType<StatusEnum>,
    default: 'checking',
    validator: (value: string) => ['checking', 'successful', 'failed'].includes(value),
  },
})

const message = computed(() => {
  if (props.status === 'successful') {
    return 'Please wait for a while.'
  }

  if (props.status === 'failed') {
    return 'Please reach out to the developer for more info'
  }

  return 'We’re making sure the backend is up and running.'
})

const header = computed(() => {
  if (props.status === 'successful') {
    return 'The API is up and working!'
  }

  if (props.status === 'failed') {
    return 'The API is not accessible as of this moment.'
  }

  return 'Checking the API....'
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="api-modal-overlay">
      <section
        class="api-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-modal-title"
        aria-describedby="api-modal-description"
      >
        <!-- Message -->
        <div class="api-modal__content">
          <span class="api-modal__eyebrow"> SORRY FOR BOTHERING YOU </span>

          <h2 id="api-modal-title">{{ header }}</h2>

          <p id="api-modal-description">
            {{ message }} <span v-show="props.status !== 'failed'">This won’t take long!</span>
          </p>
        </div>

        <div v-show="props.status !== 'failed'">
          <!-- loading bar -->
          <div
            class="api-modal__progress"
            role="progressbar"
            aria-label="Checking backend API availability"
            aria-valuetext="Health check in progress"
          >
            <div class="api-modal__progress-bar"></div>
          </div>

          <!-- spinner -->
          <div class="api-modal__status" role="status" aria-live="polite">
            <span>Fetching health check...</span>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.api-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  place-items: center;
  padding: 0 20px;
  background: rgb(36 46 65 / 55%);
  backdrop-filter: blur(5px);
}

.api-modal {
  width: min(100%, 420px);
  padding: 30px 24px 28px;
  overflow: hidden;
  text-align: center;
  background: #fffdf9;
  border: 1px solid #f3e8dc;
  border-radius: 28px;
  box-shadow: 0 24px 70px rgb(34 43 61 / 20%);

  &__content {
    position: relative;
  }

  &__eyebrow {
    display: inline-block;
    margin-bottom: 10px;
    color: $color-primary;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
  }

  h2 {
    margin: 0;
    color: $color-text-muted;
    font-size: clamp(23px, 6vw, 29px);
    font-weight: 800;
    letter-spacing: -0.8px;
  }

  p {
    max-width: 310px;
    margin: 12px auto;
    color: $color-text-secondary;
    font-size: 14px;
    line-height: 1.7;
  }

  &__progress {
    position: relative;
    height: 12px;
    overflow: hidden;
    background: #e9edf2;
    border-radius: 999px;
  }

  &__progress-bar {
    position: absolute;
    inset: 0 auto 0 0;
    width: 42%;
    background: repeating-linear-gradient(45deg, #82bd76 0 12px, #70ad69 12px 24px);
    border-radius: inherit;
    animation: loading-slide 1.5s ease-in-out infinite;
    will-change: transform;
  }

  &__status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 18px;
    color: #788399;
    font-size: 13px;
  }
}

@keyframes loading-slide {
  0% {
    transform: translateX(-105%);
  }

  100% {
    transform: translateX(245%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .api-modal__progress-bar {
    animation: none;
  }
}
</style>
