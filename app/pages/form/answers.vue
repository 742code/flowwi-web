<script setup lang="ts">
import type { tFormBlockOut, tFormOut, tFormResponseOut } from "./_schemas/form";
import type { iPageNumberPagination } from "~/interfaces/pagination";

definePageMeta({});

const { $api } = useNuxtApp();

const route = useRoute();
const initialFormId = computed(() => {
    const raw = route.query.formId;
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
});

const selectedFormId = ref<number | null>(initialFormId.value);
watch(
    () => initialFormId.value,
    (val) => (selectedFormId.value = val),
);

const {
    data: forms,
} = await useFetch<iPageNumberPagination<tFormOut>>("/forms", {
    $fetch: $api,
    key: "forms-for-answers",
});

const {
    data: blocks,
} = await useFetch<iPageNumberPagination<tFormBlockOut>>("/form-blocks", {
    $fetch: $api,
    key: "form-blocks-for-answers",
});

const {
    data: responses,
} = await useFetch<iPageNumberPagination<tFormResponseOut>>("/form-responses", {
    $fetch: $api,
    key: "form-responses",
});

const formsResults = computed(() => forms.value?.results ?? []);
const formsSelectItems = computed(() => [
    { label: "Todos", value: null },
    ...formsResults.value.map((f) => ({ label: f.title, value: f.id })),
]);

const blocksById = computed(() => {
    const map = new Map<number, tFormBlockOut>();
    for (const b of blocks.value?.results ?? []) map.set(b.id, b);
    return map;
});

const formsById = computed(() => {
    const map = new Map<number, tFormOut>();
    for (const f of forms.value?.results ?? []) map.set(f.id, f);
    return map;
});

const filteredResponses = computed(() => {
    const list = responses.value?.results ?? [];
    if (!selectedFormId.value) return list;
    return list.filter((r) => r.form === selectedFormId.value);
});

function applyFilter(nextFormId: number | null | undefined) {
    const normalized = typeof nextFormId === "number" ? nextFormId : null;
    selectedFormId.value = normalized;
    navigateTo({
        path: "/form/answers",
        query: normalized ? { formId: String(normalized) } : {},
    });
}
</script>

<template>
    <div class="size-full p-10 space-y-6 flex flex-col overflow-hidden">
        <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
                <h1 class="text-2xl font-bold">Respostas</h1>
                <p class="text-neutral-500 text-sm">
                    Visualize todas as submissões feitas nos formulários.
                </p>
            </div>

            <div class="space-y-2">
                <label class="text-sm font-medium">Filtrar por form</label>
                <USelect
                    v-model="selectedFormId"
                    :items="formsSelectItems"
                    value-key="value"
                    @update:modelValue="applyFilter"
                />
            </div>
        </div>

        <UPageGrid
            :ui="{
                base: 'lg:gap-4 lg:grid-cols-3 overflow-y-auto p-1',
            }"
        >
            <UPageCard
                v-for="resp in filteredResponses"
                :key="resp.id"
                :title="formsById.get(resp.form)?.title || `Form ${resp.form}`"
                :description="`Resposta em`"
                :ui="{
                    body: '',
                    container: 'p-6',
                    footer: 'w-full flex flex-col gap-3',
                }"
            >
                <template #footer>
                    <div class="text-neutral-400 text-sm">
                        <NuxtTime
                            :datetime="resp.created_at"
                            locale="pt-BR"
                            year="numeric"
                            month="long"
                            day="numeric"
                            hour="2-digit"
                            minute="2-digit"
                        />
                    </div>

                    <div class="space-y-3">
                        <div
                            v-for="ans in resp.answers"
                            :key="ans.id"
                            class="border rounded-lg p-3 space-y-2"
                        >
                            <div class="flex items-center gap-2 justify-between">
                                <div class="font-medium">
                                    {{ blocksById.get(ans.block)?.title || `Bloco ${ans.block}` }}
                                </div>
                                <div class="text-xs text-neutral-500">
                                    {{ blocksById.get(ans.block)?.type || "" }}
                                </div>
                            </div>

                            <pre
                                class=" border rounded p-2 overflow-auto max-h-56 text-xs"
                            >{{ JSON.stringify(ans.value, null, 2) }}</pre>
                        </div>
                    </div>
                </template>
            </UPageCard>
        </UPageGrid>

        <div
            v-if="filteredResponses.length === 0"
            class="text-neutral-500 text-sm"
        >
            Nenhuma resposta encontrada para este filtro.
        </div>
    </div>
</template>
