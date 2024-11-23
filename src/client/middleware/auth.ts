export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore();
    if (!authStore.isLogin || !authStore.profile) return
  } catch (e: any) {
    return navigateTo("/auth/login");
  }
});
