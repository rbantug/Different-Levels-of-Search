import { computed, ref, type Ref } from 'vue'

export default function usePagination<T>(items: Ref<T[]>, itemsPerPage = 5) {
  const currentPage = ref(1)

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage)
  })

  const visibleItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = currentPage.value * itemsPerPage

    return items.value.slice(start, end)
  })

  function goToPage(page: number) {
    if (page < 1 || page > totalPages.value) return

    currentPage.value = page
  }

  function resetPage() {
    currentPage.value = 1
  }

  return {
    currentPage,
    totalPages,
    visibleItems,
    goToPage,
    resetPage,
  }
}
