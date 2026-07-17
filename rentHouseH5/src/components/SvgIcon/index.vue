<template>
  <svg :class="className" :width="size" :height="size" :fill="color" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: string | number
    color?: string
    className?: string
  }>(),
  {
    size: 16,
    color: 'currentColor',
    className: '',
  },
)
</script>
