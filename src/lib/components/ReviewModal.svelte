<script lang="ts">
    import { Motion } from "svelte-motion";
    import Button from "$lib/components/ui/Button.svelte";
    import { createReview } from "$lib/api/reviews";
    import { toastStore } from "$lib/stores/toast";
    import type { Booking } from "$lib/types/api";

    interface Props {
        booking: Booking;
        isOpen: boolean;
        onClose: () => void;
        onSuccess: () => void;
    }

    let { booking, isOpen, onClose, onSuccess }: Props = $props();

    let rating = $state(0);
    let hoveredRating = $state(0);
    let comment = $state("");
    let submitting = $state(false);

    const serviceName = $derived(
        booking.serviceVariation?.service?.name || "Serviço",
    );
    const serviceId = $derived(booking.serviceVariation?.service?.id || "");

    function handleStarClick(star: number) {
        rating = star;
    }

    function handleStarHover(star: number) {
        hoveredRating = star;
    }

    function handleStarLeave() {
        hoveredRating = 0;
    }

    async function handleSubmit() {
        if (rating === 0) {
            toastStore.error("Por favor, selecione uma avaliação");
            return;
        }

        if (!comment.trim()) {
            toastStore.error("Por favor, escreva um comentário");
            return;
        }

        if (!serviceId) {
            toastStore.error("Erro: ID do serviço não encontrado");
            return;
        }

        submitting = true;
        try {
            await createReview({
                serviceId,
                rating,
                comment: comment.trim(),
            });

            toastStore.success("Avaliação enviada com sucesso!");
            onSuccess();
            resetForm();
            onClose();
        } catch (error: any) {
            console.error("Erro ao enviar avaliação:", error);
            toastStore.error(
                error.message || "Erro ao enviar avaliação. Tente novamente.",
            );
        } finally {
            submitting = false;
        }
    }

    function resetForm() {
        rating = 0;
        hoveredRating = 0;
        comment = "";
    }

    function handleClose() {
        if (!submitting) {
            resetForm();
            onClose();
        }
    }
</script>

{#if isOpen}
    <!-- Backdrop -->
    <Motion
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        let:motion
    >
        <div
            use:motion
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onclick={handleClose}
            onkeydown={(e) => e.key === "Enter" && handleClose()}
            role="button"
            tabindex="-1"
            aria-label="Fechar modal"
        ></div>
    </Motion>

    <!-- Modal -->
    <Motion
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        let:motion
    >
        <div
            use:motion
            class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
            <div
                style="background-color: #0f172a;"
                class="rounded-3xl p-8 border border-purple-500/20 max-w-md w-full pointer-events-auto shadow-2xl mx-4 md:mx-0"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.key === "Escape" && handleClose()}
                role="dialog"
                tabindex="-1"
                aria-labelledby="modal-title"
                aria-modal="true"
            >
                <h2 id="modal-title" class="text-2xl font-bold text-white mb-2">
                    Avaliar Serviço
                </h2>
                <p class="text-gray-400 mb-6">{serviceName}</p>

                <!-- Star Rating -->
                <div class="mb-6">
                    <div class="block text-sm font-medium text-gray-300 mb-3">
                        Sua avaliação
                    </div>
                    <div class="flex gap-2 justify-center">
                        {#each [1, 2, 3, 4, 5] as star}
                            <button
                                type="button"
                                onclick={() => handleStarClick(star)}
                                onmouseenter={() => handleStarHover(star)}
                                onmouseleave={handleStarLeave}
                                class="text-5xl transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                                disabled={submitting}
                                aria-label={`Avaliar com ${star} estrela${star > 1 ? "s" : ""}`}
                            >
                                {#if star <= (hoveredRating || rating)}
                                    <span class="text-yellow-400">★</span>
                                {:else}
                                    <span class="text-gray-600">☆</span>
                                {/if}
                            </button>
                        {/each}
                    </div>
                    {#if rating > 0}
                        <p class="text-center text-sm text-gray-400 mt-2">
                            {rating} estrela{rating > 1 ? "s" : ""}
                        </p>
                    {/if}
                </div>

                <!-- Comment -->
                <div class="mb-6">
                    <label
                        for="review-comment"
                        class="block text-sm font-medium text-gray-300 mb-2"
                    >
                        Seu comentário
                    </label>
                    <textarea
                        id="review-comment"
                        bind:value={comment}
                        placeholder="Conte-nos sobre sua experiência..."
                        rows="4"
                        maxlength="500"
                        disabled={submitting}
                        style="background-color: #1e293b;"
                        class="w-full px-4 py-3 rounded-xl border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50"
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1 text-right">
                        {comment.length}/500 caracteres
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onclick={handleClose}
                        disabled={submitting}
                        style="background-color: #1e293b;"
                        class="w-full sm:flex-1 px-4 py-3 rounded-xl border border-slate-700 text-gray-300 hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium order-2 sm:order-1"
                    >
                        Cancelar
                    </button>
                    <button
                        onclick={handleSubmit}
                        disabled={submitting || rating === 0 || !comment.trim()}
                        class="w-full sm:flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium order-1 sm:order-2"
                    >
                        {#if submitting}
                            Enviando...
                        {:else}
                            Enviar Avaliação
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </Motion>
{/if}
