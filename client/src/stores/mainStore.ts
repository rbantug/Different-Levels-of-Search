import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Recipe } from '@/types/recipe'

export const useMainStore = defineStore('main', () => {
  const keywordRecipes = ref<Recipe[]>([])
  const hybridRecipes = ref<Recipe[]>([])

  const getKeywordRecipes = computed(() => keywordRecipes)
  const getHybridRecipes = computed(() => hybridRecipes)

  function updateKeywordRecipes(val: Recipe[]) {
    keywordRecipes.value = val
  }
  function updateHybridRecipes(val: Recipe[]) {
    hybridRecipes.value = val
  }

  const currentOption = ref<'keyword'|'hybrid'|null>(null)
  const getCurrentOption = computed(() => currentOption)
  function updateCurrentOption(val:'keyword'|'hybrid') {
    currentOption.value = val
  } 

  return { getKeywordRecipes, getHybridRecipes, updateKeywordRecipes, updateHybridRecipes, getCurrentOption, updateCurrentOption }
})
