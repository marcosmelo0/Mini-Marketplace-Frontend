<script lang="ts">
  import { goto } from "$app/navigation";
  import { Motion } from "svelte-motion";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { authStore } from "$lib/stores/auth";

  let name = $state("");
  let email = $state("");
  let password = $state("");
  let phone = $state("");
  let role = $state<"CLIENT" | "PROVIDER">("CLIENT");
  let loading = $state(false);
  let error = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = "";
    loading = true;

    try {
      await authStore.register({ name, email, password, phone, role });

      if (role === "PROVIDER") {
        goto("/provider/dashboard");
      } else {
        goto("/");
      }
    } catch (err: any) {
      error = err.message || "Erro ao criar conta";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Cadastro - Mini Marketplace</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
  <Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    let:motion
  >
    <div use:motion class="w-full max-w-md">
      <div class="glass-dark rounded-3xl p-8 border border-purple-500/20">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">
            Criar <span class="gradient-primary">Conta</span>
          </h1>
          <p class="text-gray-400">Junte-se à nossa comunidade</p>
        </div>

        {#if error}
          <div
            class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p class="text-sm text-red-400">{error}</p>
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-5">
          <!-- Seleção de tipo de conta -->
          <div class="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onclick={() => (role = "CLIENT")}
              class="p-4 rounded-xl border-2 transition-all {role === 'CLIENT'
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-slate-700 hover:border-slate-600'}"
            >
              <div class="text-3xl mb-2">👤</div>
              <div class="text-sm font-medium text-white">Cliente</div>
              <div class="text-xs text-gray-400">Contratar serviços</div>
            </button>

            <button
              type="button"
              onclick={() => (role = "PROVIDER")}
              class="p-4 rounded-xl border-2 transition-all {role === 'PROVIDER'
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-slate-700 hover:border-slate-600'}"
            >
              <div class="text-3xl mb-2">💼</div>
              <div class="text-sm font-medium text-white">Provedor</div>
              <div class="text-xs text-gray-400">Oferecer serviços</div>
            </button>
          </div>

          <Input type="text" label="Nome Completo" bind:value={name} required />

          <Input type="email" label="Email" bind:value={email} required />

          <Input type="tel" label="Telefone" bind:value={phone} required />

          <Input type="password" label="Senha" bind:value={password} required />

          <Button
            type="submit"
            variant="primary"
            class="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3"
            {loading}
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400 text-sm">
            Já tem uma conta?
            <a
              href="/auth/login"
              class="text-purple-400 hover:text-purple-300 font-medium"
            >
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  </Motion>
</div>
