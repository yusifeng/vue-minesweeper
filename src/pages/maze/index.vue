<script setup lang="ts">
const MAX_HEIGHT = 10
const MAX_WIDTH = 10
import type { Block } from '~/types/mineswpeeper'
const state = ref(generateInitBlocks())
function generateInitBlocks() {
  return Array.from({ length: MAX_HEIGHT }, (_, x) =>
    Array.from({ length: MAX_WIDTH }, (_, y): Block => ({
      x, y, isMine: false, revealed: false, flagged: false,
    })))
}
function reset() {
  state.value = generateInitBlocks()
}
function handleClick(b) {
  b.isMine = true
}
</script>

<template>
  <div>
    <div>
      <button @click="reset">reset</button>
    </div>
    <div v-for="lines,idx of state" :key="idx">
      <button h10 w10 v-for="i,j of lines" @click="handleClick(i)">{{i.isMine}}</button>
    </div>
  </div>
</template>
