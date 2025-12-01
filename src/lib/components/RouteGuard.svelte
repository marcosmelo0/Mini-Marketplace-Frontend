<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { authStore, isInitialized } from "$lib/stores/auth";
    import Loading from "$lib/components/ui/Loading.svelte";

    let { children } = $props();
    let checking = $state(true);

    $effect(() => {
        if ($isInitialized) {
            checkAuth();
        }
    });

    function checkAuth() {
        const path = $page.url.pathname;
        const user = $authStore.user;
        const isAuthenticated = !!user;

        // Rotas públicas que não precisam de verificação
        const publicRoutes = ["/", "/services", "/about", "/contact"];
        const isPublicRoute =
            publicRoutes.includes(path) || path.startsWith("/services/");
        const isAuthRoute = path.startsWith("/auth/");

        // 1. Se estiver tentando acessar rotas de auth (login/register) e já estiver logado
        if (isAuthRoute && isAuthenticated) {
            if (user.role === "PROVIDER") {
                goto("/provider/dashboard");
            } else {
                goto("/");
            }
            return;
        }

        // 2. Se for rota pública ou de auth, permite acesso
        if (isPublicRoute || isAuthRoute) {
            checking = false;
            return;
        }

        // 3. Se não estiver logado e tentar acessar rota protegida
        if (!isAuthenticated) {
            // Salvar URL para redirecionar depois (opcional, pode ser implementado depois)
            goto("/auth/login");
            return;
        }

        // 4. Verificação de Roles

        // Rotas de Provider
        if (path.startsWith("/provider")) {
            if (user.role !== "PROVIDER") {
                goto("/"); // Ou página de erro 403
                return;
            }
        }

        // Rotas de Client (ex: /bookings)
        // Assumindo que /bookings é para clientes, providers veem /provider/bookings
        if (path === "/bookings" || path.startsWith("/bookings/")) {
            // Permitir que PROVIDER também acesse a área de cliente (para reservar serviços de outros)
            if (user.role !== "CLIENT" && user.role !== "PROVIDER") {
                goto("/");
                return;
            }
        }

        // Se passou por todas as verificações
        checking = false;
    }
</script>

{#if !$isInitialized || checking}
    <div class="min-h-screen flex items-center justify-center">
        <Loading />
    </div>
{:else}
    {@render children()}
{/if}
