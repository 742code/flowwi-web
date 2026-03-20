export type SupportedBlockType =
    | "short_text"
    | "number"
    | "date"
    | "select"
    | "file";

export type BlockDraft = {
    key: string;
    title: string;
    type: SupportedBlockType;
    required: boolean;
    order: number;
    config: Record<string, unknown>;
};
