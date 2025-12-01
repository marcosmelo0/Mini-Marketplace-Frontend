<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Card from "$lib/components/ui/Card.svelte";
    import Loading from "$lib/components/ui/Loading.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import { getServices, getServiceTypes } from "$lib/api/services";
    import { searchServices } from "$lib/api/search";
    import type { Service } from "$lib/types/api";

    let services = $state<Service[]>([]);
    let categories = $state<string[]>([]);
    let loading = $state(true);
    let currentPage = $state(1);
    let totalPages = $state(1);
    let selectedCategory = $state<string | null>(null);
    let searchQuery = $state("");
    let selectedSort = $state("newest");

    $effect(() => {
        const params = $page.url.searchParams;
        const category = params.get("category");
        const q = params.get("q");

        selectedCategory = category;
        searchQuery = q || "";
        currentPage = 1;
    });

    $effect(() => {
        const _ = selectedCategory;
        const __ = searchQuery;
        const ___ = selectedSort;
        const ____ = currentPage;

        loadServices();
    });

    function getSortParams(): { sort?: string; order?: "asc" | "desc" } {
        switch (selectedSort) {
            case "price_asc":
                return { sort: "price", order: "asc" };
            case "price_desc":
                return { sort: "price", order: "desc" };
            case "rating_desc":
                return { sort: "rating", order: "desc" };
            case "newest":
            default:
                return { sort: "createdAt", order: "desc" };
        }
    }

    async function loadServices() {
        loading = true;
        try {
            let response;
            const sortParams = getSortParams();

            if (searchQuery) {
                response = await searchServices(searchQuery, currentPage);
            } else {
                response = await getServices({
                    page: currentPage,
                    limit: 12,
                    category: selectedCategory || undefined,
                    ...sortParams,
                });
            }

            services = response.data;
            totalPages = response.pagination.totalPages;
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        } finally {
            loading = false;
        }
    }

    onMount(async () => {
        try {
            categories = await getServiceTypes();
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    });

    function handleCategoryClick(category: string | null) {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        goto(`/services?${params.toString()}`);
    }

    function handleSortChange(e: Event) {
        const target = e.target as HTMLSelectElement;
        selectedSort = target.value;
    }

    function handlePageChange(newPage: number) {
        currentPage = newPage;
        loadServices();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
</script>

<svelte:head>
    <title>Serviços - Mini Marketplace</title>
</svelte:head>

<div class="max-w-7xl mx-auto">
    <div class="flex gap-8">
        <!-- Sidebar com filtros -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
            <div
                class="glass-dark rounded-2xl p-6 border border-purple-500/20 sticky top-24"
            >
                <h2 class="text-lg font-semibold mb-4 text-white">
                    Categorias
                </h2>

                <div class="space-y-2">
                    <button
                        onclick={() => handleCategoryClick(null)}
                        class="w-full text-left px-4 py-2 rounded-xl transition-all {!selectedCategory
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'text-gray-300 hover:bg-slate-700/50'}"
                    >
                        Todas
                    </button>

                    {#each categories as category}
                        <button
                            onclick={() => handleCategoryClick(category)}
                            class="w-full text-left px-4 py-2 rounded-xl transition-all {selectedCategory ===
                            category
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'text-gray-300 hover:bg-slate-700/50'}"
                        >
                            {category}
                        </button>
                    {/each}
                </div>
            </div>
        </aside>

        <!-- Conteúdo principal -->
        <main class="flex-1 min-w-0">
            <!-- Header Section -->
            <div class="mb-8 space-y-6">
                <!-- Title -->
                <div>
                    <h1 class="text-3xl font-bold text-white mb-1">
                        {#if searchQuery}
                            Resultados para "<span class="gradient-primary"
                                >{searchQuery}</span
                            >"
                        {:else if selectedCategory}
                            <span class="gradient-primary"
                                >{selectedCategory}</span
                            >
                        {:else}
                            Todos os <span class="gradient-primary"
                                >Serviços</span
                            >
                        {/if}
                    </h1>
                    <p class="text-gray-400 text-sm">
                        Encontre o serviço perfeito para você
                    </p>
                </div>

                <!-- Search Bar and Sorting Controls -->
                <div
                    class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
                >
                    <!-- Mobile Category Filter -->
                    <div class="lg:hidden w-full sm:w-auto">
                        <select
                            value={selectedCategory || ""}
                            onchange={(e) =>
                                handleCategoryClick(
                                    e.currentTarget.value || null,
                                )}
                            class="w-full appearance-none bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer hover:bg-slate-800 transition-colors"
                        >
                            <option value="">Todas as Categorias</option>
                            {#each categories as category}
                                <option value={category}>{category}</option>
                            {/each}
                        </select>
                    </div>
                    <!-- Search Bar -->
                    <div class="flex-1">
                        <SearchBar />
                    </div>

                    <!-- Sorting Controls -->
                    <div class="flex items-center gap-3 flex-shrink-0">
                        <label
                            for="sort"
                            class="text-gray-400 text-sm font-medium whitespace-nowrap"
                            >Ordenar por:</label
                        >
                        <select
                            id="sort"
                            value={selectedSort}
                            onchange={handleSortChange}
                            class="appearance-none bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-purple-500 cursor-pointer hover:bg-slate-800 transition-colors min-w-[160px]"
                        >
                            <option value="newest">Mais Recentes</option>
                            <option value="price_asc">Menor Preço</option>
                            <option value="price_desc">Maior Preço</option>
                            <option value="rating_desc">Melhor Avaliação</option
                            >
                        </select>
                    </div>
                </div>
            </div>

            {#if loading}
                <Loading />
            {:else if services.length === 0}
                <div
                    class="glass-dark rounded-2xl p-12 text-center border border-purple-500/20"
                >
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-medium text-white mb-2">
                        Nenhum serviço encontrado
                    </h3>
                    <p class="text-gray-400">
                        Tente buscar por outro termo ou categoria
                    </p>
                </div>
            {:else}
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {#each services as service, i}
                        <Motion
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            let:motion
                        >
                            <a
                                href="/services/{service.id}"
                                use:motion
                                class="group cursor-pointer block"
                            >
                                <div
                                    class="glass-dark rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-200 h-full border border-purple-500/10 hover:border-purple-500/30"
                                >
                                    {#if service.photos && service.photos.length > 0}
                                        <div class="relative overflow-hidden">
                                            <img
                                                src={service.photos[0]}
                                                alt={service.name}
                                                loading="lazy"
                                                class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div
                                                class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-40"
                                            ></div>
                                        </div>
                                    {:else}
                                        <div
                                            class="h-48 bg-linear-to-br from-purple-600/80 to-pink-600/80 flex items-center justify-center"
                                        >
                                            <span class="text-6xl">🔧</span>
                                        </div>
                                    {/if}

                                    <div class="p-6 space-y-3">
                                        <div>
                                            <h3
                                                class="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors"
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
                                            class="text-sm text-gray-400 line-clamp-2"
                                        >
                                            {service.description}
                                        </p>

                                        <div
                                            class="flex items-center justify-between pt-3 border-t border-slate-700/30"
                                        >
                                            <div
                                                class="flex items-center space-x-2"
                                            >
                                                <div
                                                    class="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold"
                                                >
                                                    {service.provider?.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <span
                                                    class="text-sm text-gray-400"
                                                >
                                                    {service.provider?.name}
                                                </span>
                                            </div>

                                            {#if service.variations && service.variations.length > 0}
                                                <span
                                                    class="text-lg font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                                                >
                                                    R$ {service.variations[0]
                                                        .price}
                                                </span>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Motion>
                    {/each}
                </div>

                <!-- Paginação -->
                {#if totalPages > 1}
                    <div
                        class="flex justify-center items-center space-x-4 mt-12"
                    >
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onclick={() => handlePageChange(currentPage - 1)}
                            class="bg-slate-800/50 border-purple-500/30 hover:border-purple-500 text-white"
                        >
                            ← Anterior
                        </Button>

                        <span class="text-sm text-gray-400">
                            Página {currentPage} de {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onclick={() => handlePageChange(currentPage + 1)}
                            class="bg-slate-800/50 border-purple-500/30 hover:border-purple-500 text-white"
                        >
                            Próxima →
                        </Button>
                    </div>
                {/if}
            {/if}
        </main>
    </div>
</div>
