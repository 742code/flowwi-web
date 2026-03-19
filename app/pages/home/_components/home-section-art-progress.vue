<script setup lang="ts">
import type { BlogPostProps } from "@nuxt/ui";

const posts = ref<BlogPostProps[]>([
    {
        title: "Banner Black Friday - Feed Instagram",
        description: "Banner Black Friday - Feed Instagram",
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
        description: "Banner Black Friday - Feed Instagram",
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
        description: "Banner Black Friday - Feed Instagram",
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
        description: "Banner Black Friday - Feed Instagram",
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
        description: "Banner Black Friday - Feed Instagram",
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
        description: "Banner Black Friday - Feed Instagram",
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
]);
</script>

<template>
    <section class="flex flex-col gap-4 overflow-hidden">
        <UPageFeature
            title="Artes em produção"
            description="Total de artes em produção no sistema."
        />

        <UBlogPosts
            :ui="{
                base: 'lg:gap-4 lg:grid-cols-3 overflow-y-auto p-1',
            }"
        >
            <UBlogPost
                v-for="(post, index) in posts"
                v-bind="post"
                :key="index"
                :ui="{
                    meta: 'flex-row-reverse justify-between',
                    title: 'text-sm',
                    description: 'text-xs',
                    image: 'object-center',
                    root: 'h-74',
                    badge: 'rounded-full',
                }"
                variant="subtle"
            />
        </UBlogPosts>
    </section>
</template>
