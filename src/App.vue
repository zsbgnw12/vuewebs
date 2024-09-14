<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { useLanguage } from '@/hooks/useLanguage'
import { NaiveProvider } from '@/components/common'

const { language } = useLanguage()
</script>

<template>
    <NConfigProvider class="h-full" :locale="language">
      <NaiveProvider>
        <RouterView />
      </NaiveProvider>
    </NConfigProvider>
</template>
