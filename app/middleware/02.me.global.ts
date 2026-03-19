import type { iUserOut } from "~/interfaces/user";

const publicPages = new Set(["/account/login", "/account/register"]);

export default defineNuxtRouteMiddleware(async (to) => {
  const toast = useToast();

  const { $api } = useNuxtApp();
  const { isPending, isLogged, setUser, clearUser } = useUser();

  const isPublicPage = publicPages.has(to.path);

  if (isPending.value) {
    try {
      const userData = await $api<iUserOut>("users/me/");
      setUser(userData);
    } catch {
      clearUser();
    }
  }

  if (!isLogged.value) {
    if (isPublicPage) return;

    toast.add({
      title: "Sessão expirada",
      description: "Faça login novamente para continuar.",
      color: "error",
    });

    return navigateTo("/account/login");
  }

  if (isPublicPage) return navigateTo("/");
});
