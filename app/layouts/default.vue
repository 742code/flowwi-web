<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { DropdownMenuItem } from "@nuxt/ui/runtime/components/DropdownMenu.vue.js";

const open = ref(false);

const toast = useToast();
const { $api } = useNuxtApp();
const { getUser, clearUser } = useUser();

const user = getUser();

const logout = async () => {
    try {
        await $api("/auth/logout/", {
            method: "POST",
        });

        clearUser();

        toast.add({
            title: "Logged out",
            description: "You have been logged out successfully.",
            color: "success",
        });

        await navigateTo("/account/login");
    } catch (error) {
        toast.add({
            title: "Error",
            description: "An error occurred while logging out.",
            color: "error",
        });
    }
};

const links = [
    [
        {
            label: "Home",
            icon: "i-lucide-house",
            to: "/",
            onSelect: () => {
                open.value = false;
            },
        },
        {
            label: "Inbox",
            icon: "i-lucide-mailbox",
            to: "/inbox",
            onSelect: () => {
                open.value = false;
            },
        },
    ],
    [
        {
            label: "Design",
            icon: "i-lucide-wallpaper",
            children: [
                {
                    label: "Arts",
                    icon: "i-lucide-rectangle-horizontal",
                    to: "/art/files",
                    onSelect: () => {
                        open.value = false;
                    },
                },
                {
                    label: "Requests",
                    icon: "i-lucide-boom-box",
                    to: "/art/requests",
                    onSelect: () => {
                        open.value = false;
                    },
                },
            ],
        },
        {
            label: "Form",
            icon: "i-lucide-file-text",
            children: [
                {
                    label: "Modelos",
                    icon: "i-lucide-layout-panel-top",
                    to: "/form/templates",
                    onSelect: () => {
                        open.value = false;
                    },
                },
                {
                    label: "Respostas",
                    icon: "i-lucide-check-check",
                    to: "/form/answers",
                    onSelect: () => {
                        open.value = false;
                    },
                },
            ],
        },
    ],
] satisfies NavigationMenuItem[][];

const dropdownItems = [
    {
        label: "Logout",
        icon: "i-lucide-log-out",
        onSelect: logout,
    },
] satisfies DropdownMenuItem[];
</script>

<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            v-model:open="open"
            id="default"
            mode="drawer"
            toggle-side="right"
            resizable
            collapsible
        >
            <template #default="{ collapsed }">
                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="links"
                    :ui="{
                        link: 'group',
                        linkTrailingIcon:
                            'invisible group-hover:visible size-3',
                        separator: 'hidden',
                    }"
                    variant="pill"
                    color="neutral"
                    orientation="vertical"
                    tooltip
                    popover
                />
            </template>

            <template #footer="{ collapsed }"> </template>
        </UDashboardSidebar>

        <UDashboardPanel id="dashboard">
            <UDashboardNavbar toggle-side="left">
                <template #left>
                    <UButton
                        label="Flowwi"
                        icon="i-lucide-bot"
                        color="neutral"
                        variant="link"
                    />
                </template>

                <template #right>
                    <UDropdownMenu
                        :items="dropdownItems"
                        :content="{
                            align: 'end',
                            side: 'bottom',
                            sideOffset: 8,
                        }"
                    >
                        <UUser
                            to="#"
                            :avatar="{
                                icon: 'i-lucide-user',
                            }"
                            :name="user?.first_name"
                            :description="user?.email"
                        />
                    </UDropdownMenu>
                </template>
            </UDashboardNavbar>
            <slot />
        </UDashboardPanel>
    </UDashboardGroup>
</template>
