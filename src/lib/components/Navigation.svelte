<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { authStore, isAuthenticated, isProvider } from "$lib/stores/auth";
    import { notificationsStore } from "$lib/stores/notifications";

    let mobileMenuOpen = $state(false);
    let userMenuOpen = $state(false);

    $effect(() => {
        if ($isProvider) {
            notificationsStore.fetch();
            notificationsStore.startPolling();
        }

        return () => {
            notificationsStore.stopPolling();
        };
    });

    async function handleLogout() {
        await authStore.logout();
        goto("/");
    }
</script>

<nav
    class="glass-dark border-b border-purple-500/20 sticky top-0 z-50 backdrop-blur-xl"
>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                <a href="/" class="flex items-center cursor-pointer group">
                    <span class="text-2xl font-bold gradient-primary">
                        ✨ Mini Marketplace
                    </span>
                </a>

                <div class="hidden sm:ml-8 sm:flex sm:space-x-2">
                    <a
                        href="/services"
                        class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer text-gray-300 hover:text-white hover:bg-purple-500/20 border border-transparent hover:border-purple-500/30"
                    >
                        🔍 Serviços
                    </a>

                    {#if $isAuthenticated}
                        {#if $isProvider}
                            <a
                                href="/provider/dashboard"
                                class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer text-gray-300 hover:text-white hover:bg-purple-500/20 border border-transparent hover:border-purple-500/30"
                            >
                                📊 Dashboard
                            </a>
                        {:else}
                            <a
                                href="/bookings"
                                class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer text-gray-300 hover:text-white hover:bg-purple-500/20 border border-transparent hover:border-purple-500/30"
                            >
                                📅 Meus Agendamentos
                            </a>
                        {/if}
                    {/if}
                </div>
            </div>

            <div class="flex items-center space-x-3">
                {#if $isAuthenticated}
                    {#if $isProvider && $notificationsStore.unreadCount > 0}
                        <a
                            href="/provider/notifications"
                            class="relative p-2 text-gray-400 hover:text-purple-400 transition-colors cursor-pointer"
                        >
                            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>
                            <span
                                class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-linear-to-r from-pink-500 to-purple-500 rounded-full"
                            >
                                {$notificationsStore.unreadCount}
                            </span>
                        </a>
                    {/if}

                    <div class="relative">
                        <button
                            onclick={() => (userMenuOpen = !userMenuOpen)}
                            class="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-purple-500/20 transition-all cursor-pointer border border-transparent hover:border-purple-500/30"
                        >
                            <div
                                class="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
                            >
                                {$authStore.user?.name.charAt(0).toUpperCase()}
                            </div>
                            <svg
                                class="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {#if userMenuOpen}
                            <div
                                class="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-purple-500/30"
                            >
                                <div
                                    class="px-4 py-3 border-b border-slate-700/50"
                                >
                                    <p class="text-sm font-medium text-white">
                                        {$authStore.user?.name}
                                    </p>
                                    <p class="text-xs text-gray-400 truncate">
                                        {$authStore.user?.email}
                                    </p>
                                </div>

                                {#if $isProvider}
                                    <a
                                        href="/provider/dashboard"
                                        class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer transition-colors"
                                    >
                                        📊 Dashboard
                                    </a>
                                    <a
                                        href="/provider/services"
                                        class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer transition-colors"
                                    >
                                        🔧 Meus Serviços
                                    </a>
                                    <a
                                        href="/provider/bookings"
                                        class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer transition-colors"
                                    >
                                        📅 Agendamentos
                                    </a>
                                    <a
                                        href="/provider/notifications"
                                        class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer transition-colors"
                                    >
                                        🔔 Notificações
                                    </a>
                                {:else}
                                    <a
                                        href="/bookings"
                                        class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer transition-colors"
                                    >
                                        📅 Meus Agendamentos
                                    </a>
                                {/if}

                                <div
                                    class="border-t border-slate-700/50 my-2"
                                ></div>

                                <a
                                    href="/profile"
                                    class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer transition-colors"
                                >
                                    👤 Perfil
                                </a>
                                <button
                                    onclick={handleLogout}
                                    class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer transition-colors"
                                >
                                    🚪 Sair
                                </button>
                            </div>
                        {/if}
                    </div>
                {:else}
                    <a
                        href="/auth/login"
                        class="text-gray-300 hover:text-white transition-colors cursor-pointer px-4 py-2 rounded-xl hover:bg-purple-500/20"
                    >
                        Entrar
                    </a>
                    <a
                        href="/auth/register"
                        class="px-5 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all cursor-pointer font-medium"
                    >
                        Cadastrar
                    </a>
                {/if}
            </div>
        </div>
    </div>
</nav>
