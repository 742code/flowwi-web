import type { iUserOut } from "~/interfaces/user";

export const useUser = () => {
  const user = useState<iUserOut | null | undefined>("user", () => undefined);

  const isLogged = computed(() => !!user.value);
  const hasUser = computed(() => user.value !== undefined);
  const isPending = computed(() => user.value === undefined);

  function setUser(data: iUserOut) {
    user.value = data;
  }

  function getUser() {
    return user.value;
  }

  function clearUser() {
    user.value = null;
  }

  function resetUser() {
    user.value = undefined;
  }

  return {
    isLogged,
    hasUser,
    isPending,
    clearUser,
    resetUser,
    setUser,
    getUser,
  };
};
