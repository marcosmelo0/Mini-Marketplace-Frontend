<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import Navigation from "$lib/components/Navigation.svelte";
  import Toast from "$lib/components/ui/Toast.svelte";
  import RouteGuard from "$lib/components/RouteGuard.svelte";
  import { authStore } from "$lib/stores/auth";

  onMount(() => {
    authStore.loadUser();
  });
</script>

<div
  class="flex flex-col min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500/30"
>
  <Toast />
  <Navigation />

  <main class="relative z-10 grow pt-8 pb-16 px-4 sm:px-6 lg:px-8">
    <RouteGuard>
      <slot />
    </RouteGuard>
  </main>

  <footer
    class="relative z-10 glass-dark border-t border-purple-500/20 mt-auto"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p class="text-center text-gray-400 text-sm">
        © 2025 Mini Marketplace. Todos os direitos reservados. ✨
      </p>
    </div>
  </footer>
</div>
