<script setup>
import { ref, computed } from 'vue';
import CardPosition from './components/CardPosition.vue';
import useCard from './composables/card';
import solve from './solver';

const { pickCard, getImageUrl } = useCard();

const cards = ref([null, null, null, null]);

const candidateCards = computed(() => {
  return Array.from({ length: 10 }, (_, i) => i + 1).map((n) => pickCard(n, cards.value));
});

const candidateSolutions = computed(() => {
  if (cards.value.some((c) => c === null)) {
    return null;
  }

  return solve(cards.value.map((c) => c.number));
});

function selectCard(card) {
  const found = cards.value.findIndex((card) => card === null);
  if (found === -1) {
    return;
  }

  cards.value.splice(found, 1, card);
}

function resetPosition(index) {
  cards.value.splice(index, 1, null);
}

function clear() {
  cards.value = [null, null, null, null];
}
</script>

<template>
  <div class="tw:w-dvw tw:h-dvh tw:p-2 tw:flex tw:flex-col tw:gap-y-2">
    <div class="tw:flex-auto tw:grid tw:grid-rows-2 tw:grid-cols-2 tw:gap-2 tw:justify-items-center tw:items-center">
      <CardPosition v-for="(card, index) in cards" :key="index" :card="card" @reset="resetPosition(index)" />
    </div>
    <div class="tw:h-36 tw:flex tw:justify-center tw:items-center">
      <div v-if="candidateSolutions === null" class="tw:px-16 tw:grid tw:grid-rows-2 tw:grid-cols-5 tw:gap-2">
        <img v-for="(card, index) in candidateCards" :key="index" :src="getImageUrl(card)" class="tw:border tw:rounded" @click.stop="selectCard(card)" />
      </div>
      <div v-else class="tw:w-full tw:px-4 tw:flex tw:justify-between tw:items-center">
        <p v-if="candidateSolutions.length === 0" class="tw:text-2xl">解答がありません</p>
        <p v-else class="tw:text-4xl">{{ candidateSolutions[0] }}</p>
        <button class="tw:text-4xl" @click.stop="clear">🔄</button>
      </div>
    </div>
  </div>
</template>
