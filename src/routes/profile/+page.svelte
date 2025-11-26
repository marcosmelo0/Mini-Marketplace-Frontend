<script lang="ts">
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import { authStore, isInitialized } from "$lib/stores/auth";

    let name = $state("");
    let phone = $state("");
    let loading = $state(false);
    let error = $state("");
    let success = $state(false);
    let hasCheckedAuth = $state(false);

    $effect(() => {
        if ($isInitialized && !hasCheckedAuth) {
            hasCheckedAuth = true;
            if (!$authStore.user) {
                goto("/auth/login");
            } else {
                name = $authStore.user.name;
                phone = $authStore.user.phone;
            }
        }
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        error = "";
        success = false;
        loading = true;

        try {
            await authStore.updateProfile({ name, phone });
            success = true;
            setTimeout(() => (success = false), 3000);
        } catch (err: any) {
            error = err.message || "Erro ao atualizar perfil";
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Meu Perfil - Mini Marketplace</title>
</svelte:head>

<Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    let:motion
>
    <div use:motion class="max-w-3xl mx-auto">
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">
                Meu <span class="gradient-primary">Perfil</span>
            </h1>
            <p class="text-gray-400">Gerencie suas informações pessoais</p>
        </div>

        <div
            class="glass-dark rounded-3xl p-8 border border-purple-500/20 mb-6"
        >
            <div
                class="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-700/50"
            >
                <div
                    class="w-24 h-24 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                >
                    {$authStore.user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 class="text-2xl font-semibold text-white mb-1">
                        {$authStore.user?.name}
                    </h2>
                    <p class="text-gray-400 mb-2">{$authStore.user?.email}</p>
                    <span
                        class="inline-block px-3 py-1 text-xs font-medium bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
                    >
                        {$authStore.user?.role === "CLIENT"
                            ? "👤 Cliente"
                            : "💼 Provedor"}
                    </span>
                </div>
            </div>

            {#if success}
                <div
                    class="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                >
                    <p class="text-sm text-green-300">
                        ✅ Perfil atualizado com sucesso!
                    </p>
                </div>
            {/if}

            {#if error}
                <div
                    class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                >
                    <p class="text-sm text-red-300">❌ {error}</p>
                </div>
            {/if}

            <form onsubmit={handleSubmit} class="space-y-5">
                <Input
                    type="text"
                    label="Nome Completo"
                    bind:value={name}
                    required
                />

                <Input
                    type="email"
                    label="Email"
                    value={$authStore.user?.email || ""}
                    disabled
                />

                <Input
                    type="tel"
                    label="Telefone"
                    bind:value={phone}
                    required
                />

                <div class="flex space-x-3 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        class="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        {loading}
                        disabled={loading}
                    >
                        {loading ? "💾 Salvando..." : "💾 Salvar Alterações"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onclick={() => goto("/")}
                        class="bg-slate-800/50 border-slate-700 text-white"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>

        <div class="glass-dark rounded-3xl p-8 border border-purple-500/20">
            <h3 class="text-xl font-semibold text-white mb-6">
                📊 Informações da Conta
            </h3>

            <div class="space-y-4 text-sm">
                <div
                    class="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl"
                >
                    <span class="text-gray-400">Membro desde</span>
                    <span class="text-white font-medium">
                        {new Date(
                            $authStore.user?.created_at || "",
                        ).toLocaleDateString("pt-BR")}
                    </span>
                </div>

                <div
                    class="flex justify-between items-center p-4 bg-slate-800/30 rounded-xl"
                >
                    <span class="text-gray-400">Última atualização</span>
                    <span class="text-white font-medium">
                        {new Date(
                            $authStore.user?.updated_at || "",
                        ).toLocaleDateString("pt-BR")}
                    </span>
                </div>
            </div>
        </div>
    </div>
</Motion>
