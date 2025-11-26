<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Motion } from "svelte-motion";
  import Button from "$lib/components/ui/Button.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Loading from "$lib/components/ui/Loading.svelte";
  import { getPopularServices } from "$lib/api/services";
  import type { Service } from "$lib/types/api";

  let searchQuery = $state("");
  let popularServices = $state<Service[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const servicesData = await getPopularServices(1, 6);
      popularServices = servicesData.data || [];
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      popularServices = [];
    } finally {
      loading = false;
    }
  });

  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      goto(`/services?q=${encodeURIComponent(searchQuery)}`);
    } else {
      goto("/services");
    }
  }
</script>

<svelte:head>
  <title>Mini Marketplace - Encontre Serviços Profissionais</title>
</svelte:head>

<!-- Hero Section -->
<section class="relative py-24 overflow-hidden">
  <!-- Animated background circles - mais suaves -->
  <div
    class="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
  ></div>
  <div
    class="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
  ></div>

  <Motion
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    let:motion
  >
    <div use:motion class="relative max-w-4xl mx-auto text-center px-4">
      <h1 class="text-6xl md:text-7xl font-bold mb-6">
        <span class="text-white">Encontre os</span>
        <br />
        <span class="gradient-primary text-transparent bg-clip-background"
          >Melhores Profissionais</span
        >
      </h1>
      <p class="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
        Conectamos você com prestadores de serviços qualificados na sua região
        ✨
      </p>

      <form onsubmit={handleSearch} class="max-w-2xl mx-auto">
        <div
          class="flex gap-3 bg-slate-800/40 backdrop-blur-md p-2 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all"
        >
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="🔍 Buscar serviços (ex: manicure, pintor, eletricista...)"
            class="flex-1 px-6 py-4 rounded-xl bg-transparent border-0 focus:outline-none text-white placeholder-gray-400"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            class="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 shadow-lg"
          >
            Buscar
          </Button>
        </div>
      </form>
    </div>
  </Motion>
</section>

{#if loading}
  <Loading />
{:else}
  <!-- Popular Services Section -->
  {#if popularServices.length > 0}
    <section class="pb-20 max-w-7xl mx-auto">
      <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        let:motion
      >
        <div use:motion class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">
            Serviços em <span class="gradient-secondary">Destaque</span>
          </h2>
          <p class="text-gray-400 text-lg">
            Os serviços mais procurados da plataforma 🌟
          </p>
        </div>
      </Motion>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each popularServices as service, i}
          <Motion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            let:motion
          >
            <a
              href="/services/{service.id}"
              use:motion
              class="group cursor-pointer block"
            >
              <div
                class="glass-dark rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-200 h-full border border-purple-500/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
              >
                {#if service.photos && service.photos.length > 0}
                  <div class="relative overflow-hidden">
                    <img
                      src={service.photos[0]}
                      alt={service.name}
                      loading="lazy"
                      class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-40"
                    ></div>
                  </div>
                {:else}
                  <div
                    class="relative h-56 bg-linear-to-br from-purple-600/80 to-pink-600/80 flex items-center justify-center overflow-hidden"
                  >
                    <span class="text-7xl relative z-10">🔧</span>
                  </div>
                {/if}

                <div class="p-6 space-y-4">
                  <div>
                    <h3
                      class="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-200"
                    >
                      {service.name}
                    </h3>
                    <span
                      class="inline-block px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
                    >
                      {service.category}
                    </span>
                  </div>

                  <p class="text-gray-400 line-clamp-2 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  <div
                    class="flex items-center justify-between pt-3 border-t border-slate-700/30"
                  >
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold"
                      >
                        {service.provider?.name.charAt(0).toUpperCase()}
                      </div>
                      <span class="text-sm text-gray-400">
                        {service.provider?.name}
                      </span>
                    </div>
                    {#if service.variations && service.variations.length > 0}
                      <span
                        class="text-lg font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                      >
                        R$ {service.variations[0].price}
                      </span>
                    {/if}
                  </div>
                </div>
              </div>
            </a>
          </Motion>
        {/each}
      </div>

      <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        let:motion
      >
        <div use:motion class="text-center mt-12">
          <Button
            variant="outline"
            onclick={() => goto("/services")}
            class="bg-slate-800/50 border-2 border-purple-500/30 hover:border-purple-500 text-white hover:bg-purple-500/20 px-8 py-3 text-lg"
          >
            Ver Todos os Serviços →
          </Button>
        </div>
      </Motion>
    </section>
  {/if}

  <!-- How It Works Section -->
  <Motion
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    let:motion
  >
    <section
      use:motion
      class="py-20 glass-dark rounded-3xl border border-purple-500/20"
    >
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-white mb-4">
          Como <span class="gradient-primary">Funciona</span>
        </h2>
        <p class="text-gray-400 text-lg">Simples, rápido e eficiente</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
        {#each [{ icon: "🔍", title: "1. Busque", desc: "Encontre o serviço que você precisa", color: "from-purple-500 to-pink-500" }, { icon: "📅", title: "2. Agende", desc: "Escolha data e horário disponível", color: "from-pink-500 to-orange-500" }, { icon: "✨", title: "3. Aproveite", desc: "Receba o serviço com qualidade", color: "from-orange-500 to-yellow-500" }] as step, i}
          <Motion
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.2 }}
            let:motion
          >
            <div use:motion class="text-center group">
              <div class="relative inline-block mb-6">
                <div
                  class="absolute inset-0 bg-linear-to-br {step.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
                ></div>
                <div
                  class="relative w-20 h-20 bg-linear-to-br {step.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform"
                >
                  <span class="text-4xl">{step.icon}</span>
                </div>
              </div>
              <h3
                class="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors"
              >
                {step.title}
              </h3>
              <p class="text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </Motion>
        {/each}
      </div>
    </section>
  </Motion>
{/if}
