<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import { createService, getServiceTypes } from "$lib/api/services";
    import { authStore, isInitialized } from "$lib/stores/auth";
    import { toastStore } from "$lib/stores/toast";

    let submitting = $state(false);
    let hasCheckedAuth = $state(false);
    let categories = $state<string[]>([]);

    // Form fields
    let name = $state("");
    let description = $state("");
    let category = $state("");
    let photoUrl = $state("");

    onMount(async () => {
        try {
            categories = await getServiceTypes();
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    });

    $effect(() => {
        if ($isInitialized && !hasCheckedAuth) {
            hasCheckedAuth = true;
            if (!$authStore.user || $authStore.user.role !== "PROVIDER") {
                goto("/auth/login");
            }
        }
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        submitting = true;

        try {
            const photos: string[] = [];
            if (photoUrl) {
                photos.push(photoUrl);
            }

            await createService({
                name,
                description,
                category,
                photos,
                variations: [],
            });

            toastStore.success("Serviço criado com sucesso!");
            goto("/provider/services");
        } catch (error: any) {
            toastStore.error(error.message || "Erro ao criar serviço");
        } finally {
            submitting = false;
        }
    }
</script>

<svelte:head>
    <title>Novo Serviço - Mini Marketplace</title>
</svelte:head>

<Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    let:motion
>
    <div use:motion class="max-w-2xl mx-auto">
        <div class="mb-8">
            <Button
                variant="outline"
                size="sm"
                onclick={() => goto("/provider/services")}
                class="mb-4 bg-slate-800/50 border-slate-700 text-gray-400 hover:text-white"
            >
                ← Voltar
            </Button>
            <h1 class="text-3xl font-bold text-white mb-2">
                Criar <span class="gradient-primary">Novo Serviço</span>
            </h1>
            <p class="text-gray-400">
                Preencha as informações abaixo para adicionar um novo serviço
            </p>
        </div>

        <div class="glass-dark rounded-3xl p-8 border border-purple-500/20">
            <form onsubmit={handleSubmit} class="space-y-6">
                <Input
                    type="text"
                    label="Nome do Serviço"
                    bind:value={name}
                    required
                    placeholder="Ex: Manutenção de Ar Condicionado"
                />

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Descrição
                    </label>
                    <textarea
                        bind:value={description}
                        rows="4"
                        required
                        class="w-full px-4 py-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-800/50 text-white placeholder-gray-400"
                        placeholder="Descreva detalhadamente o que está incluído no serviço..."
                    ></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Categoria *
                    </label>
                    <select
                        bind:value={category}
                        required
                        class="w-full px-4 py-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-800/50 text-white"
                    >
                        <option value="" disabled
                            >Selecione uma categoria</option
                        >
                        {#each categories as cat}
                            <option value={cat}>{cat}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <Input
                        type="url"
                        label="URL da Foto do Serviço"
                        bind:value={photoUrl}
                        placeholder="https://exemplo.com/imagem.jpg"
                    />

                    {#if photoUrl}
                        <div class="mt-3 relative">
                            <img
                                src={photoUrl}
                                alt="Preview"
                                class="w-full h-64 object-cover rounded-xl border border-slate-700"
                                onerror={(e) => {
                                    const img =
                                        e.currentTarget as HTMLImageElement;
                                    img.src =
                                        "https://placehold.co/600x400?text=Erro+na+Imagem";
                                }}
                            />
                        </div>
                    {/if}
                </div>

                <div class="pt-4 flex flex-col sm:flex-row gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        class="w-full sm:flex-1 bg-slate-800/50 border-slate-700 text-white order-2 sm:order-1"
                        onclick={() => goto("/provider/services")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        class="w-full sm:flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 order-1 sm:order-2"
                        loading={submitting}
                    >
                        Criar Serviço
                    </Button>
                </div>
            </form>
        </div>
    </div>
</Motion>
