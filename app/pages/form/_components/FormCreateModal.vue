<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import type { tFormBlockOut, tFormOut } from "../_schemas/form";
import { LazyCBlockConfigSlideOver } from "#components";
import type { BlockDraft, SupportedBlockType } from "../_types/block";
import { blockTypeMeta, getDefaultConfig, cleanConfig } from "../_utils/blockParser";

const { $api } = useNuxtApp();

const toast = useToast();
const overlay = useOverlay();

const emit = defineEmits<{
    (e: "close", value?: boolean): void;
}>();

const activeTab = ref("options");

const tabs: TabsItem[] = [
    {
        label: "Opções",
        icon: "i-lucide-settings-2",
        value: "options",
        slot: "options",
    },
    {
        label: "Blocos",
        icon: "i-lucide-layout-list",
        value: "blocks",
        slot: "blocks",
    },
];

const blockTypeDropdownItems = [
    Object.entries(blockTypeMeta).map(([value, meta]) => ({
        label: meta.label,
        icon: meta.icon,
        onSelect: () => addBlock(value as SupportedBlockType),
    })),
];

const blocksDraft = ref<BlockDraft[]>([]);
const activeBlockKey = ref<string | null>(null);

const formDraft = reactive({
    title: "",
    description: "",
    is_published: true,
    requires_login: false,
    max_responses: null as number | null,
    expires_at: null as string | null,
    allow_edit: false,
});

function makeEmptyBlockDraft(
    order: number,
    type: SupportedBlockType,
): BlockDraft {
    return {
        key: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        title: "",
        type,
        required: false,
        order,
        config: getDefaultConfig(type),
    };
}

function addBlock(type: SupportedBlockType) {
    const block = makeEmptyBlockDraft(blocksDraft.value.length, type);
    blocksDraft.value.push(block);
    openBlockConfig(block);
}

async function openBlockConfig(block: BlockDraft) {
    activeBlockKey.value = block.key;

    // Cria o slideover com o bloco como prop e aguarda o resultado
    const slideover = overlay.create(LazyCBlockConfigSlideOver, {
        destroyOnClose: true,
        props: { block },
    });

    const result = await slideover.open();

    activeBlockKey.value = null;

    if (!result) return;

    if (result.action === "update") {
        const idx = blocksDraft.value.findIndex(
            (b) => b.key === result.block.key,
        );
        if (idx !== -1) blocksDraft.value[idx] = result.block;
    }

    if (result.action === "duplicate") {
        const idx = blocksDraft.value.findIndex((b) => b.key === block.key);
        if (idx === -1) return;
        const clone: BlockDraft = {
            ...JSON.parse(JSON.stringify(blocksDraft.value[idx])),
            key: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        };
        blocksDraft.value.splice(idx + 1, 0, clone);
        blocksDraft.value = blocksDraft.value.map((b, i) => ({
            ...b,
            order: i,
        }));
    }

    if (result.action === "remove") {
        blocksDraft.value = blocksDraft.value
            .filter((b) => b.key !== block.key)
            .map((b, i) => ({ ...b, order: i }));
    }
}

function blockActionItems(block: BlockDraft) {
    return [
        [
            {
                label: "Configurar",
                icon: "i-lucide-settings-2",
                onSelect: () => openBlockConfig(block),
            },
        ],
        [
            {
                label: "Remover",
                icon: "i-lucide-trash-2",
                color: "error" as const,
                onSelect: () => {
                    blocksDraft.value = blocksDraft.value
                        .filter((b) => b.key !== block.key)
                        .map((b, i) => ({ ...b, order: i }));
                },
            },
        ],
    ];
}

// ─── Submit ───────────────────────────────────────────────────────────────────

const isSubmitting = ref(false);

async function onSubmitCreateForm() {
    if (isSubmitting.value) return;

    if (!formDraft.title.trim()) {
        toast.add({ title: "Título é obrigatório", color: "error" });
        activeTab.value = "options";
        return;
    }

    isSubmitting.value = true;

    try {
        const createdForm = await $api<tFormOut>("/forms/", {
            method: "POST",
            body: {
                title: formDraft.title.trim(),
                description: formDraft.description?.trim() || "",
                is_published: formDraft.is_published,
                requires_login: formDraft.requires_login,
                max_responses: formDraft.max_responses,
                expires_at: formDraft.expires_at,
                allow_edit: formDraft.allow_edit,
            },
        });

        for (const b of [...blocksDraft.value].sort(
            (a, b) => a.order - b.order,
        )) {
            await $api("/form-blocks/", {
                method: "POST",
                body: {
                    form: createdForm.id,
                    title: b.title.trim(),
                    type: b.type,
                    required: b.required,
                    order: b.order,
                    config: cleanConfig(b.type, b.config),
                } satisfies Partial<tFormBlockOut>,
            });
        }

        toast.add({ title: "Formulário criado", color: "success" });
        emit("close", true);
    } catch (e: any) {
        toast.add({
            title: "Falha ao criar formulário",
            color: "error",
            description:
                e?.data?.detail ||
                e?.message ||
                "Verifique os campos e tente novamente.",
        });
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <UModal title="Criar formulário" :ui="{ content: 'max-w-4xl' }">
        <template #body>
            <UTabs
                v-model="activeTab"
                :items="tabs"
                value-key="value"
                variant="link"
                class="w-full"
            >
                <!-- ── Aba: Opções ── -->
                <template #options>
                    <div class="flex flex-col gap-4 pt-4">
                        <UFormField label="Título" required>
                            <UInput
                                v-model="formDraft.title"
                                class="w-full"
                                placeholder="Ex: Pesquisa de satisfação"
                            />
                        </UFormField>

                        <UFormField label="Descrição">
                            <UTextarea
                                v-model="formDraft.description"
                                :rows="3"
                                class="w-full"
                                placeholder="Opcional"
                            />
                        </UFormField>

                        <UFormField label="Status">
                            <USelect
                                v-model="formDraft.is_published"
                                class="w-full"
                                :items="[
                                    { label: 'Publicado', value: true },
                                    { label: 'Rascunho', value: false },
                                ]"
                                value-key="value"
                            />
                        </UFormField>

                        <UFormField
                            label="Quem pode responder"
                            hint="Controla o acesso ao formulário"
                        >
                            <USelect
                                v-model="formDraft.requires_login"
                                class="w-full"
                                :items="[
                                    { label: 'Qualquer pessoa', value: false },
                                    { label: 'Somente logados', value: true },
                                ]"
                                value-key="value"
                            />
                        </UFormField>

                        <UFormField
                            label="Máx. de respostas"
                            hint="Deixe vazio para ilimitado"
                        >
                            <UInput
                                v-model.number="formDraft.max_responses"
                                class="w-full"
                                type="number"
                                :min="1"
                                placeholder="Ilimitado"
                            />
                        </UFormField>

                        <UFormField label="Respostas">
                            <UCheckbox
                                v-model="formDraft.allow_edit"
                                label="Permitir que o respondente edite a resposta"
                            />
                        </UFormField>
                    </div>
                </template>

                <!-- ── Aba: Blocos ── -->
                <template #blocks>
                    <div class="flex flex-col gap-4 pt-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="font-medium">Blocos</p>
                                <p class="text-neutral-500 text-sm">
                                    Defina as perguntas em ordem.
                                </p>
                            </div>
                            <UDropdownMenu :items="blockTypeDropdownItems">
                                <UButton
                                    label="Adicionar bloco"
                                    color="neutral"
                                    variant="ghost"
                                    icon="i-lucide-plus"
                                    trailing-icon="i-lucide-chevron-down"
                                    size="sm"
                                />
                            </UDropdownMenu>
                        </div>

                        <div
                            v-if="blocksDraft.length > 0"
                            class="flex flex-col gap-2"
                        >
                            <div
                                v-for="(block, idx) in blocksDraft"
                                :key="block.key"
                                class="group flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors"
                                :class="
                                    activeBlockKey === block.key
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                                "
                                @click="openBlockConfig(block)"
                            >
                                <UIcon
                                    :name="blockTypeMeta[block.type].icon"
                                    class="size-4 shrink-0 text-neutral-400"
                                />

                                <span
                                    class="flex-1 text-sm truncate"
                                    :class="
                                        block.title ? '' : 'text-neutral-400'
                                    "
                                >
                                    {{ block.title || `Pergunta ${idx + 1}` }}
                                </span>

                                <UBadge
                                    :label="blockTypeMeta[block.type].label"
                                    color="neutral"
                                    variant="subtle"
                                    size="sm"
                                />

                                <UDropdownMenu :items="blockActionItems(block)">
                                    <UButton
                                        icon="i-lucide-ellipsis"
                                        color="neutral"
                                        variant="ghost"
                                        size="xs"
                                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                                        @click.stop
                                    />
                                </UDropdownMenu>
                            </div>
                        </div>

                        <UEmpty
                            v-else
                            title="Nenhum bloco adicionado"
                            variant="naked"
                            description="Use o botão acima para adicionar perguntas ao formulário."
                            :ui="{
                                root: 'border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl py-10',
                            }"
                        />
                    </div>
                </template>
            </UTabs>
        </template>

        <template #footer>
            <div class="flex gap-2 w-full justify-end">
                <UButton
                    label="Cancelar"
                    color="neutral"
                    variant="outline"
                    :disabled="isSubmitting"
                    @click="requestClose()"
                />
                <UButton
                    label="Criar formulário"
                    color="primary"
                    :loading="isSubmitting"
                    @click="onSubmitCreateForm"
                />
            </div>
        </template>
    </UModal>
</template>
