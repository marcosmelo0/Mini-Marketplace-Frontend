<script lang="ts">
    import { Motion } from "svelte-motion";
    import Button from "./Button.svelte";

    let {
        open = $bindable(false),
        title = "Confirmar ação",
        message = "Tem certeza que deseja continuar?",
        confirmText = "Confirmar",
        cancelText = "Cancelar",
        variant = "danger",
        onConfirm,
        onCancel,
    }: {
        open?: boolean;
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
        variant?: "danger" | "warning";
        onConfirm?: () => void;
        onCancel?: () => void;
    } = $props();

    function handleConfirm() {
        open = false;
        onConfirm?.();
    }

    function handleCancel() {
        open = false;
        onCancel?.();
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            handleCancel();
        }
    }

    const variantStyles = {
        danger: {
            icon: "⚠️",
            confirmClass:
                "bg-red-500 hover:bg-red-600 text-white border-red-500",
            iconBg: "bg-red-500/10",
            iconColor: "text-red-400",
        },
        warning: {
            icon: "⚠️",
            confirmClass:
                "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500",
            iconBg: "bg-yellow-500/10",
            iconColor: "text-yellow-400",
        },
    };

    const currentVariant = $derived(variantStyles[variant]);
</script>

{#if open}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        tabindex="-1"
    >
        <Motion
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            let:motion
        >
            <div
                use:motion
                class="glass-dark rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/20"
            >
                <div class="p-6">
                    <!-- Icon -->
                    <div
                        class="mx-auto flex items-center justify-center h-16 w-16 rounded-full {currentVariant.iconBg} mb-4"
                    >
                        <span class="text-4xl {currentVariant.iconColor}">
                            {currentVariant.icon}
                        </span>
                    </div>

                    <!-- Title -->
                    <h3
                        id="confirm-title"
                        class="text-xl font-bold text-white text-center mb-3"
                    >
                        {title}
                    </h3>

                    <!-- Message -->
                    <p
                        id="confirm-message"
                        class="text-gray-400 text-center mb-6 text-sm leading-relaxed"
                    >
                        {message}
                    </p>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            onclick={handleCancel}
                            class="flex-1 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 order-2 sm:order-1"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onclick={handleConfirm}
                            class="flex-1 {currentVariant.confirmClass} order-1 sm:order-2"
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </Motion>
    </div>
{/if}

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .animate-fade-in {
        animation: fade-in 0.2s ease-out;
    }
</style>
