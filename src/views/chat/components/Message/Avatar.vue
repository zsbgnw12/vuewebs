<script lang="ts" setup>
import { NAvatar } from 'naive-ui'
import defaultAvatar from '@/assets/avatar.jpg'
import robot from '@/assets/robot.svg'

interface Props {
  image?: boolean
}
defineProps<Props>()
</script>

<template>
  <template v-if="image">
    <NAvatar round :src="defaultAvatar" />
  </template>
  <template v-else >
		<NAvatar round size="small" :src="robot" />
  </template>
</template>
