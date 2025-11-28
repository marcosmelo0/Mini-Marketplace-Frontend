<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Loading from "$lib/components/ui/Loading.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";
    import { getServiceById } from "$lib/api/services";
    import { getServiceReviews, createReview } from "$lib/api/reviews";
    import { isAuthenticated, isClient, currentUser } from "$lib/stores/auth";
    import { toastStore } from "$lib/stores/toast";
    import type { Service, Review } from "$lib/types/api";

    let service = $state<Service | null>(null);
    let reviews = $state<Review[]>([]);
    let loading = $state(true);
    let reviewModalOpen = $state(false);
    let rating = $state(1);
    let comment = $state("");
    let submitting = $state(false);

    const serviceId = $page.params.id as string;

    onMount(async () => {
        try {
            const [serviceData, reviewsData] = await Promise.all([
                getServiceById(serviceId),
                getServiceReviews(serviceId),
            ]);

            service = serviceData;
            reviews = reviewsData.data;
        } catch (error) {
            console.error("Erro ao carregar serviço:", error);
        } finally {
            loading = false;
        }
    });

    async function handleSubmitReview() {
        if (!service) return;

        submitting = true;
        try {
            await createReview({
                serviceId: service.id,
                rating,
                comment,
            });

            const reviewsData = await getServiceReviews(serviceId);
            reviews = reviewsData.data;

            reviewModalOpen = false;
            rating = 1;
            comment = "";
            toastStore.success("Avaliação enviada com sucesso!");
        } catch (error: any) {
            toastStore.error(error.message || "Erro ao enviar avaliação");
        } finally {
            submitting = false;
        }
    }

    function handleBookService(variationId: string) {
        if (!service) return;
        goto(
            `/bookings/new?variationId=${variationId}&serviceId=${service.id}`,
        );
    }

    function calculateAverageRating(): number {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    }
</script>

<svelte:head>
    <title>{service?.name || "Serviço"} - Mini Marketplace</title>
</svelte:head>

{#if loading}
    <Loading />
{:else if !service}
    <div
        class="glass-dark rounded-3xl p-12 text-center border border-purple-500/20"
    >
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-bold text-white mb-4">
            Serviço não encontrado
        </h2>
        <Button
            onclick={() => goto("/services")}
            class="bg-linear-to-r from-purple-600 to-pink-600"
        >
            Voltar para serviços
        </Button>
    </div>
{:else}
    <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        let:motion
    >
        <div use:motion class="max-w-6xl mx-auto px-4">
            <!-- Breadcrumb -->
            <nav class="mb-6 text-sm flex items-center space-x-2 text-gray-400">
                <a href="/" class="hover:text-purple-400 transition-colors"
                    >Home</a
                >
                <span>/</span>
                <a
                    href="/services"
                    class="hover:text-purple-400 transition-colors">Serviços</a
                >
                <span>/</span>
                <span class="text-gray-300 truncate">{service.name}</span>
            </nav>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Coluna principal -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Galeria de fotos -->
                    {#if service.photos && service.photos.length > 0}
                        <div class="grid grid-cols-2 gap-4">
                            {#each service.photos as photo, i}
                                <img
                                    src={photo}
                                    alt="{service.name} - Foto {i + 1}"
                                    loading="lazy"
                                    class="w-full h-64 object-cover rounded-2xl {i ===
                                    0
                                        ? 'col-span-2 h-96'
                                        : ''}"
                                />
                            {/each}
                        </div>
                    {:else}
                        <div
                            class="w-full h-96 bg-linear-to-br from-purple-600/80 to-pink-600/80 rounded-2xl flex items-center justify-center"
                        >
                            <span class="text-9xl">🔧</span>
                        </div>
                    {/if}

                    <!-- Informações do serviço -->
                    <div
                        class="glass-dark rounded-2xl p-4 sm:p-6 md:p-8 border border-purple-500/20"
                    >
                        <div
                            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6"
                        >
                            <div class="flex-1 min-w-0">
                                <h1
                                    class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 break-words"
                                >
                                    {service.name}
                                </h1>
                                <span
                                    class="inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20"
                                >
                                    {service.category}
                                </span>
                            </div>

                            {#if reviews.length > 0}
                                <div class="sm:text-right shrink-0">
                                    <div
                                        class="flex items-center space-x-1 mb-1"
                                    >
                                        {#each Array(5) as _, i}
                                            <svg
                                                class="w-4 h-4 sm:w-5 sm:h-5 {i <
                                                Math.round(
                                                    calculateAverageRating(),
                                                )
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-600'}"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                />
                                            </svg>
                                        {/each}
                                    </div>
                                    <span
                                        class="text-xs sm:text-sm text-gray-400"
                                    >
                                        {calculateAverageRating().toFixed(1)} ({reviews.length}
                                        avaliações)
                                    </span>
                                </div>
                            {/if}
                        </div>

                        <p
                            class="text-gray-300 whitespace-pre-line leading-relaxed"
                        >
                            {service.description}
                        </p>
                    </div>

                    <!-- Provedor -->
                    <div
                        class="glass-dark rounded-2xl p-6 border border-purple-500/20"
                    >
                        <h2 class="text-xl font-semibold text-white mb-4">
                            Sobre o Provedor
                        </h2>

                        <div class="flex items-center space-x-4">
                            <div
                                class="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold"
                            >
                                {service.provider?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 class="font-medium text-white text-lg">
                                    {service.provider?.name}
                                </h3>
                                <p class="text-sm text-gray-400">
                                    {service.provider?.email}
                                </p>
                                {#if service.provider?.phone}
                                    <p class="text-sm text-gray-400">
                                        {service.provider.phone}
                                    </p>
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- Avaliações -->
                    <div
                        class="glass-dark rounded-2xl p-6 border border-purple-500/20"
                    >
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-xl font-semibold text-white">
                                Avaliações
                            </h2>

                            {#if $isAuthenticated}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onclick={() => (reviewModalOpen = true)}
                                    class="bg-slate-800/50 border-purple-500/30 hover:border-purple-500 text-white"
                                >
                                    ⭐ Avaliar
                                </Button>
                            {/if}
                        </div>

                        {#if reviews.length === 0}
                            <p class="text-center text-gray-400 py-8">
                                Ainda não há avaliações para este serviço
                            </p>
                        {:else}
                            <div class="space-y-4">
                                {#each reviews as review}
                                    <div
                                        class="border-b border-slate-700/30 pb-4 last:border-0"
                                    >
                                        <div
                                            class="flex items-center justify-between mb-2"
                                        >
                                            <span
                                                class="font-medium text-white"
                                            >
                                                {review.client?.name}
                                            </span>
                                            <div
                                                class="flex items-center space-x-1"
                                            >
                                                {#each Array(5) as _, i}
                                                    <svg
                                                        class="w-4 h-4 {i <
                                                        review.rating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-600'}"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                        />
                                                    </svg>
                                                {/each}
                                            </div>
                                        </div>
                                        <p class="text-gray-300">
                                            {review.comment}
                                        </p>
                                        <span
                                            class="text-xs text-gray-500 mt-1 block"
                                        >
                                            {new Date(
                                                review.created_at,
                                            ).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Sidebar com variações -->
                <div class="lg:col-span-1">
                    <div
                        class="sticky top-24 glass-dark rounded-2xl p-6 border border-purple-500/20"
                    >
                        <h2 class="text-xl font-semibold text-white mb-4">
                            Opções de Serviço
                        </h2>

                        <div class="space-y-4">
                            {#each service.variations as variation}
                                <div
                                    class="border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/30 transition-all"
                                >
                                    <h3 class="font-medium text-white mb-3">
                                        {variation.name}
                                    </h3>

                                    <div
                                        class="flex items-center justify-between mb-4"
                                    >
                                        <span
                                            class="text-3xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                                        >
                                            R$ {variation.price}
                                        </span>
                                        <span class="text-sm text-gray-400">
                                            ⏱️ {variation.duration_minutes} min
                                        </span>
                                    </div>

                                    {#if variation.discount_percentage && variation.discount_days && variation.discount_days.length > 0}
                                        <div
                                            class="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm"
                                        >
                                            <span
                                                class="text-green-400 font-semibold"
                                            >
                                                🎉 {variation.discount_percentage}%
                                                OFF
                                            </span>
                                            <span
                                                class="text-green-300 text-xs block mt-1"
                                            >
                                                em dias específicos
                                            </span>
                                        </div>
                                    {/if}

                                    {#if $isAuthenticated}
                                        {#if $currentUser?.id !== service.providerId}
                                            <Button
                                                variant="primary"
                                                class="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                                onclick={() =>
                                                    handleBookService(
                                                        variation.id,
                                                    )}
                                            >
                                                📅 Agendar
                                            </Button>
                                        {:else}
                                            <div
                                                class="w-full p-3 text-center text-sm text-gray-400 bg-slate-800/50 border border-slate-700 rounded-lg"
                                            >
                                                Este é o seu serviço
                                            </div>
                                        {/if}
                                    {:else}
                                        <Button
                                            variant="outline"
                                            class="w-full bg-slate-800/50 border-purple-500/30 hover:border-purple-500 text-white"
                                            onclick={() => goto("/auth/login")}
                                        >
                                            Entrar para Agendar
                                        </Button>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Motion>

    <!-- Modal de Avaliação -->
    <Modal
        bind:open={reviewModalOpen}
        title="Avaliar Serviço"
        maxWidth="max-w-lg"
        maxHeight="max-h-[85vh]"
    >
        <form
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmitReview();
            }}
            class="space-y-5"
        >
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-3">
                    Nota
                </label>
                <div class="flex items-center space-x-2">
                    {#each Array(5) as _, i}
                        <button
                            type="button"
                            onclick={() => (rating = i + 1)}
                            class="focus:outline-none"
                        >
                            <svg
                                class="w-10 h-10 {i < rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-600'} hover:text-yellow-400 transition-colors"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                />
                            </svg>
                        </button>
                    {/each}
                </div>
            </div>

            <div>
                <label
                    for="comment"
                    class="block text-sm font-medium text-gray-300 mb-2"
                >
                    Comentário
                </label>
                <textarea
                    id="comment"
                    bind:value={comment}
                    rows="4"
                    required
                    class="w-full px-4 py-3 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-800/50 text-white placeholder-gray-400"
                    placeholder="Conte sobre sua experiência..."
                ></textarea>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
                <Button
                    type="button"
                    variant="outline"
                    class="w-full sm:flex-1 bg-slate-800/50 border-slate-700 text-white order-2 sm:order-1"
                    onclick={() => (reviewModalOpen = false)}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    class="w-full sm:flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 order-1 sm:order-2"
                    loading={submitting}
                >
                    Enviar Avaliação
                </Button>
            </div>
        </form>
    </Modal>
{/if}
