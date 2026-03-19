<script setup lang="ts">
import { LazyCFormCreateModal } from "#components";
import type { tFormOut } from "./_schemas/form";
import { computed } from "vue";
import type { iPageNumberPagination } from "~/interfaces/pagination";

definePageMeta({});

const { $api } = useNuxtApp();

const { data: forms, refresh } = await useFetch<iPageNumberPagination<tFormOut>>("/forms", {
    $fetch: $api,
    key: "forms",
});

const overlay = useOverlay();
const modal = overlay.create(LazyCFormCreateModal);

const safeForms = computed<tFormOut[]>(() => {
    const results = forms.value?.results ?? [];
    return results.filter((f): f is tFormOut => f != null);
});



function navigateToAnswers(formId: number) {
    navigateTo({ path: "/form/answers", query: { formId: String(formId) } });
}
</script>

<template>
    <div class="size-full p-10 space-y-10 flex flex-col overflow-hidden">
        <div class="flex items-center justify-between gap-4">
            <div class="space-y-1">
                <h1 class="text-2xl font-bold">Formulários</h1>
                <p class="text-neutral-500 text-sm">
                    Crie modelos e depois acompanhe as respostas.
                </p>
            </div>

            <UButton
                label="Criar formulário"
                color="primary"
                icon="i-lucide-plus"
                @click="modal.open()"
            />
        </div>

        <UPageGrid
            :ui="{
                base: 'lg:gap-4 lg:grid-cols-3 overflow-y-auto p-1',
            }"
        >
            <UPageCard
                v-for="form in safeForms"
                :key="form.id"
                :title="form.title"
                :description="form.description || undefined"
                :ui="{
                    body: '',
                    container: 'p-6',
                    footer: 'w-full flex flex-row gap-2',
                }"
            >
                <template #footer>
                    <UButton
                        label="Ver respostas"
                        color="neutral"
                        variant="outline"
                        icon="i-lucide-check-check"
                        @click="navigateToAnswers(form.id)"
                    />
                </template>
            </UPageCard>
        </UPageGrid>
    </div>
</template>
