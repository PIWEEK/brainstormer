import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess({
    postcss: true
  }),

	kit: {
		alias: {
      $state: resolve("./src/lib/state.ts"),
      $store: resolve("./src/lib/store.ts"),
      $events: resolve("./src/lib/events"),
      $styles: resolve("./src/lib/styles"),
      $components: resolve("./src/lib/components"),
      $screens: resolve("./src/screens"),
    },
    adapter: adapter({
      fallback: "index.html"
    })
	}
};

export default config;
