<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

definePageMeta({
    layout: "auth",
});

const toast = useToast();

const fields: AuthFormField[] = [
    {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "Enter your email",
        required: true,
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
    },
    {
        name: "remember",
        label: "Remember me",
        type: "checkbox",
    },
];

const schema = z.object({
    email: z.email("Invalid email"),
    password: z
        .string("Password is required")
        .min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
    console.log("Submitted", payload);
}
</script>

<template>
    <UPageCard class="w-full max-w-md" variant="ghost">
        <UAuthForm
            :schema="schema"
            title="Register"
            description="Create an account to access your dashboard."
            :fields="fields"
            @submit="onSubmit"
        />
    </UPageCard>
</template>
