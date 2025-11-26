<script lang="ts">
  import { goto } from "$app/navigation";
  import { Motion } from "svelte-motion";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { authStore } from "$lib/stores/auth";

  let email = $state("");
  let password = $state("");
  let loading = $state(false);
  let error = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = "";
    loading = true;

    try {
      const user = await authStore.login({ email, password });

      if (user.role === "PROVIDER") {
        goto("/provider/dashboard");
      } else {
        goto("/");
      }
    } catch (err: any) {
      error = err.message || "Erro ao fazer login";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - Mini Marketplace</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4">
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
            Bem-vindo de <span class="gradient-primary">Volta</span>
          </h1>
          <p class="text-gray-400">Entre para continuar</p>
        </div>

        {#if error}
          <div
            class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p class="text-sm text-red-400">{error}</p>
          </div>
        {/if}

        <form onsubmit={handleSubmit} class="space-y-5">
          <div>
            <Input type="email" label="Email" bind:value={email} required />
          </div>

          <div>
            <Input
              type="password"
              label="Senha"
              bind:value={password}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            class="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3"
            {loading}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400 text-sm">
            Não tem uma conta?
            <a
              href="/auth/register"
              class="text-purple-400 hover:text-purple-300 font-medium"
            >
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  </Motion>
</div>
