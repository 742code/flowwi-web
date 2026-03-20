import type { SupportedBlockType } from "../_types/block";

// ─── Block type metadata ──────────────────────────────────────────────────────

export const blockTypeMeta: Record<
    SupportedBlockType,
    { label: string; icon: string }
> = {
    short_text: { label: "Short text", icon: "i-lucide-text" },
    number: { label: "Number", icon: "i-lucide-hash" },
    date: { label: "Date", icon: "i-lucide-calendar" },
    select: { label: "Select", icon: "i-lucide-list" },
    file: { label: "File", icon: "i-lucide-paperclip" },
};

// ─── Default config generation ────────────────────────────────────────────────

/**
 * Retorna a configuração padrão para um tipo de bloco específico.
 * É chamado ao criar um novo bloco e quando o tipo é alterado.
 */
export function getDefaultConfig(
    type: SupportedBlockType,
): Record<string, unknown> {
    switch (type) {
        case "short_text":
            return {
                min_length: null,
                max_length: null,
                pattern: null,
            };
        case "number":
            return {
                min: null,
                max: null,
                step: null,
            };
        case "date":
            return {
                min_date: null,
                max_date: null,
            };
        case "select":
            return {
                options: [{ label: "", value: "" }],
                multiple: false,
            };
        case "file":
            return {
                accept: [],
                max_size: null,
                multiple: false,
            };
    }
}

// ─── Config cleaning ──────────────────────────────────────────────────────────

/**
 * Remove valores vazios, null e arrays vazios da configuração.
 * É chamado antes de enviar a configuração para a API.
 */
export function cleanConfig(
    _type: SupportedBlockType,
    raw: Record<string, unknown>,
): Record<string, unknown> {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(raw)) {
        if (v === null || v === "" || (Array.isArray(v) && v.length === 0))
            continue;
        cleaned[k] = v;
    }
    return cleaned;
}
