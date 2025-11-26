<script lang="ts">
  let {
    class: className = '',
    padding = 'p-6',
    hover = false,
    children
  }: {
    class?: string;
    padding?: string;
    hover?: boolean;
    children: any;
  } = $props();

  const baseClasses = 'card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  const classes = `${baseClasses} ${hoverClasses} ${padding} ${className}`;
</script>

<div class={classes}>
  {@render children()}
</div>
