<script lang="ts">
  let {
    size = 'md',
    text = 'Carregando...'
  }: {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
  } = $props();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
</script>

<div class="flex flex-col items-center justify-center p-8">
  <div class={`${sizeClasses[size]} relative`}>
    <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
    <div class="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
  </div>
  {#if text}
    <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">{text}</p>
  {/if}
</div>
