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
    let photoFile = $state<File | null>(null);
    let photoPreview = $state<string | null>(null);

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

    function handlePhotoChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];

        if (file) {
            photoFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    function removePhoto() {
        photoFile = null;
        photoPreview = null;
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        submitting = true;

        try {
            const photos: string[] = [];
            if (photoPreview) {
                photos.push(photoPreview);
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
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                        Foto do Serviço
                    </label>

                    {#if photoPreview}
                        <div class="relative mb-3">
                            <img
                                src={photoPreview}
                                alt="Preview"
                                class="w-full h-64 object-cover rounded-xl border border-slate-700"
                            />
                            <button
                                type="button"
                                onclick={removePhoto}
                                class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
                            >
                                🗑️
                            </button>
                        </div>
                    {/if}

                    <div
                        class="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors bg-slate-800/30"
                    >
                        <input
                            type="file"
                            id="photo-upload"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onchange={handlePhotoChange}
                            class="hidden"
                        />
                        <label
                            for="photo-upload"
                            class="cursor-pointer flex flex-col items-center justify-center"
                        >
                            <span class="text-4xl mb-2">📷</span>
                            <span class="text-purple-400 font-medium mb-1"
                                >Clique para enviar uma foto</span
                            >
                            <span class="text-xs text-gray-500"
                                >JPG, PNG ou WEBP</span
                            >
                        </label>
                    </div>
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
