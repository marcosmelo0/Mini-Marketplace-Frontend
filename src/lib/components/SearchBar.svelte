<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/Button.svelte";
    import { searchServices, getRecentSearches } from "$lib/api/search";
    import { debounce } from "$lib/utils/debounce";
    import { authStore } from "$lib/stores/auth";

    let searchQuery = $state("");
    let suggestions = $state<string[]>([]);
    let showSuggestions = $state(false);
    let isRecent = $state(false);

    const fetchSuggestions = debounce(async (query: string) => {
        if (!query.trim()) {
            suggestions = [];
            return;
        }
        try {
            const response = await searchServices(query, 1, 5);
            const names = response.data.map((s) => s.name);
            suggestions = [...new Set(names)];
            showSuggestions = true;
            isRecent = false;
        } catch (e) {
            console.error("Erro ao buscar sugestões:", e);
        }
    }, 300);

    async function handleFocus() {
        if (!searchQuery.trim()) {
            if ($authStore.user) {
                try {
                    const res = await getRecentSearches();
                    suggestions = res.searches || [];
                    if (suggestions.length > 0) {
                        showSuggestions = true;
                        isRecent = true;
                    }
                } catch (e) {
                    console.error("Erro ao buscar recentes:", e);
                }
            }
        } else {
            if (suggestions.length > 0) showSuggestions = true;
        }
    }

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        searchQuery = target.value;
        if (!searchQuery.trim()) {
            handleFocus(); // Show recent searches if input is cleared
        } else {
            fetchSuggestions(searchQuery);
        }
    }

    function selectSuggestion(s: string) {
        searchQuery = s;
        showSuggestions = false;
        goto(`/services?q=${encodeURIComponent(s)}`);
    }

    function handleSearch(e: Event) {
        e.preventDefault();
        showSuggestions = false;
        if (searchQuery.trim()) {
            goto(`/services?q=${encodeURIComponent(searchQuery)}`);
        } else {
            goto("/services");
        }
    }

    function handleClickOutside(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest(".search-container")) {
            showSuggestions = false;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<form onsubmit={handleSearch} class="w-full mx-auto relative search-container">
    <div
        class="flex flex-col sm:flex-row gap-2 sm:gap-3 bg-slate-800/40 backdrop-blur-md p-2 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all z-20 relative"
    >
        <input
            type="text"
            value={searchQuery}
            oninput={handleInput}
            onfocus={handleFocus}
            placeholder="🔍 Buscar serviços..."
            class="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-transparent border-0 focus:outline-none text-white placeholder-gray-400 text-sm sm:text-base"
        />
        <Button
            type="submit"
            variant="primary"
            size="lg"
            class="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 sm:px-8 shadow-lg w-full sm:w-auto"
        >
            Buscar
        </Button>
    </div>

    <!-- Autocomplete Dropdown -->
    {#if showSuggestions && suggestions.length > 0}
        <div
            class="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-10 max-h-80 overflow-y-auto custom-scrollbar"
        >
            {#if isRecent}
                <div
                    class="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-slate-700/50"
                >
                    Buscas Recentes
                </div>
            {/if}
            <div class="py-2">
                {#each suggestions as suggestion}
                    <button
                        type="button"
                        class="w-full text-left px-6 py-3 text-gray-300 hover:bg-purple-500/20 hover:text-white transition-colors flex items-center gap-3"
                        onclick={() => selectSuggestion(suggestion)}
                    >
                        <span class="text-gray-500"
                            >{isRecent ? "🕒" : "🔍"}</span
                        >
                        {suggestion}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</form>
