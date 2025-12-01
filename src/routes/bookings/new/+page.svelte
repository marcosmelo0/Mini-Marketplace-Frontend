<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Motion } from "svelte-motion";
    import Loading from "$lib/components/ui/Loading.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import CalendarIcon from "lucide-svelte/icons/calendar";
    import {
        DateFormatter,
        type DateValue,
        getLocalTimeZone,
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { getServiceById } from "$lib/api/services";
    import { createBooking } from "$lib/api/bookings";
    import { getProviderAvailableSlots } from "$lib/api/availabilities";
    import { toastStore } from "$lib/stores/toast";
    import { formatBrazilTime } from "$lib/utils/date";
    import type {
        Service,
        ServiceVariation,
        AvailabilitySlot,
    } from "$lib/types/api";

    const df = new DateFormatter("pt-BR", {
        dateStyle: "long",
    });

    let loading = $state(true);
    let submitting = $state(false);
    let loadingSlots = $state(false);
    let service = $state<Service | null>(null);
    let variation = $state<ServiceVariation | null>(null);
    let availableSlots = $state<AvailabilitySlot[]>([]);
    let unavailableWeekdays = $state<number[]>([]);

    let value = $state<DateValue | undefined>(undefined);
    let selectedSlot = $state<AvailabilitySlot | null>(null);

    const variationId = $page.url.searchParams.get("variationId");

    onMount(async () => {
        if (!variationId) {
            toastStore.error("Serviço não especificado");
            goto("/services");
            return;
        }

        try {
            const serviceId = $page.url.searchParams.get("serviceId");

            if (serviceId) {
                service = await getServiceById(serviceId);
                if (service) {
                    variation =
                        service.variations.find((v) => v.id === variationId) ||
                        null;

                    // Detect unavailable weekdays by testing each day
                    if (service && variation) {
                        await detectUnavailableWeekdays(
                            service.providerId,
                            variation.id,
                        );
                    }
                }
            } else {
                toastStore.error("ID do serviço não encontrado");
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            toastStore.error("Erro ao carregar dados do agendamento");
        } finally {
            loading = false;
        }
    });

    async function detectUnavailableWeekdays(
        providerId: string,
        variationId: string,
    ) {
        const today = new Date();
        const unavailable: number[] = [];

        // Test next 14 days to cover all weekdays at least twice
        for (let i = 0; i < 14; i++) {
            const testDate = new Date(today);
            testDate.setDate(today.getDate() + i);

            const weekday = testDate.getDay();

            // Skip if we already tested this weekday
            if (unavailable.includes(weekday)) continue;

            const year = testDate.getFullYear();
            const month = String(testDate.getMonth() + 1).padStart(2, "0");
            const day = String(testDate.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;

            try {
                const response = await getProviderAvailableSlots(
                    providerId,
                    formattedDate,
                    variationId,
                );

                // If no slots returned, this weekday is unavailable
                if (
                    !response ||
                    !response.slots ||
                    response.slots.length === 0
                ) {
                    unavailable.push(weekday);
                }
            } catch (error) {
                console.error(`Erro ao testar dia ${formattedDate}:`, error);
            }
        }

        unavailableWeekdays = unavailable;
        console.log("Dias indisponíveis:", unavailableWeekdays);
    }

    $effect(() => {
        if (value) {
            const selectedDate = value.toDate(getLocalTimeZone());
            fetchSlotsForDate(selectedDate);
            calculateDiscount(selectedDate);
        }
    });

    let hasDiscount = $state(false);
    let discountedPrice = $state<number>(0);

    function calculateDiscount(date: Date) {
        if (!variation) {
            hasDiscount = false;
            return;
        }

        const weekday = date.getDay();

        // Check if this weekday has a discount
        if (
            variation.discount_days &&
            variation.discount_days.includes(weekday) &&
            variation.discount_percentage
        ) {
            hasDiscount = true;
            const originalPrice = parseFloat(variation.price);
            const discount =
                originalPrice * (variation.discount_percentage / 100);
            discountedPrice = originalPrice - discount;
        } else {
            hasDiscount = false;
            discountedPrice = 0;
        }
    }

    function getDiscountDaysText(): string {
        if (
            !variation ||
            !variation.discount_days ||
            variation.discount_days.length === 0
        ) {
            return "";
        }

        const dayNames = [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
        ];
        const discountDayNames = variation.discount_days
            .map((day) => dayNames[day])
            .join(", ");

        return discountDayNames;
    }

    function isDateUnavailable(date: DateValue): boolean {
        const jsDate = date.toDate(getLocalTimeZone());
        const weekday = jsDate.getDay();
        return unavailableWeekdays.includes(weekday);
    }

    async function fetchSlotsForDate(date: Date) {
        console.log("📅 Data selecionada:", date);

        selectedSlot = null;
        loadingSlots = true;

        try {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;

            console.log("📤 Buscando slots para:", formattedDate);

            if (service && variation) {
                const response = await getProviderAvailableSlots(
                    service.providerId,
                    formattedDate,
                    variation.id,
                );
                console.log("📥 Slots recebidos:", response);

                if (response && response.slots) {
                    // Filter only available slots
                    availableSlots = response.slots.filter(
                        (slot) => slot.available,
                    );
                } else {
                    availableSlots = [];
                }
            }
        } catch (error) {
            console.error("❌ Erro ao buscar slots:", error);
            toastStore.error("Erro ao buscar horários disponíveis");
            availableSlots = [];
        } finally {
            loadingSlots = false;
        }
    }

    function formatSlotTime(slot: AvailabilitySlot, duration: number): string {
        const startTime = formatBrazilTime(slot.start_time);

        const startDate = new Date(slot.start_time);
        const endDate = new Date(startDate.getTime() + duration * 60000);
        const endTime = formatBrazilTime(endDate.toISOString());

        return `${startTime} - ${endTime}`;
    }

    function selectSlot(slot: AvailabilitySlot) {
        selectedSlot = slot;
    }

    async function handleBooking() {
        if (!selectedSlot || !variation) return;

        submitting = true;
        try {
            // O slot.start_time já vem no formato correto do backend
            // Apenas precisamos enviá-lo de volta
            await createBooking({
                serviceVariationId: variation.id,
                start_time: selectedSlot.start_time,
            });

            toastStore.success("Agendamento realizado com sucesso!");
            goto("/bookings");
        } catch (error: any) {
            console.error("Erro ao agendar:", error);
            toastStore.error(error.message || "Erro ao realizar agendamento");
        } finally {
            submitting = false;
        }
    }
</script>

<svelte:head>
    <title>Agendar Serviço - Mini Marketplace</title>
</svelte:head>

{#if loading}
    <Loading />
{:else}
    <Motion
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        let:motion
    >
        <div use:motion class="max-w-2xl mx-auto">
            <div class="glass-dark rounded-3xl p-8 border border-purple-500/20">
                <h1
                    class="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600 mb-6"
                >
                    Agendar Serviço
                </h1>

                {#if service && variation}
                    <div
                        class="mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                    >
                        <h2 class="text-xl font-semibold text-white mb-2">
                            {service.name}
                        </h2>
                        <div class="flex justify-between items-center">
                            <span class="text-purple-300">{variation.name}</span
                            >
                            <div class="flex items-center gap-2">
                                {#if hasDiscount}
                                    <span
                                        class="text-gray-400 line-through text-sm"
                                    >
                                        R$ {variation.price}
                                    </span>
                                    <span
                                        class="font-bold text-green-400 text-lg"
                                    >
                                        R$ {discountedPrice.toFixed(2)}
                                    </span>
                                    <span
                                        class="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30"
                                    >
                                        {variation.discount_percentage}% OFF
                                    </span>
                                {:else}
                                    <span class="font-bold text-white">
                                        R$ {variation.price}
                                    </span>
                                {/if}
                            </div>
                        </div>
                        <div class="mt-2 text-sm text-gray-400">
                            ⏱️ Duração: {variation.duration_minutes} minutos
                        </div>
                        {#if hasDiscount}
                            <div
                                class="mt-2 text-sm text-green-400 flex items-center gap-1"
                            >
                                🎉 Desconto especial aplicado para este dia!
                            </div>
                        {/if}
                    </div>

                    {#if variation.discount_days && variation.discount_days.length > 0 && variation.discount_percentage}
                        <div
                            class="mb-6 p-4 bg-green-500/10 rounded-xl border border-green-500/30"
                        >
                            <div class="flex items-start gap-2">
                                <span class="text-xl">🏷️</span>
                                <div>
                                    <p
                                        class="text-green-400 font-semibold text-sm"
                                    >
                                        Desconto de {variation.discount_percentage}%
                                        disponível!
                                    </p>
                                    <p class="text-green-300/80 text-sm mt-1">
                                        Disponível: <span class="font-medium"
                                            >{getDiscountDaysText()}</span
                                        >
                                    </p>
                                </div>
                            </div>
                        </div>
                    {/if}

                    <div class="space-y-6">
                        <div>
                            <Popover.Root>
                                <Popover.Trigger
                                    aria-label="Selecionar data do agendamento"
                                    class={cn(
                                        "w-full flex items-center justify-start gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white hover:bg-slate-800/70 transition-all",
                                        !value && "text-gray-400",
                                    )}
                                >
                                    <CalendarIcon class="size-4" />
                                    {value
                                        ? df.format(
                                              value.toDate(getLocalTimeZone()),
                                          )
                                        : "Selecione uma data"}
                                </Popover.Trigger>
                                <Popover.Content class="w-auto p-0">
                                    <Calendar
                                        type="single"
                                        bind:value
                                        {isDateUnavailable}
                                        captionLayout="dropdown"
                                        class="rounded-xl border border-slate-700"
                                    />
                                </Popover.Content>
                            </Popover.Root>
                        </div>

                        <div>
                            <div class="text-sm font-medium text-gray-300 mb-2">
                                Horário
                            </div>

                            {#if !value}
                                <div
                                    class="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center text-gray-400"
                                >
                                    Selecione uma data para ver os horários
                                    disponíveis
                                </div>
                            {:else if loadingSlots}
                                <div class="flex justify-center py-4">
                                    <div
                                        class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"
                                    ></div>
                                </div>
                            {:else if availableSlots.length === 0}
                                <div
                                    class="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center text-gray-400"
                                >
                                    Nenhum horário disponível para esta data
                                </div>
                            {:else}
                                <div
                                    class="grid grid-cols-3 sm:grid-cols-4 gap-2"
                                >
                                    {#each availableSlots as slot}
                                        <button
                                            type="button"
                                            disabled={!slot.available}
                                            onclick={() => selectSlot(slot)}
                                            class="px-3 py-2 rounded-lg text-sm font-medium transition-all {selectedSlot ===
                                            slot
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                                                : slot.available
                                                  ? 'bg-slate-800/50 text-gray-300 hover:bg-purple-500/20 hover:text-white border border-slate-700/50'
                                                  : 'bg-slate-800/30 text-gray-600 cursor-not-allowed border border-slate-800'}"
                                        >
                                            {formatSlotTime(
                                                slot,
                                                variation.duration_minutes,
                                            )}
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <Button
                            onclick={handleBooking}
                            disabled={!selectedSlot || submitting}
                            class="w-full bg-linear-to-r from-purple-600 to-pink-600 mt-6"
                        >
                            {#if submitting}
                                Agendando...
                            {:else}
                                Confirmar Agendamento
                            {/if}
                        </Button>
                    </div>
                {:else}
                    <div class="text-center py-8">
                        <p class="text-red-400 mb-4">
                            Erro ao carregar informações do serviço.
                        </p>
                        <Button
                            onclick={() => goto("/services")}
                            variant="outline"
                        >
                            Voltar para Serviços
                        </Button>
                    </div>
                {/if}
            </div>
        </div>
    </Motion>
{/if}
