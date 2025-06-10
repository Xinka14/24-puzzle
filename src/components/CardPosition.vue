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
  <div @click.stop="toggle">
    <img v-if="img" :src="img" class="tw:border tw:rounded" />
  </div>
</template>
