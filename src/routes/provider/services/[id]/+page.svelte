<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Loading from "$lib/components/ui/Loading.svelte";
    import { getServiceById, updateService } from "$lib/api/services";
    import { authStore, isInitialized } from "$lib/stores/auth";
    import type { Service } from "$lib/types/api";

    import { toastStore } from "$lib/stores/toast";

    let service = $state<Service | null>(null);
    let loading = $state(true);
    let submitting = $state(false);
    let hasCheckedAuth = $state(false);

    // Form fields
    let name = $state("");
    let description = $state("");
    let category = $state("");

    const serviceId = $derived($page.params.id as string);

    $effect(() => {
        if ($isInitialized && !hasCheckedAuth) {
            hasCheckedAuth = true;
            if (!$authStore.user || $authStore.user.role !== "PROVIDER") {
                goto("/auth/login");
            } else {
                loadService();
            }
        }
    });

    async function loadService() {
        loading = true;
        try {
            service = await getServiceById(serviceId);
            name = service.name;
            description = service.description;
            category = service.category;
        } catch (err: any) {
            toastStore.error(err.message || "Erro ao carregar serviço");
            goto("/provider/services");
        } finally {
            loading = false;
        }
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        submitting = true;

        try {
            await updateService(serviceId, {
                name,
                description,
                category,
            });
            toastStore.success("Serviço atualizado com sucesso!");
            setTimeout(() => {
                goto("/provider/services");
            }, 1000);
        } catch (err: any) {
            toastStore.error(err.message || "Erro ao atualizar serviço");
        } finally {
            submitting = false;
        }
    }
</script>

<svelte:head>
    <title>Editar Serviço - Mini Marketplace</title>
</svelte:head>

{#if loading}
    <Loading />
{:else if !service}
    <div class="max-w-3xl mx-auto">
        <div
            class="glass-dark rounded-3xl p-12 text-center border border-red-500/20"
        >
            <div class="text-6xl mb-4">❌</div>
            <h3 class="text-xl font-medium text-white mb-2">
                Serviço não encontrado
            </h3>
            <Button
                onclick={() => goto("/provider/services")}
                class="bg-linear-to-r from-purple-600 to-pink-600"
            >
                Voltar para Serviços
            </Button>
        </div>
    </div>
{:else}
    <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        let:motion
    >
        <div use:motion class="max-w-3xl mx-auto px-4">
            <div class="mb-8">
                <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Editar <span class="gradient-primary">Serviço</span>
                </h1>
                <p class="text-gray-400 text-sm sm:text-base">
                    Atualize as informações do seu serviço
                </p>
            </div>

            <div
                class="glass-dark rounded-3xl p-4 sm:p-6 md:p-8 border border-purple-500/20"
            >
                <form onsubmit={handleSubmit} class="space-y-5">
                    <Input
                        type="text"
                        label="Nome do Serviço"
                        bind:value={name}
                        required
                    />

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Descrição
                        </label>
                        <textarea
                            bind:value={description}
                            rows="4"
                            required
                            class="w-full px-4 py-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-800/50 text-white placeholder-gray-400"
                            placeholder="Descreva seu serviço..."
                        ></textarea>
                    </div>

                    <Input
                        type="text"
                        label="Categoria"
                        bind:value={category}
                        required
                        placeholder="Ex: Beleza, Reparos, Limpeza..."
                    />

                    <div class="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onclick={() => goto("/provider/services")}
                            class="w-full sm:flex-1 bg-slate-800/50 border-slate-700 text-white order-2 sm:order-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            class="w-full sm:flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 order-1 sm:order-2"
                            loading={submitting}
                            disabled={submitting}
                        >
                            {submitting
                                ? "💾 Salvando..."
                                : "💾 Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </Motion>
{/if}
