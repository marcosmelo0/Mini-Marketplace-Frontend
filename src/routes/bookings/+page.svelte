<script lang="ts">
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Loading from "$lib/components/ui/Loading.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import ConfirmModal from "$lib/components/ui/ConfirmModal.svelte";
    import ReviewModal from "$lib/components/ReviewModal.svelte";
    import {
        getMyBookings,
        getProviderBookings,
        cancelBooking,
    } from "$lib/api/bookings";
    import { authStore, isInitialized } from "$lib/stores/auth";
    import { toastStore } from "$lib/stores/toast";
    import type { Booking } from "$lib/types/api";
    import { formatBrazilDate, formatBrazilTime } from "$lib/utils/date";

    let clientBookings = $state<Booking[]>([]);
    let providerBookings = $state<Booking[]>([]);
    let loading = $state(true);
    let filter = $state<"all" | "CONFIRMED" | "CANCELLED" | "COMPLETED">("all");
    let activeTab = $state<"client" | "provider">("client");
    let hasCheckedAuth = $state(false);
    let showReviewModal = $state(false);
    let selectedBookingForReview = $state<Booking | null>(null);
    let showCancelModal = $state(false);
    let bookingToCancel = $state<string | null>(null);

    $effect(() => {
        if ($isInitialized && !hasCheckedAuth) {
            hasCheckedAuth = true;
            if (!$authStore.user) {
                goto("/auth/login");
            } else {
                loadBookings();
            }
        }
    });

    async function loadBookings() {
        loading = true;
        try {
            if ($authStore.user?.role === "PROVIDER") {
                // Providers can see both their client bookings and provider bookings
                const [clientRes, providerRes] = await Promise.all([
                    getMyBookings(),
                    getProviderBookings(),
                ]);
                clientBookings = clientRes.data;
                providerBookings = providerRes.data;
            } else {
                // Clients only see their bookings
                const response = await getMyBookings();
                clientBookings = response.data;
                providerBookings = [];
            }
        } catch (error) {
            console.error("Erro ao carregar agendamentos:", error);
        } finally {
            loading = false;
        }
    }

    function openCancelModal(id: string) {
        bookingToCancel = id;
        showCancelModal = true;
    }

    async function confirmCancelBooking() {
        if (!bookingToCancel) return;

        try {
            await cancelBooking(bookingToCancel);
            await loadBookings();
            toastStore.success("Agendamento cancelado com sucesso!");
        } catch (error: any) {
            toastStore.error(error.message || "Erro ao cancelar agendamento");
        } finally {
            bookingToCancel = null;
        }
    }

    function cancelCancelBooking() {
        bookingToCancel = null;
    }

    function openReviewModal(booking: Booking) {
        selectedBookingForReview = booking;
        showReviewModal = true;
    }

    function closeReviewModal() {
        showReviewModal = false;
        selectedBookingForReview = null;
    }

    async function handleReviewSuccess() {
        await loadBookings();
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case "CONFIRMED":
                return "bg-blue-500/10 text-blue-300 border-blue-500/30";
            case "CANCELLED":
                return "bg-red-500/10 text-red-300 border-red-500/30";
            case "COMPLETED":
                return "bg-green-500/10 text-green-300 border-green-500/30";
            default:
                return "bg-gray-500/10 text-gray-300 border-gray-500/30";
        }
    }

    function getStatusLabel(status: string): string {
        switch (status) {
            case "CONFIRMED":
                return "Confirmado";
            case "CANCELLED":
                return "Cancelado";
            case "COMPLETED":
                return "Concluído";
            default:
                return status;
        }
    }

    let bookings = $derived(
        activeTab === "client" ? clientBookings : providerBookings,
    );

    let filteredBookings = $derived(
        filter === "all"
            ? bookings
            : bookings.filter((b) => b.status === filter),
    );

    let isProvider = $derived($authStore.user?.role === "PROVIDER");
</script>

<svelte:head>
    <title>Meus Agendamentos - Mini Marketplace</title>
</svelte:head>

<Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    let:motion
>
    <div use:motion class="max-w-5xl mx-auto">
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">
                {#if isProvider && activeTab === "provider"}
                    Minha <span class="gradient-primary"
                        >Agenda de Trabalho</span
                    >
                {:else}
                    Meus <span class="gradient-primary">Agendamentos</span>
                {/if}
            </h1>
            <p class="text-gray-400">
                {#if isProvider && activeTab === "provider"}
                    Gerencie os agendamentos recebidos dos seus clientes
                {:else}
                    Gerencie seus agendamentos de serviços
                {/if}
            </p>
        </div>

        <!-- Tabs (only for providers) -->
        {#if isProvider}
            <div
                class="flex space-x-3 mb-6 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50 w-fit"
            >
                <button
                    onclick={() => (activeTab = "client")}
                    class="px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap {activeTab ===
                    'client'
                        ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'}"
                >
                    📅 Meus Agendamentos
                </button>
                <button
                    onclick={() => (activeTab = "provider")}
                    class="px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap {activeTab ===
                    'provider'
                        ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'}"
                >
                    💼 Minha Agenda de Trabalho
                </button>
            </div>
        {/if}

        <!-- Filtros -->
        <div class="flex space-x-3 mb-8 overflow-x-auto pb-2">
            <button
                onclick={() => (filter = "all")}
                class="px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap {filter ===
                'all'
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700'}"
            >
                📋 Todos
            </button>
            <button
                onclick={() => (filter = "CONFIRMED")}
                class="px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap {filter ===
                'CONFIRMED'
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700'}"
            >
                ✅ Confirmados
            </button>
            <button
                onclick={() => (filter = "COMPLETED")}
                class="px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap {filter ===
                'COMPLETED'
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700'}"
            >
                🎉 Concluídos
            </button>
            <button
                onclick={() => (filter = "CANCELLED")}
                class="px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap {filter ===
                'CANCELLED'
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700'}"
            >
                ❌ Cancelados
            </button>
        </div>

        {#if loading}
            <Loading />
        {:else if filteredBookings.length === 0}
            <div
                class="glass-dark rounded-3xl p-12 text-center border border-purple-500/20"
            >
                <div class="text-6xl mb-4">📅</div>
                <h3 class="text-xl font-medium text-white mb-2">
                    Nenhum agendamento encontrado
                </h3>
                <p class="text-gray-400 mb-6">
                    Você ainda não tem agendamentos {filter !== "all"
                        ? `com status "${getStatusLabel(filter)}"`
                        : ""}
                </p>
                <Button
                    onclick={() => goto("/services")}
                    class="bg-linear-to-r from-purple-600 to-pink-600"
                >
                    Buscar Serviços
                </Button>
            </div>
        {:else}
            <div class="space-y-4">
                {#each filteredBookings as booking, i}
                    <Motion
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        let:motion
                    >
                        <div
                            use:motion
                            class="glass-dark rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all"
                        >
                            <div
                                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                                <div class="flex-1">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3
                                            class="text-xl font-semibold text-white"
                                        >
                                            {booking.serviceVariation?.service
                                                ?.name}
                                        </h3>
                                        <span
                                            class="px-3 py-1 rounded-full text-xs font-medium border {getStatusColor(
                                                booking.status,
                                            )}"
                                        >
                                            {getStatusLabel(booking.status)}
                                        </span>
                                    </div>

                                    <p class="text-sm text-gray-400 mb-4">
                                        {booking.serviceVariation?.name}
                                    </p>

                                    <div
                                        class="flex flex-wrap gap-4 text-sm text-gray-400"
                                    >
                                        <div
                                            class="flex items-center space-x-2"
                                        >
                                            <span>📅</span>
                                            <span>
                                                {formatBrazilDate(
                                                    booking.start_time,
                                                )}
                                            </span>
                                        </div>

                                        <div
                                            class="flex items-center space-x-2"
                                        >
                                            <span>⏰</span>
                                            <span>
                                                {formatBrazilTime(
                                                    booking.start_time,
                                                )} - {formatBrazilTime(
                                                    booking.end_time,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="mt-4">
                                        <span
                                            class="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                                        >
                                            R$ {booking.final_price}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex flex-col space-y-2 md:w-40">
                                    {#if booking.status === "CONFIRMED"}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onclick={() =>
                                                openCancelModal(booking.id)}
                                            class="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-300"
                                        >
                                            ❌ Cancelar
                                        </Button>
                                    {:else if booking.status === "COMPLETED" && activeTab === "client"}
                                        <Button
                                            size="sm"
                                            onclick={() =>
                                                openReviewModal(booking)}
                                            class="bg-linear-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:from-yellow-500/20 hover:to-orange-500/20 text-yellow-300"
                                        >
                                            ⭐ Avaliar
                                        </Button>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </Motion>
                {/each}
            </div>
        {/if}
    </div>
</Motion>

<!-- Cancel Confirmation Modal -->
<ConfirmModal
    bind:open={showCancelModal}
    title="Cancelar Agendamento"
    message="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
    confirmText="Cancelar Agendamento"
    cancelText="Voltar"
    variant="danger"
    onConfirm={confirmCancelBooking}
    onCancel={cancelCancelBooking}
/>

<!-- Review Modal -->
{#if selectedBookingForReview}
    <ReviewModal
        booking={selectedBookingForReview}
        isOpen={showReviewModal}
        onClose={closeReviewModal}
        onSuccess={handleReviewSuccess}
    />
{/if}
