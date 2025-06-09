<script setup>
import { computed } from 'vue';
import useCard from '../composables/card';

const { getImageUrl } = useCard();

const props = defineProps({
  card: {
    type: [Object, null],
    required: true,
  },
});
const emit = defineEmits(['reset']);

const img = computed(() => {
  if (props.card === null) {
    return null;
  }

  return getImageUrl(props.card);
});

function toggle() {
  if (props.card === null) {
    return;
  }

  emit('reset');
}
</script>

<template>
  <div class="tw:w-full tw:h-full tw:border tw:rounded" @click.stop="toggle">
    <img v-if="img" :src="img" />
  </div>
</template>
