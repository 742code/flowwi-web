<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { type tArtRequestOut } from "./_schemas/art-request";
import type { iPageNumberPagination } from "~/interfaces/pagination";

const tabActive = ref("all");

const tabs: TabsItem[] = [
    { label: "todas", value: "all", icon: "i-lucide-mailbox" },
    { label: "pendentes", value: "pending", icon: "i-lucide-clock" },
    { label: "aprovadas", value: "approved", icon: "i-lucide-check" },
    { label: "rejeitadas", value: "rejected", icon: "i-lucide-x" },
];

const { $api } = useNuxtApp();

const { data: requests } = await useFetch<iPageNumberPagination<tArtRequestOut>>(
    "/art-requests",
    {
        $fetch: $api,
        key: "art-requests",
    },
);

const requestsResults = computed(() => requests.value?.results ?? []);

async function approveRequest(requestId: number) {}

async function rejectRequest(requestId: number) {}
</script>

<template>
    <div class="size-full p-10 space-y-10 flex flex-col overflow-hidden">
        <UTabs v-model="tabActive" variant="link" :items="tabs" />
        <UPageGrid
            :ui="{
                base: 'lg:gap-4 lg:grid-cols-3 overflow-y-auto p-1',
            }"
        >
            <UPageCard
                v-for="request in requestsResults"
                :key="request.id"
                :title="request.form_response"
                :description="request.description"
                :ui="{
                    body: '',
                    container: 'p-20',
                    footer: 'w-full flex flex-col gap-3',
                }"
            >
                <template #footer>
                    <div
                        class="flex flex-row gap-2 justify-between items-center"
                    >
                        <UUser
                            :name="request.createdBy.name"
                            :description="request.createdBy.description"
                            :avatar="{
                                icon: 'i-lucide-user',
                            }"
                        />

                        <NuxtTime
                            class="text-neutral-400 text-sm"
                            :datetime="request.createdAt"
                            locale="pt-BR"
                            year="numeric"
                            month="long"
                            day="numeric"
                            hour="2-digit"
                            minute="2-digit"
                        />
                    </div>
                    <div class="flex gap-2 w-full">
                        <UButton
                            block
                            label="Rejeitar"
                            variant="outline"
                            color="neutral"
                            icon="i-lucide-x"
                            @click="rejectRequest(request.id)"
                        />
                        <UButton
                            block
                            label="Aprovar"
                            color="primary"
                            icon="i-lucide-check"
                            @click="approveRequest(request.id)"
                        />
                    </div>
                </template>
            </UPageCard>
        </UPageGrid>
    </div>
</template>
