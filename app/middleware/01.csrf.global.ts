export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!import.meta.client) return;

  const csrf = useCookie<string | undefined>("csrftoken");

  if (!csrf.value) {
    await $fetch("/access/csrf/", {
      baseURL: "/api",
      credentials: "include",
    });
  }
});
