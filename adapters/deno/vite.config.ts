import { denoServerAdapter } from '@builder.io/qwik-city/adapters/deno-server/vite';
import { extendConfig } from '@builder.io/qwik-city/vite';
import baseConfig from '../../vite.config';

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.deno.tsx', '@qwik-city-plan'],
      },
      minify: false,
    },
    plugins: [
      denoServerAdapter(),
    ],
  };
});
