<script setup lang="ts">
import type { SupportedBlockType, BlockDraft } from "../_types/block";
import { blockTypeMeta, getDefaultConfig } from "../_utils/blockParser";

const props = defineProps<{
    block: BlockDraft;
}>();

// O emit "close" é obrigatório para o useOverlay poder awaitar o resultado
const emit = defineEmits<{
    (
        e: "close",
        value?:
            | { action: "update"; block: BlockDraft }
            | { action: "remove" }
            | { action: "duplicate" },
    ): void;
}>();

// ─── Cópia local reativa para edição ─────────────────────────────────────────
// Trabalhamos numa cópia para não mutar o prop diretamente.
// Ao confirmar, emitimos o bloco atualizado de volta.

const draft = reactive<BlockDraft>(JSON.parse(JSON.stringify(props.block)));

const blockTypeSelectItems = Object.entries(blockTypeMeta).map(
    ([value, m]) => ({
        label: m.label,
        value,
    }),
);

// Reset config quando o tipo muda
watch(
    () => draft.type,
    (newType, oldType) => {
        if (newType !== oldType) draft.config = getDefaultConfig(newType);
    },
);

// ─── Select options ───────────────────────────────────────────────────────────

function addOption() {
    (draft.config.options as { label: string; value: string }[]).push({
        label: "",
        value: "",
    });
}

function removeOption(idx: number) {
    (draft.config.options as { label: string; value: string }[]).splice(idx, 1);
}

// ─── Actions ─────────────────────────────────────────────────────────────────

function onSave() {
    emit("close", {
        action: "update",
        block: JSON.parse(JSON.stringify(draft)),
    });
}

function onDuplicate() {
    // Salva as edições atuais e sinaliza duplicação
    emit("close", { action: "duplicate" });
}

function onRemove() {
    emit("close", { action: "remove" });
}
</script>

<template>
    <USlideover side="right">
        <template #header>
            <div class="flex items-center gap-2">
                <UIcon
                    :name="blockTypeMeta[draft.type].icon"
                    class="size-4 text-neutral-400"
                />
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">
                        {{ draft.title || "Sem título" }}
                    </p>
                    <p class="text-xs text-neutral-400">
                        {{ blockTypeMeta[draft.type].label }}
                    </p>
                </div>
            </div>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 p-4">
                <UFormField label="Título">
                    <UInput
                        v-model="draft.title"
                        class="w-full"
                        placeholder="Título da pergunta"
                    />
                </UFormField>

                <UFormField label="Tipo">
                    <USelect
                        v-model="draft.type"
                        class="w-full"
                        :items="blockTypeSelectItems"
                        value-key="value"
                    />
                </UFormField>

                <UFormField label="Opções">
                    <UCheckbox v-model="draft.required" label="Obrigatório" />
                </UFormField>

                <UDivider />

                <!-- SHORT TEXT -->
                <template v-if="draft.type === 'short_text'">
                    <UFormField label="Mín. caracteres">
                        <UInput
                            v-model.number="(draft.config as any).min_length"
                            class="w-full"
                            type="number"
                            :min="0"
                            placeholder="—"
                        />
                    </UFormField>
                    <UFormField label="Máx. caracteres">
                        <UInput
                            v-model.number="(draft.config as any).max_length"
                            class="w-full"
                            type="number"
                            :min="0"
                            placeholder="—"
                        />
                    </UFormField>
                    <UFormField label="Pattern (regex)" hint="opcional">
                        <UInput
                            v-model="(draft.config as any).pattern"
                            class="w-full font-mono"
                            placeholder="Ex: ^[a-zA-Z]+$"
                        />
                    </UFormField>
                </template>

                <!-- NUMBER -->
                <template v-else-if="draft.type === 'number'">
                    <UFormField label="Min">
                        <UInput
                            v-model.number="(draft.config as any).min"
                            class="w-full"
                            type="number"
                            placeholder="—"
                        />
                    </UFormField>
                    <UFormField label="Max">
                        <UInput
                            v-model.number="(draft.config as any).max"
                            class="w-full"
                            type="number"
                            placeholder="—"
                        />
                    </UFormField>
                    <UFormField label="Step">
                        <UInput
                            v-model.number="(draft.config as any).step"
                            class="w-full"
                            type="number"
                            placeholder="1"
                        />
                    </UFormField>
                </template>

                <!-- DATE -->
                <template v-else-if="draft.type === 'date'">
                    <UFormField label="Data mínima">
                        <UInput
                            v-model="(draft.config as any).min_date"
                            class="w-full"
                            type="date"
                        />
                    </UFormField>
                    <UFormField label="Data máxima">
                        <UInput
                            v-model="(draft.config as any).max_date"
                            class="w-full"
                            type="date"
                        />
                    </UFormField>
                </template>

                <!-- SELECT -->
                <template v-else-if="draft.type === 'select'">
                    <UFormField label="Opções">
                        <div class="flex flex-col gap-2 w-full">
                            <div
                                v-for="(opt, oIdx) in draft.config
                                    .options as any[]"
                                :key="oIdx"
                                class="flex gap-1.5 items-center"
                            >
                                <UInput
                                    v-model="opt.label"
                                    placeholder="Label"
                                    class="flex-1 min-w-0"
                                />
                                <UInput
                                    v-model="opt.value"
                                    placeholder="Value"
                                    class="flex-1 min-w-0 font-mono"
                                />
                                <UButton
                                    icon="i-lucide-x"
                                    color="neutral"
                                    variant="ghost"
                                    size="xs"
                                    :disabled="
                                        (draft.config.options as any[])
                                            .length <= 1
                                    "
                                    @click="removeOption(oIdx)"
                                />
                            </div>
                            <UButton
                                label="Adicionar opção"
                                size="xs"
                                color="neutral"
                                variant="ghost"
                                icon="i-lucide-plus"
                                @click="addOption"
                            />
                        </div>
                    </UFormField>
                    <UFormField label="Comportamento">
                        <UCheckbox
                            v-model="(draft.config as any).multiple"
                            label="Múltipla escolha"
                        />
                    </UFormField>
                </template>

                <!-- FILE -->
                <template v-else-if="draft.type === 'file'">
                    <UFormField
                        label="Tipos aceitos"
                        hint="separados por vírgula"
                    >
                        <UInput
                            :model-value="
                                ((draft.config as any).accept as string[]).join(
                                    ', ',
                                )
                            "
                            @update:model-value="
                                (v: string) =>
                                    ((draft.config as any).accept = v
                                        .split(',')
                                        .map((s: string) => s.trim())
                                        .filter(Boolean))
                            "
                            class="w-full"
                            placeholder=".pdf, .png, image/*"
                        />
                    </UFormField>
                    <UFormField label="Tamanho máx. (bytes)">
                        <UInput
                            v-model.number="(draft.config as any).max_size"
                            class="w-full"
                            type="number"
                            :min="0"
                            placeholder="Ex: 5242880"
                        />
                    </UFormField>
                    <UFormField label="Comportamento">
                        <UCheckbox
                            v-model="(draft.config as any).multiple"
                            label="Múltiplos arquivos"
                        />
                    </UFormField>
                </template>
            </div>
        </template>

        <template #footer>
            <div class="flex flex-col gap-2 w-full p-4">
                <UButton
                    label="Salvar"
                    color="primary"
                    icon="i-lucide-check"
                    class="w-full"
                    @click="onSave"
                />
                <div class="flex gap-2">
                    <UButton
                        label="Duplicar"
                        color="neutral"
                        variant="outline"
                        icon="i-lucide-copy"
                        class="flex-1"
                        @click="onDuplicate"
                    />
                    <UButton
                        label="Remover"
                        color="error"
                        variant="outline"
                        icon="i-lucide-trash-2"
                        class="flex-1"
                        @click="onRemove"
                    />
                </div>
            </div>
        </template>
    </USlideover>
</template>
