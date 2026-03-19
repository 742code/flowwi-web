<script setup lang="ts">
import type { BlogPostProps } from "@nuxt/ui";

const posts = ref<BlogPostProps[]>([
    {
        title: "Banner Black Friday - Feed Instagram",
        badge: "in progress",
        date: "2024-11-25",

        authors: [
            {
                name: "Lucas Pires",
                avatar: {
                    icon: "i-lucide-user",
                },
            },
        ],
    },
    {
        title: "Banner Black Friday - Feed Instagram",
        badge: "in progress",
        date: "2024-11-25",

        authors: [
            {
                name: "Lucas Pires",
                avatar: {
                    icon: "i-lucide-user",
                    sizes: "lg",
                },
            },
        ],
    },
]);
</script>

<template>
    <section class="flex flex-col gap-4 overflow-hidden">
        <UPageFeature
            title="Tarefas recentes"
            description="Total de tarefas recentes no sistema."
        />

        <UBlogPosts
            orientation="vertical"
            :ui="{
                base: 'lg:gap-4 lg:grid-cols-1 p-1 overflow-y-auto',
            }"
        >
            <UBlogPost
                v-for="(post, index) in posts"
                v-bind="post"
                :key="index"
                :badge="{
                    label: 'Release',
                    color: 'primary',
                    variant: 'solid',
                }"
                :ui="{
                    meta: 'flex-row-reverse justify-between',
                    title: 'text-sm',
                    description: 'text-xs',
                    image: 'object-center',
                    badge: 'rounded-full',
                }"
                variant="subtle"
            />
        </UBlogPosts>
    </section>
</template>
