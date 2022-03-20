<script setup lang="ts">
import type { Block } from '~/types/mineswpeeper'

const MAX_HEIGHT = 10
const MAX_WIDTH = 10
const rate = 0.1
const isDev = true
let isGenerateMines = false
let mineCount = 0
const mineNumberColros = [
  '#0019de',
  '#1ebe24',
  '#de1b2f',
  '#061069',
  '#670707',
  '#1b7677',
  '#040404',
  'pink',
]

const baseAround = [-1, 0, 1]
const arround = baseAround.map(x =>
  baseAround.map(y => [x, y]))
  .flat()
  .filter(x => !(x[0] === 0 && x[1] === 0),
  )

const state = ref<Block[][]>(generateInitBlocks())

function generateMines(_block: Block) {
  state.value.forEach((lineBlocks, x) => {
    lineBlocks.forEach((block) => {
      if (Math.random() < rate && !(_block.x === block.x && _block.y === block.y)) {
        block.isMine = true
        mineCount++
      }
    })
  })
}

function handleClick(block: Block) {
  if (block.revealed) return
  if (!isGenerateMines) {
    isGenerateMines = true
    generateMines(block)
    calcuateAroundMines()
  }
  block.revealed = true
  if (block.isMine) {
    revealAll()
    alert('You Lose')
  }

  expandZero(block)
  state.value.forEach((lines) => {
    lines.forEach((_block) => {
      if (_block.aroundMine === 0) {
        getSibling(_block).forEach((__block) => {
          if (!__block.isMine)
            __block.revealed = true
        })
      }
    })
  })
}
function rightClick(block: Block) {
  if (block.revealed) return
  block.flagged = !block.flagged
}

function processBlockClassName(block: Block) {
  if (block.revealed)
    return 'bg-gray-700/10'
  else
    return 'bg-gray-700/10'
}
function processBlockStyle(block: Block) {
  return {
    color: mineNumberColros[block.aroundMine!],
  }
}
function calcuateAroundMines() {
  state.value.forEach((lineBlocks) => {
    lineBlocks.forEach((block) => {
      if (!block.isMine)
        block.aroundMine = getSibling(block).filter(x => x.isMine).length
    })
  })
}

function expandZero(block: Block) {
  getSibling(block)
    .forEach((_block) => {
      if (_block.aroundMine === 0 && !_block.revealed && !_block.isMine) {
        _block.revealed = true
        expandZero(_block)
      }
    })
}

function getSibling(block: Block) {
  return arround.map(([x, y]) => state.value[block.x + x]?.[block.y + y])
    .filter(Boolean)
}

function revealAll() {
  const blocks = state.value.flat()
  blocks.forEach((block) => {
    block.revealed = true
  })
}

function checkResult() {
  if (!isGenerateMines) return
  const blocks = state.value.flat()
  // 表示全部翻完了
  if (blocks.every(b => b.revealed || b.flagged)) {
    if (blocks.filter(b => b.flagged).length === mineCount)
      alert('Win')
  }
}

function generateInitBlocks() {
  return Array.from({ length: MAX_HEIGHT }, (_, x) =>
    Array.from({ length: MAX_WIDTH }, (_, y): Block => ({
      x, y, isMine: false, revealed: false, flagged: false, aroundMine: 0,
    })))
}
function reset() {
  mineCount = 0
  isGenerateMines = false
  state.value = generateInitBlocks()
}

watch(state.value, checkResult)

</script>
<template>
  <h1>Minesweeper</h1>
  <div py3>
    <button border px1 @click="reset">
      reset
    </button>
  </div>
  <div p10 flex="~ wrap col" items-center>
    <div v-for="(line, idx) of state" :key="idx" flex="~ nowrap">
      <div
        v-for="(block, idx2) of line" :key="idx2" flex="~"
        justify-center items-center w10 h10 m1 cursor-pointer
        :class="processBlockClassName(block)"
        @click="handleClick(block)"
        @contextmenu.prevent="rightClick(block)"
      >
        <template v-if="block.flagged">
          <div i-mdi-flag class="text-red-900" />
        </template>
        <template v-else-if="!block.revealed && isDev" />
        <template v-else-if="block.isMine">
          <div i-mdi-mine />
        </template>
        <template v-else>
          <div :style="processBlockStyle(block)" text-xl font-black>
            {{ block.aroundMine }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
