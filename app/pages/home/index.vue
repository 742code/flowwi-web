<script setup lang="ts">
definePageMeta({
    path: "/",
});

const { getUser } = useUser();

const user = getUser();

const greeting = computed(() => {
    const hour = new Date().getHours();

    const time = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    return `${time}, ${user?.first_name} ${user?.last_name}`;
});
</script>

<template>
    <UContainer class="py-10">
        <div class="text-center">
            <h1 class="font-bold text-xl">{{ greeting }}</h1>
            <NuxtTime
                class="font-medium text-neutral-500"
                :datetime="Date.now()"
                weekday="long"
                month="long"
                day="numeric"
                hour="2-digit"
                minute="2-digit"
                locale="pt-br"
            />
        </div>
    </UContainer>
</template>
