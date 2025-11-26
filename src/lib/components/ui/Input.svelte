<script lang="ts">
  type InputType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "time";

  let {
    type = "text",
    value = $bindable(""),
    placeholder = "",
    label = "",
    error = "",
    disabled = false,
    required = false,
    class: className = "",
    ...rest
  }: {
    type?: InputType;
    value?: string;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    [key: string]: any;
  } = $props();

  const inputClasses = `w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed ${
    error
      ? "border-red-500 focus:border-red-500 bg-red-500/5"
      : "border-slate-700 focus:border-purple-500 bg-slate-800/50 hover:border-slate-600"
  } text-white placeholder-gray-400 ${className}`;

  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="w-full">
  {#if label}
    <label for={inputId} class="block text-sm font-medium text-gray-300 mb-2">
      {label}
      {#if required}
        <span class="text-red-400">*</span>
      {/if}
    </label>
  {/if}
  <input
    id={inputId}
    {type}
    bind:value
    {placeholder}
    {disabled}
    {required}
    class={inputClasses}
    {...rest}
  />
  {#if error}
    <p class="mt-1 text-sm text-red-400">{error}</p>
  {/if}
</div>
