<script lang="ts">
    import { onMount } from "svelte";
    import { Motion } from "svelte-motion";
    import Button from "$lib/components/ui/Button.svelte";
    import Loading from "$lib/components/ui/Loading.svelte";
    import { toastStore } from "$lib/stores/toast";
    import {
        createAvailability,
        getMyAvailabilities,
        updateAvailability,
        deleteAvailability,
    } from "$lib/api/availabilities";
    import type {
        Availability,
        CreateAvailabilityRequest,
    } from "$lib/types/api";
    import { formatBrazilTime } from "$lib/utils/date";

    let availabilities = $state<Availability[]>([]);
    let loading = $state(true);
    let submitting = $state(false);
    let editingId = $state<string | null>(null);

    // Form state
    let dayOfWeek = $state(1);
    let startTime = $state("09:00");
    let endTime = $state("18:00");

    const daysOfWeek = [
        { value: 0, label: "Domingo" },
        { value: 1, label: "Segunda-feira" },
        { value: 2, label: "Terça-feira" },
        { value: 3, label: "Quarta-feira" },
        { value: 4, label: "Quinta-feira" },
        { value: 5, label: "Sexta-feira" },
        { value: 6, label: "Sábado" },
    ];

    onMount(async () => {
        await loadAvailabilities();
    });

    async function loadAvailabilities() {
        try {
            loading = true;
            const response = await getMyAvailabilities();
            // Handle both array response and object with data property
            availabilities = Array.isArray(response)
                ? response
                : (response as any).data || [];
            availabilities.sort((a, b) => a.day_of_week - b.day_of_week);
        } catch (error) {
            console.error("Erro ao carregar disponibilidades:", error);
            toastStore.error("Erro ao carregar disponibilidades");
            availabilities = [];
        } finally {
            loading = false;
        }
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();

        if (startTime >= endTime) {
            toastStore.error(
                "Horário de início deve ser antes do horário de fim",
            );
            return;
        }

        try {
            submitting = true;

            if (editingId) {
                await updateAvailability(editingId, {
                    start_time: startTime,
                    end_time: endTime,
                });
                toastStore.success("Disponibilidade atualizada com sucesso!");
            } else {
                const data: CreateAvailabilityRequest = {
                    day_of_week: dayOfWeek,
                    start_time: startTime,
                    end_time: endTime,
                };
                await createAvailability(data);
                toastStore.success("Disponibilidade criada com sucesso!");
            }

            resetForm();
            await loadAvailabilities();
        } catch (error: any) {
            console.error("Erro ao salvar disponibilidade:", error);
            toastStore.error(error.message || "Erro ao salvar disponibilidade");
        } finally {
            submitting = false;
        }
    }

    function editAvailability(availability: Availability) {
        editingId = availability.id;
        dayOfWeek = availability.day_of_week;
        startTime = availability.start_time;
        endTime = availability.end_time;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja excluir esta disponibilidade?")) {
            return;
        }

        try {
            await deleteAvailability(id);
            toastStore.success("Disponibilidade excluída com sucesso!");
            await loadAvailabilities();
        } catch (error) {
            console.error("Erro ao excluir disponibilidade:", error);
            toastStore.error("Erro ao excluir disponibilidade");
        }
    }

    function resetForm() {
        editingId = null;
        dayOfWeek = 1;
        startTime = "09:00";
        endTime = "18:00";
    }

    function getDayLabel(day: number): string {
        return daysOfWeek.find((d) => d.value === day)?.label || "";
    }
</script>

<svelte:head>
    <title>Gerenciar Disponibilidade - Mini Marketplace</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4">
    <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        let:motion
    >
        <div use:motion class="mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
                <span class="gradient-primary">Gerenciar</span> Disponibilidade
            </h1>
            <p class="text-gray-400 text-sm sm:text-base">
                Configure seus horários disponíveis para agendamentos
            </p>
        </div>
    </Motion>

    <!-- Form -->
    <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        let:motion
    >
        <div
            use:motion
            class="glass-dark rounded-2xl p-4 sm:p-6 mb-8 border border-purple-500/20"
        >
            <h2 class="text-xl sm:text-2xl font-bold text-white mb-6">
                {editingId ? "Editar" : "Adicionar"} Disponibilidade
            </h2>

            <form onsubmit={handleSubmit} class="space-y-6">
                <div>
                    <label
                        for="dayOfWeek"
                        class="block text-sm font-medium text-gray-300 mb-2"
                    >
                        Dia da Semana
                    </label>
                    <select
                        id="dayOfWeek"
                        bind:value={dayOfWeek}
                        disabled={editingId !== null}
                        class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {#each daysOfWeek as day}
                            <option value={day.value}>{day.label}</option>
                        {/each}
                    </select>
                    {#if editingId}
                        <p class="text-xs text-gray-500 mt-1">
                            O dia da semana não pode ser alterado. Crie uma nova
                            disponibilidade se necessário.
                        </p>
                    {/if}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            for="startTime"
                            class="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Horário de Início
                        </label>
                        <input
                            id="startTime"
                            type="time"
                            bind:value={startTime}
                            required
                            class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500 transition-colors time-input"
                        />
                    </div>

                    <div>
                        <label
                            for="endTime"
                            class="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Horário de Fim
                        </label>
                        <input
                            id="endTime"
                            type="time"
                            bind:value={endTime}
                            required
                            class="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500 transition-colors time-input"
                        />
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={submitting}
                        class="w-full sm:w-auto bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 order-1"
                    >
                        {submitting
                            ? "Salvando..."
                            : editingId
                              ? "Atualizar"
                              : "Adicionar"}
                    </Button>

                    {#if editingId}
                        <Button
                            type="button"
                            variant="outline"
                            onclick={resetForm}
                            class="w-full sm:w-auto border-slate-700 hover:border-purple-500 order-2"
                        >
                            Cancelar
                        </Button>
                    {/if}
                </div>
            </form>
        </div>
    </Motion>

    <!-- List -->
    {#if loading}
        <Loading />
    {:else}
        <Motion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            let:motion
        >
            <div
                use:motion
                class="glass-dark rounded-2xl p-4 sm:p-6 border border-purple-500/20"
            >
                <h2 class="text-xl sm:text-2xl font-bold text-white mb-6">
                    Disponibilidades Cadastradas
                </h2>

                {#if availabilities.length === 0}
                    <div class="text-center py-12">
                        <div class="text-6xl mb-4">📅</div>
                        <p class="text-gray-400 text-lg">
                            Nenhuma disponibilidade cadastrada ainda
                        </p>
                        <p class="text-gray-500 text-sm mt-2">
                            Adicione seus horários disponíveis acima
                        </p>
                    </div>
                {:else}
                    <div class="space-y-3">
                        {#each availabilities as availability, i}
                            <Motion
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                let:motion
                            >
                                <div
                                    use:motion
                                    class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/30 transition-all group gap-3"
                                >
                                    <div
                                        class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto"
                                    >
                                        <div
                                            class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0"
                                        >
                                            {availability.day_of_week}
                                        </div>
                                        <div class="min-w-0">
                                            <h3
                                                class="text-white font-semibold text-base sm:text-lg"
                                            >
                                                {getDayLabel(
                                                    availability.day_of_week,
                                                )}
                                            </h3>
                                            <p
                                                class="text-gray-400 text-xs sm:text-sm"
                                            >
                                                {formatBrazilTime(
                                                    availability.start_time,
                                                )} - {formatBrazilTime(
                                                    availability.end_time,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onclick={() =>
                                                editAvailability(availability)}
                                            class="flex-1 sm:flex-none border-slate-700 hover:border-purple-500 hover:text-purple-400 text-xs sm:text-sm"
                                        >
                                            ✏️ Editar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onclick={() =>
                                                handleDelete(availability.id)}
                                            class="flex-1 sm:flex-none border-slate-700 hover:border-red-500 hover:text-red-400 text-xs sm:text-sm"
                                        >
                                            🗑️ Excluir
                                        </Button>
                                    </div>
                                </div>
                            </Motion>
                        {/each}
                    </div>
                {/if}
            </div>
        </Motion>
    {/if}
</div>

<style>
    /* Custom styling for time inputs - purple/pink clock icon */
    :global(.time-input::-webkit-calendar-picker-indicator) {
        filter: invert(56%) sepia(89%) saturate(2476%) hue-rotate(238deg)
            brightness(95%) contrast(101%);
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
    }

    :global(.time-input::-webkit-calendar-picker-indicator:hover) {
        opacity: 1;
        filter: invert(56%) sepia(89%) saturate(2476%) hue-rotate(238deg)
            brightness(110%) contrast(101%);
    }

    /* Firefox time input styling */
    :global(.time-input) {
        color-scheme: dark;
    }

    /* Select dropdown styling */
    :global(select option) {
        background-color: rgb(15 23 42 / 0.95);
        color: white;
        padding: 8px;
    }

    :global(select option:hover) {
        background: linear-gradient(
            135deg,
            rgb(147 51 234 / 0.2) 0%,
            rgb(219 39 119 / 0.2) 100%
        );
    }
</style>
