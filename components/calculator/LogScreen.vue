<template>
  <div class="screen">
    <div v-for="(log , index) in logs.slice(0, 4)" :key="`log-${index}`" class="log">
      {{ log }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class LogScreen extends Vue {
  @Prop({ type: Array, required: true }) logs: string[]
}

</script>

<style lang="scss" scoped>
.screen {
  @apply w-full h-32 mb-5;
  @apply text-xl text-right bg-white;
  @apply rounded border border-black;
  @apply flex flex-col justify-end
}

.log {
  @apply basis-1/4
}
</style>
