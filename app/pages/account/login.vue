<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

definePageMeta({
    layout: "auth",
});

const toast = useToast();

const { $api } = useNuxtApp();
const { resetUser } = useUser();

const fields: AuthFormField[] = [
    {
        name: "username",
        label: "Username",
        type: "username",
        placeholder: "Enter your username",
        required: true,
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
    },
];

const schema = z.object({
    username: z.string("Username is required"),
    password: z
        .string("Password is required")
        .min(8, "Must be at least 8 characters")
        .max(64, "Must be "),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    try {
        await $api("/access/login/", {
            body: payload.data,
            method: "POST",
            onResponseError: ({ response }) => {
                if (response.status === 401) {
                    toast.add({
                        title: "Authentication Error",
                        color: "error",
                        description: "Username or password is incorrect",
                    });
                }
            },
        });
        resetUser();
        await navigateTo("/");
    } catch {
        toast.add({
            title: "Network Error",
            color: "error",
            description: "Could not connect to the server.",
        });
    }
}
</script>

<template>
    <UPageCard class="w-full max-w-md" variant="ghost">
        <UAuthForm
            :schema="schema"
            title="Login"
            description="Enter your credentials to access your account."
            :fields="fields"
            @submit="onSubmit"
        />
    </UPageCard>
</template>
