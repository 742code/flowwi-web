export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: "/api",
    credentials: "include",

    onRequest({ options }) {
      const csrf = useCookie<string | undefined>("csrftoken");
      const workflow = useCookie<string | undefined>("workflow");

      const headers = new Headers(options.headers);

      if (csrf.value) {
        headers.set("X-CSRFToken", csrf.value);
      }

      if (workflow.value) {
        headers.set("X-Workflow", workflow.value);
      }

      options.headers = headers;
    },
  });

  return {
    provide: { api },
  };
});
