<script lang="ts" generics="T extends Record<string, unknown>">
	import { mount, type Component } from "svelte";

	let {
		component: PrintComponent,
		props: printProps,
		
	}: {
		component: Component<T>;
		props: T;
	} = $props();

	let frameElement = $state<HTMLIFrameElement>();

	const iframeAttach = function (element: HTMLIFrameElement) {
		document.querySelectorAll('style[data-vite-dev-id*="@fontsource-variable"], style[data-vite-dev-id*="PrintContent.svelte"], link[href$=".css"]').forEach(el => (
			element?.contentDocument?.head.appendChild(el.cloneNode(true))
		));

		const style = element?.contentDocument?.createElement('style');
		if (!style) return;
		style.textContent = '@page: { size: A4 portrait; margin: 0; }';

		element?.contentDocument?.head.appendChild(style);

		if (element.contentDocument) {
			element.contentDocument.title = document.title;
		}

		element.contentDocument?.fonts.load('400 1em "Roboto Variable"');
		element.contentDocument?.fonts.load('600 1em "Roboto Variable"');
		// element.contentDocument?.fonts.ready;
	};

	export const doPrint = async function () {
		const target = frameElement?.contentDocument?.createElement('div');
		if (!target) return;

		frameElement?.contentDocument?.body.appendChild(target);

		mount(PrintComponent, {
			target,
			props: printProps,
		});

		frameElement?.contentWindow?.focus();
		frameElement?.contentWindow?.print();

		target?.remove();
	};
</script>

<div style="display: none;">
	<PrintComponent {...printProps} />
	<iframe
		title="Print frame"
		bind:this={frameElement}
		{@attach iframeAttach}
	></iframe>
</div>
