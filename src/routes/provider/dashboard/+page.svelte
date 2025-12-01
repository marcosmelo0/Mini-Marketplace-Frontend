<script lang="ts">
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Loading from "$lib/components/ui/Loading.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { getProviderBookings } from "$lib/api/bookings";
    import { getMyServices } from "$lib/api/services";
    import { authStore, isInitialized } from "$lib/stores/auth";
    import { notificationsStore } from "$lib/stores/notifications";
    import type { Booking, Service } from "$lib/types/api";
    import { formatBrazilDate, formatBrazilTime } from "$lib/utils/date";

    let bookings = $state<Booking[]>([]);
    let services = $state<Service[]>([]);
    let loading = $state(true);
    let hasCheckedAuth = $state(false);

    $effect(() => {
        if ($isInitialized && !hasCheckedAuth) {
            hasCheckedAuth = true;
            if (!$authStore.user || $authStore.user.role !== "PROVIDER") {
                goto("/auth/login");
            } else {
                loadData();
            }
        }
    });

    async function loadData() {
        loading = true;
        try {
            const [bookingsData, servicesData] = await Promise.all([
                getProviderBookings(),
                getMyServices(),
            ]);

            bookings = bookingsData.data.slice(0, 5);
            services = servicesData.data;
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            loading = false;
        }
    }

    let stats = $derived({
        totalBookings: bookings.length,
        totalServices: services.length,
        unreadNotifications: $notificationsStore.unreadCount,
    });
</script>

<svelte:head>
    <title>Dashboard - Mini Marketplace</title>
</svelte:head>

{#if loading}
    <Loading />
{:else}
    <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        let:motion
    >
        <div use:motion class="max-w-7xl mx-auto px-4">
            <div class="mb-8">
                <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Dashboard do <span class="gradient-primary">Provedor</span>
                </h1>
                <p class="text-gray-400 text-sm sm:text-base">
                    Gerencie seus serviços e agendamentos
                </p>
            </div>

            <!-- Estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Motion
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    let:motion
                >
                    <div
                        use:motion
                        class="glass-dark rounded-2xl p-6 border border-purple-500/20"
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm mb-1">
                                    Agendamentos
                                </p>
                                <p class="text-4xl font-bold text-white">
                                    {stats.totalBookings}
                                </p>
                            </div>
                            <div
                                class="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-4xl"
                            >
                                📅
                            </div>
                        </div>
                    </div>
                </Motion>

                <Motion
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    let:motion
                >
                    <div
                        use:motion
                        class="glass-dark rounded-2xl p-6 border border-purple-500/20"
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm mb-1">
                                    Serviços
                                </p>
                                <p class="text-4xl font-bold text-white">
                                    {stats.totalServices}
                                </p>
                            </div>
                            <div
                                class="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-4xl"
                            >
                                🔧
                            </div>
                        </div>
                    </div>
                </Motion>

                <Motion
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    let:motion
                >
                    <div
                        use:motion
                        class="glass-dark rounded-2xl p-6 border border-purple-500/20"
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-400 text-sm mb-1">
                                    Notificações
                                </p>
                                <p class="text-4xl font-bold text-white">
                                    {stats.unreadNotifications}
                                </p>
                            </div>
                            <div
                                class="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center text-4xl"
                            >
                                🔔
                            </div>
                        </div>
                    </div>
                </Motion>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Próximos Agendamentos -->
                <div
                    class="glass-dark rounded-3xl p-8 border border-purple-500/20"
                >
                    <div
                        class="flex items-center justify-between mb-6 flex-wrap gap-2"
                    >
                        <h2 class="text-xl sm:text-2xl font-bold text-white">
                            📅 Próximos Agendamentos
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onclick={() => goto("/bookings")}
                            class="text-purple-400 hover:text-purple-300 text-sm"
                        >
                            Ver todos →
                        </Button>
                    </div>

                    {#if bookings.length === 0}
                        <p class="text-center text-gray-400 py-8">
                            Nenhum agendamento próximo
                        </p>
                    {:else}
                        <div class="space-y-3">
                            {#each bookings as booking}
                                <div
                                    class="p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all"
                                >
                                    <div
                                        class="flex justify-between items-start mb-2"
                                    >
                                        <h3 class="font-medium text-white">
                                            {booking.serviceVariation?.service
                                                ?.name}
                                        </h3>
                                        <span
                                            class="text-xs px-2 py-1 bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/30"
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-400 mb-2">
                                        {booking.client?.name}
                                    </p>
                                    <div
                                        class="flex items-center space-x-4 text-xs text-gray-500"
                                    >
                                        <span
                                            >📅 {formatBrazilDate(
                                                booking.start_time,
                                            )}</span
                                        >
                                        <span
                                            >⏰ {formatBrazilTime(
                                                booking.start_time,
                                            )}</span
                                        >
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                <!-- Atalhos Rápidos -->
                <div
                    class="glass-dark rounded-3xl p-6 sm:p-8 border border-purple-500/20"
                >
                    <h2 class="text-xl sm:text-2xl font-bold text-white mb-6">
                        ⚡ Atalhos Rápidos
                    </h2>

                    <div class="grid grid-cols-2 gap-3 sm:gap-4">
                        <button
                            onclick={() => goto("/provider/services")}
                            class="p-4 sm:p-6 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 hover:border-purple-500/30 border border-transparent transition-all group"
                        >
                            <div class="text-3xl sm:text-4xl mb-2 sm:mb-3">
                                🔧
                            </div>
                            <div
                                class="text-xs sm:text-sm font-medium text-white group-hover:text-purple-300 transition-colors"
                            >
                                Meus Serviços
                            </div>
                        </button>

                        <button
                            onclick={() => goto("/provider/availability")}
                            class="p-4 sm:p-6 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 hover:border-purple-500/30 border border-transparent transition-all group"
                        >
                            <div class="text-3xl sm:text-4xl mb-2 sm:mb-3">
                                📆
                            </div>
                            <div
                                class="text-xs sm:text-sm font-medium text-white group-hover:text-purple-300 transition-colors"
                            >
                                Disponibilidade
                            </div>
                        </button>

                        <button
                            onclick={() => goto("/bookings")}
                            class="p-4 sm:p-6 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 hover:border-purple-500/30 border border-transparent transition-all group"
                        >
                            <div class="text-3xl sm:text-4xl mb-2 sm:mb-3">
                                📋
                            </div>
                            <div
                                class="text-xs sm:text-sm font-medium text-white group-hover:text-purple-300 transition-colors"
                            >
                                Agendamentos
                            </div>
                        </button>

                        <button
                            onclick={() => goto("/provider/notifications")}
                            class="p-4 sm:p-6 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 hover:border-purple-500/30 border border-transparent transition-all group"
                        >
                            <div class="text-3xl sm:text-4xl mb-2 sm:mb-3">
                                🔔
                            </div>
                            <div
                                class="text-xs sm:text-sm font-medium text-white group-hover:text-purple-300 transition-colors"
                            >
                                Notificações
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Motion>
{/if}
