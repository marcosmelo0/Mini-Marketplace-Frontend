<script lang="ts">
    import { toastStore, type Toast } from "$lib/stores/toast";
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";

    function getIcon(type: Toast["type"]) {
        switch (type) {
            case "success":
                return "✅";
            case "error":
                return "❌";
            case "warning":
                return "⚠️";
            case "info":
                return "ℹ️";
        }
    }

    function getColors(type: Toast["type"]) {
        switch (type) {
            case "success":
                return "bg-green-500/10 border-green-500/30 text-green-200";
            case "error":
                return "bg-red-500/10 border-red-500/30 text-red-200";
            case "warning":
                return "bg-yellow-500/10 border-yellow-500/30 text-yellow-200";
            case "info":
                return "bg-blue-500/10 border-blue-500/30 text-blue-200";
        }
    }
</script>

<div
    class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
>
    {#each $toastStore as toast (toast.id)}
        <div
            animate:flip={{ duration: 300 }}
            in:fly={{ x: 20, duration: 300 }}
            out:fly={{ x: 20, duration: 300 }}
            class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg min-w-[300px] max-w-md {getColors(
                toast.type,
            )}"
        >
            <span class="text-xl">{getIcon(toast.type)}</span>
            <p class="text-sm font-medium">{toast.message}</p>
            <button
                onclick={() => toastStore.remove(toast.id)}
                class="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity"
            >
                ✕
            </button>
        </div>
    {/each}
</div>
