<script lang="ts">
  let {
    open = $bindable(false),
    title = "",
    maxWidth = "max-w-md",
    maxHeight = "max-h-[90vh]",
    onClose,
    children,
  }: {
    open?: boolean;
    title?: string;
    maxWidth?: string;
    maxHeight?: string;
    onClose?: () => void;
    children: any;
  } = $props();

  function handleClose() {
    open = false;
    onClose?.();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      handleClose();
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="bg-gray-800 dark:bg-gray-800 rounded-lg shadow-xl w-full {maxWidth} {maxHeight} mx-4 md:mx-0 overflow-y-auto animate-slide-up custom-scrollbar"
    >
      {#if title}
        <div
          class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
        >
          <h2 class="text-xl font-semibold text-gray-100 dark:text-gray-100">
            {title}
          </h2>
          <button
            onclick={handleClose}
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Fechar"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      {/if}
      <div class="p-6">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
