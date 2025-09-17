<script lang="ts">
	import '$lib/css/style.scss';
	import '../../app.postcss';
	import { navigating } from '$app/stores';
	import { Spinner, Button, Alert } from 'flowbite-svelte';

	import { onMount } from 'svelte';
	import Header from '$lib/components/header/Header.svelte';
	import { env } from '$env/dynamic/public';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	export let data;

	const user = data.user;
	const error = data.error;
	const logoBase64 = data.logo ? `data:image/png;base64,${data.logo}`: null;

	let mainClass =
		env.PUBLIC_MENU_LOCATION === 'top' || !env?.PUBLIC_MENU_LOCATION
			? 'w-full mx-auto'
			: 'lg:ml-72 w-full mx-auto';

	onMount(() => {
		var toTopButton: any = document.getElementById('to-top-button');
		// When the user scrolls down 200px from the top of the document, show the button
		window.onscroll = function () {
			if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
				toTopButton?.classList.remove('hidden');
			} else {
				toTopButton?.classList.add('hidden');
			}
		};
	});

	// When the user clicks on the button, smoothy scroll to the top of the document
	function goToTop() {
		scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<Header menus={data.appMenus} error={data.error} {user} {logoBase64} />

<div class="flex px-2 mx-auto h-screen w-full bg-primary-400">
	<main class={mainClass}>
		<!-- Back to top button -->
		<Button
			id="to-top-button"
			on:click={goToTop}
			pill={true}
			color="primary"
			title="Go To Top"
			class="!p-2 hidden fixed focus:shadow-lg focus:outline-none active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5 z-10"
			><svg
				aria-hidden="true"
				focusable="false"
				data-prefix="fas"
				class="w-4 h-4"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 448 512"
				><path
					fill="currentColor"
					d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
				/></svg
			></Button
		>
		{#if data.error}
		<Alert color="red" class="mt-5 w-[60rem] m-auto mb-10">
			<div class="flex items-center gap-3">
				<InfoCircleSolid slot="icon" class="w-5 h-5" />
				<span class="text-lg font-medium font-Nunito"
					>Oops! It seems there has been an error, sorry about that :(</span
				>
			</div>
			<p class="mt-2 mb-4 text-sm">
			      {data.error}
			</p>
			<div class="flex gap-2 font-Nunito">
				<Button size="xs" href="/" outline class="dark:!text-primary-800">Go to Home</Button>
			</div>
		</Alert>
		{/if}

		{#if $navigating}
			<!-- LOOK HERE -->
			<div class="text-center mt-10">
				<Spinner size="12" color="primary" />
			</div>
		{:else}
			<slot {error} />
		{/if}
	</main>
</div>
