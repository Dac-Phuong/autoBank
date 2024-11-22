export default defineNuxtRouteMiddleware(async (to, from) => {
    const { setAuth } = useAuthStore();
    const runtimeConfig = useRuntimeConfig();
    const token = useCookie('token-auth', runtimeConfig.public.cookieConfig);
    if (to.path === '/auth/login' && token.value)  return navigateTo('/');
    if (!token.value && to.path !== '/auth/login' && to.path !== '/auth/register') return navigateTo('/auth/login');
    try {
        if (token.value) return await setAuth();
    } catch (e) {
        token.value = null;
        return navigateTo('/auth/login');
    }
});

