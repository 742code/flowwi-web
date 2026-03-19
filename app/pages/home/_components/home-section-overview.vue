<script setup lang="ts">
const cards = ref([
    {
        title: "Tasks ativas",
        description: "Total de tarefas ativas no sistema.",
        icon: "i-lucide-list-todo",
    },
    {
        title: "Artes em produção",
        description: "Total de artes em produção no sistema.",
        icon: "i-lucide-palette",
    },
    {
        title: "",
        description: "",
        icon: "",
    },
]);
</script>

<template>
    <section class="space-y-4">
        <UPageFeature
            title="Overview"
            description="Visão geral do departamento de marketing"
        />

        <UPageGrid>
            <UPageCard
                v-for="(card, index) in cards"
                v-bind="card"
                :key="index"
                variant="subtle"
            />
        </UPageGrid>
    </section>
</template>
