<script lang="ts">
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Loading from "$lib/components/ui/Loading.svelte";
    import { authStore, isInitialized } from "$lib/stores/auth";
    import { notificationsStore } from "$lib/stores/notifications";

    let hasCheckedAuth = $state(false);

    $effect(() => {
        if ($isInitialized && !hasCheckedAuth) {
            hasCheckedAuth = true;
            if (!$authStore.user || $authStore.user.role !== "PROVIDER") {
                goto("/auth/login");
            } else {
                notificationsStore.fetch();
            }
        }
    });

    async function handleMarkAsRead(id: string) {
        await notificationsStore.markAsRead(id);
    }
</script>

<svelte:head>
    <title>Notificações - Mini Marketplace</title>
</svelte:head>

<Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    let:motion
>
    <div use:motion class="max-w-4xl mx-auto">
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">
                <span class="gradient-primary">Notificações</span>
            </h1>
            <p class="text-gray-400">
                Acompanhe as atualizações dos seus serviços
            </p>
        </div>

        {#if $notificationsStore.isLoading}
            <Loading />
        {:else if $notificationsStore.notifications.length === 0}
            <div
                class="glass-dark rounded-3xl p-12 text-center border border-purple-500/20"
            >
                <div class="text-6xl mb-4">🔔</div>
                <h3 class="text-xl font-medium text-white mb-2">
                    Nenhuma notificação
                </h3>
                <p class="text-gray-400">Você está em dia com tudo!</p>
            </div>
        {:else}
            <div class="space-y-3">
                {#each $notificationsStore.notifications as notification, i}
                    <Motion
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        let:motion
                    >
                        <div
                            use:motion
                            class="glass-dark rounded-2xl p-6 border transition-all {notification.read
                                ? 'border-slate-700/30'
                                : 'border-purple-500/30 bg-purple-500/5'}"
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="text-2xl">
                                            {notification.type === "NEW_BOOKING"
                                                ? "📅"
                                                : "❌"}
                                        </span>
                                        <h3
                                            class="text-lg font-semibold text-white"
                                        >
                                            {notification.title}
                                        </h3>
                                        {#if !notification.read}
                                            <span
                                                class="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                                            >
                                                Novo
                                            </span>
                                        {/if}
                                    </div>

                                    <p class="text-gray-400 mb-3">
                                        {notification.message}
                                    </p>

                                    <span class="text-xs text-gray-500">
                                        {new Date(
                                            notification.created_at,
                                        ).toLocaleString("pt-BR")}
                                    </span>
                                </div>

                                {#if !notification.read}
                                    <button
                                        onclick={() =>
                                            handleMarkAsRead(notification.id)}
                                        class="px-4 py-2 text-sm bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30 transition-all"
                                    >
                                        ✓ Marcar como lida
                                    </button>
                                {/if}
                            </div>
                        </div>
                    </Motion>
                {/each}
            </div>
        {/if}
    </div>
</Motion>
