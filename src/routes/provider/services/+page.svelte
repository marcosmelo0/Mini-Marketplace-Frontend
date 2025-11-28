<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Loading from "$lib/components/ui/Loading.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { getMyServices, deleteService } from "$lib/api/services";
    import { authStore, isInitialized } from "$lib/stores/auth";
    import { toastStore } from "$lib/stores/toast";
    import type { Service } from "$lib/types/api";

    let services = $state<Service[]>([]);
    let loading = $state(true);
    let hasCheckedAuth = $state(false);

    $effect(() => {
        if ($isInitialized && !hasCheckedAuth) {
            hasCheckedAuth = true;
            if (!$authStore.user || $authStore.user.role !== "PROVIDER") {
                goto("/auth/login");
            } else {
                loadServices();
            }
        }
    });

    async function loadServices() {
        loading = true;
        try {
            const response = await getMyServices();
            services = response.data;
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        } finally {
            loading = false;
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir este serviço?")) {
            return;
        }

        try {
            await deleteService(id);
            await loadServices();
            toastStore.success("Serviço excluído com sucesso!");
        } catch (error: any) {
            toastStore.error(error.message || "Erro ao excluir serviço");
        }
    }
</script>

<svelte:head>
    <title>Meus Serviços - Mini Marketplace</title>
</svelte:head>

<Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    let:motion
>
    <div use:motion class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-4xl font-bold text-white mb-2">
                    Meus <span class="gradient-primary">Serviços</span>
                </h1>
                <p class="text-gray-400">
                    Gerencie os serviços que você oferece
                </p>
            </div>
            <Button
                onclick={() => goto("/provider/services/new")}
                class="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
                ➕ Novo Serviço
            </Button>
        </div>

        {#if loading}
            <Loading />
        {:else if services.length === 0}
            <div
                class="glass-dark rounded-3xl p-12 text-center border border-purple-500/20"
            >
                <div class="text-6xl mb-4">🔧</div>
                <h3 class="text-xl font-medium text-white mb-2">
                    Nenhum serviço cadastrado
                </h3>
                <p class="text-gray-400 mb-6">
                    Comece criando seu primeiro serviço
                </p>
                <Button
                    onclick={() => goto("/provider/services/new")}
                    class="bg-linear-to-r from-purple-600 to-pink-600"
                >
                    ➕ Criar Primeiro Serviço
                </Button>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each services as service, i}
                    <Motion
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        let:motion
                    >
                        <div
                            use:motion
                            class="glass-dark rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/30 transition-all"
                        >
                            {#if service.photos && service.photos.length > 0}
                                <img
                                    src={service.photos[0]}
                                    alt={service.name}
                                    loading="lazy"
                                    class="w-full h-48 object-cover"
                                />
                            {:else}
                                <div
                                    class="h-48 bg-linear-to-br from-purple-600/80 to-pink-600/80 flex items-center justify-center"
                                >
                                    <span class="text-6xl">🔧</span>
                                </div>
                            {/if}

                            <div class="p-6">
                                <div class="mb-3">
                                    <h3
                                        class="text-xl font-bold text-white mb-2"
                                    >
                                        {service.name}
                                    </h3>
                                    <span
                                        class="inline-block px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
                                    >
                                        {service.category}
                                    </span>
                                </div>

                                <p
                                    class="text-sm text-gray-400 line-clamp-2 mb-4"
                                >
                                    {service.description}
                                </p>

                                <div class="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onclick={() =>
                                            goto(
                                                `/provider/services/${service.id}`,
                                            )}
                                        class="flex-1 bg-slate-800/50 border-purple-500/30 hover:border-purple-500 text-white"
                                    >
                                        ✏️ Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onclick={() => handleDelete(service.id)}
                                        class="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-300"
                                    >
                                        🗑️
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Motion>
                {/each}
            </div>
        {/if}
    </div>
</Motion>
