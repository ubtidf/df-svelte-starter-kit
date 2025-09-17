<script lang="ts">
	import { sineIn } from 'svelte/easing';
	import {
		Navbar,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		NavUl,
		NavLi,
		Chevron,
		Drawer,
		Sidebar,
		SidebarWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarDropdownWrapper,
		Button,
		SidebarDropdownItem,
		CloseButton
	} from 'flowbite-svelte';
	import logo from '$lib/images/DF-Logo.svg';
	import './style.scss';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { ChevronRightSolid } from 'flowbite-svelte-icons';
	export let user, menus, error , logoBase64;

	// The PUBLIC_MENU_LOCATION env variable controls how the menu appears.
	// "top": Menu appears in the top navbar.
	// "side": Menu appears in a collapsible sidebar.
	let drawerHidden: boolean = false;
	if (!env?.PUBLIC_MENU_LOCATION) {
		env.PUBLIC_MENU_LOCATION = 'top';
	}
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	let backdrop = false;
	let breakPoint = 1024;
	let width: number;
	let activateClickOutside = true;
	let hoverDropMenu: { [key: number]: boolean } = {};
	let hoverDropMenus: { [key: number]: boolean } = {};
	let dynamicLogo : string = '';

	$: if (width >= breakPoint) {
		drawerHidden = false;
		activateClickOutside = false;
	} else {
		drawerHidden = true;
		activateClickOutside = true;
	}

	const handleClickOutside = () => {
		Object.keys(hoverDropMenu).forEach((key) => {
			hoverDropMenu[key] = false;
		});
	};

	const toggleSide = () => {
		// if (width < breakPoint) {
		drawerHidden = !drawerHidden;
		// }
	};

	const changeDropdown = (appMenuID: number) => {
		hoverDropMenu = {
			[appMenuID]: true
		};
	};

	onMount(() => {

		if (width >= breakPoint) {
			drawerHidden = false;
			activateClickOutside = false;
		} else {
			drawerHidden = true;
			activateClickOutside = true;
		}
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	const changeDropdowns = (appMenuID: number) => {
		hoverDropMenus = {
			[appMenuID]: true
		};
	};

	//level 1 hover close
	const closeDropdowns = (appMenuID: number) => {
		hoverDropMenus = {
			[appMenuID]: false
		};
	};

	// onMount(async () => {
	// 	const params = {
    //   		TenantID: Number(env1.DF_TENANT_ID),
    //   		AppID: Number(env1.DF_APP_ID)
    // 	}

    // 	try {
    //   		const client = this.dfClientService.getClient();
    //   		const response: any = await client?.getApplicationService().getLogo(params);
    //   		const base64Logo = response?.Result?.LogoBase64 || null;
    //   		this.Logo = base64Logo ? `data:image/png;base64,${base64Logo}` : 'assets/images/DF-Logo.svg';
    // 	}
    // 	catch (ex) {
    //   		console.error('Error fetching logo:', ex);
    //   		this.Logo = 'assets/images/DF-Logo.svg';
    // 	}
	// });
</script>

<svelte:window bind:innerWidth={width} />

<Navbar
	let:hidden
	let:toggle
	color="primary"
	navDivClass="flex flex-wrap items-center"
	class="!py-0 font-sans !bg-white !shadow-2xl"
	fluid={true}
>
	{#if env.PUBLIC_MENU_LOCATION == 'side'}
		<Button
			on:click={toggleSide}
			type="button"
			style="padding: 2px; margin-right: 6px;"
			aria-label="Open main menu"
		>
			<span class="sr-only">Open main menu</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				role="button"
				tabindex="0"
				width="24"
				height="24"
				class="w-6 h-6"
				aria-label="bars 3"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</Button>
	{/if}

	<img src={logoBase64 || logo} class="h-12" alt="Logo" />

	{#if env.PUBLIC_MENU_LOCATION == 'top'}
		<NavHamburger on:click={toggle} btnClass="md:hidden bg-white" />
		<NavUl
			{hidden}
			divClass="w-full md:flex md:w-auto p-0"
			ulClass="flex flex-col bg-white  p-2 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium"
			style="margin-left: 10px;"
		>
			<NavLi
				class="text-white font-bold  !p-1 hover:text-primary-50 text-sm"
				activeClass="bg-white !text-primary-100 hover:bg-white"
				style="color: white;"
				href="/"
			>
				Home
			</NavLi>
			{#each Object.entries(menus) as [key, value]}
				{#if menus[key].childMenus && menus[key].childMenus.length == 0 && menus[key].ParenAppMenuID == 0}
					<NavLi
						id="nav-menu{value.AppMenuID}"
						activeClass="!bg-primary-50 !text-primary-50 hover:!bg-primary-50"
						class="cursor-pointer  !p-1 text-black hover:!text-white hover:!bg-primary-50"
						href={value.AppMenuActionURL}
					>
						{value.AppMenuLabel}
					</NavLi>
				{:else if menus[key].ParenAppMenuID == 0}
					<div class="relative">
						<NavLi
							id="nav-menu{value.AppMenuID}"
							activeClass="bg-primary-50 !text-primary-100 hover:bg-primary-50"
							class="cursor-pointer text-black !p-1 hover:!text-white hover:!bg-primary-50"
							href={value.AppMenuActionURL}
							on:mouseover={() => changeDropdown(value.AppMenuID)}
						>
							<Chevron aligned>
								{value.AppMenuLabel}
							</Chevron>
						</NavLi>
						<Dropdown
							bind:open={hoverDropMenu[value.AppMenuID]}
							id="dropdownHover"
							frameClass="z-20"
						>
							{#each Object.entries(menus[key].childMenus) as [childKey, childValue]}
								<div
									class="flex items-center mb-2 hover:!text-white hover:!bg-primary-50"
								>
									<a
										href={childValue.AppMenuActionURL}
										class="!text-center p-1 !w-full hover:!text-white"
										on:mouseover={() => changeDropdowns(childValue.AppMenuID)}
										on:mouseleave={() => closeDropdowns(childValue.AppMenuID)}
									>
										{childValue.AppMenuLabel}
									</a>

									{#if childValue.child_Menus && childValue.child_Menus.length > 0}
										<ChevronRightSolid
											class=" w-1.5 h-4 mr-2"
											on:mouseover={() => changeDropdowns(childValue.AppMenuID)}
										/>
									{/if}
								</div>

								<!-- Add more conditions or levels as needed -->
								{#if childValue.child_Menus && childValue.child_Menus.length > 0}
									<Dropdown
										bind:open={hoverDropMenus[childValue.AppMenuID]}
										id={`dropdownHover${childValue.AppMenuID}`}
										class="w-44 !z-20 bg-white-100 !rounded shadow-md absolute top-[-35px] left-14 ml-10 hover:text-black"
									>
										{#each childValue.child_Menus as secondLevelMenu}
											<DropdownItem
												href={secondLevelMenu.AppMenuActionURL}
												class="p-1 !bg-white !rounded !text-center hover:!text-white hover:!bg-primary-50"
											>
												{secondLevelMenu.AppMenuLabel} 
											</DropdownItem>
										{/each}
									</Dropdown>
								{/if}
							{/each}

							<!-- </DropdownItem> -->
						</Dropdown>
					</div>
				{/if}
			{/each}
		</NavUl>
	{/if}

	<div
		class="flex ml-auto items-center acs"
		style="padding: 6px 14px 6px 10px; background-color: #bfeded; cursor: pointer; min-width: 125px;"
	>
		<Avatar rounded-border size="xs" />
		&nbsp; &nbsp;
		<p class="text-sm text-black">{user.UserName}</p>
	</div>
	<Dropdown triggeredBy=".acs" frameClass="z-50">
		<div slot="header" class="px-4 py-2">
			<span class="block text-sm text-gray-900 dark:text-white"
				><strong>{user.UserName}</strong></span
			>
			<span class="block truncate text-xs font-medium"><em>{user.EmailAddress}</em></span>
		</div>
		<DropdownItem href="/" class="flex flex-auto disabled">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 448 512" class="w-4 h-4">
				<path
					fill="black"
					d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
				/>
			</svg>
			&nbsp; My profile
		</DropdownItem>
		<DropdownItem href="/logout" class="flex flex-auto" data-sveltekit-preload-data="off">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4">
				<path
					d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
				/>
			</svg>
			&nbsp; Sign out
		</DropdownItem>
		<DropdownItem href="/change-password" class="flex flex-auto">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4">
				<path
					d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"
				/>
			</svg>
			&nbsp; Change password
		</DropdownItem>
	</Dropdown>
</Navbar>

{#if env.PUBLIC_MENU_LOCATION == 'side'}
	<Drawer
		transitionType="fly"
		{backdrop}
		{transitionParams}
		bind:hidden={drawerHidden}
		bind:activateClickOutside
		bgColor=""
		width="w-56"
		divClass="overflow-y-auto bg-white"
		class="overflow-auto p-0 font-Sen"
		id="sidebar"
	>
		<div class="flex items-center">
			<CloseButton
				on:click={() => (drawerHidden = true)}
				class="mb-4 text-black dark:text-white lg:hidden hover:!bg-primary-50"
			/>
		</div>
		<Sidebar asideClass="w-56">
			<SidebarWrapper divClass="overflow-y-auto py-0 px-0 dark:bg-gray-800">
				<SidebarGroup class="py-2 px-2">
					<div style="position: relative; top: -8px;">
						<img
							src={logo}
							class="h-10"
							alt="Logo"
							style="display: inline-block; vertical-align: top;"
						/>
					</div>
					<SidebarItem
						label="Home"
						href="/"
						class="text-black text-sm py-2 px-2 hover:text-white hover:bg-primary-50  active:bg-primary-50"
					>
						<svelte:fragment slot="icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-4 h-4"
							>
								<path
									fill="currentcolor"
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
									transform="scale(0.04166667)"
								/>
							</svg>
						</svelte:fragment>
					</SidebarItem>

					<hr style="height: 2px; background-color: #ffffff;" />
					{#each Object.entries(menus) as [key, value]}
						{#if menus[key].childMenus.length == 0 && menus[key].ParenAppMenuID == 0}
							<SidebarItem
								label={value.AppMenuLabel}
								class="text-black hover:text-white  hover:bg-primary-50   text-sm"
								id="nav-menu{value.AppMenuID}"
								activeClass="bg-primary-50 !text-white
								hover:bg-primary-50"
								href={value.AppMenuActionURL}
							>
								{value.AppMenuLabel}
							</SidebarItem>
						{:else if menus[key].ParenAppMenuID == 0}
							<SidebarDropdownWrapper
								id="nav-menu{value.AppMenuID}"
								label={value.AppMenuLabel}
								class="text-black group hover:text-white hover:bg-primary-50 text-sm"
								activeClass="bg-primary-50 !text-white  hover:bg-primary-50"
								href={value.AppMenuActionURL}
							>
								<svelte:fragment slot="arrowup">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="w-4 h-4 !text-black group-hover:!text-white"
										viewBox="0 0 512 512"
									>
										<path
											fill="currentcolor"
											d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
										/>
									</svg>
								</svelte:fragment>
								<svelte:fragment slot="arrowdown">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="w-4 h-4 !text-black group-hover:!text-white"
										viewBox="0 0 512 512"
									>
										<path
											fill="currentcolor"
											d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
										/>
									</svg>
								</svelte:fragment>
								{#each Object.entries(menus[key].childMenus) as [key, value]}
									<SidebarDropdownItem
										label={value.AppMenuLabel}
										class="text-black hover:text-white hover:bg-primary-50 text-sm"
										id="nav-menu{value.AppMenuID}"
										activeClass="bg-primary-50 !text-white hover:bg-primary-50"
										href={value.AppMenuActionURL}
									/>
								{/each}
							</SidebarDropdownWrapper>
						{/if}
					{/each}
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
		<div class="ubti-footer">
			<strong>Powered by <a href="https://ubtiinc.com/" class="text-black">UBTI</a></strong>
			<br />
			© {new Date().getFullYear()} UB Technology Innovations, Inc.
		</div>
	</Drawer>
{:else}
	<div class="ubti-footer !bg-white">
		<strong>Powered by <a href="https://ubtiinc.com/" class="text-black">UBTI</a></strong>
		<br />
		© {new Date().getFullYear()} UB Technology Innovations, Inc.
	</div>
{/if}
