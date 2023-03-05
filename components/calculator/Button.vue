<template>
  <button :class="type" @click="$emit('onClick')">
    {{ value }}
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Button extends Vue {
  @Prop({ type: String, required: true }) value: string
  @Prop({ type: String, required: true }) type: string
}

</script>

<style lang="scss" scoped>
button {
  @apply rounded border border-black drop-shadow-md hover:bg-slate-100;
  @apply p-8 w-1/4 h-1/4 m-1;
  @apply bg-white text-xl;
}

.back {
  @apply text-white bg-red-600 hover:bg-red-700
}

.operation {
  @apply text-white bg-amber-500 hover:bg-amber-600
}

.equals {
  @apply text-white bg-lime-500 hover:bg-lime-600
}
</style>
