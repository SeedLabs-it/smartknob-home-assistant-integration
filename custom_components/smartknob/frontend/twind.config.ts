import { defineConfig } from '@twind/core';

import presetTailwind from '@twind/preset-tailwind';
import presetAutoprefix from '@twind/preset-autoprefix';
// import intellisense from '@twind/intellisense';

export default defineConfig({
  preflight: false,
  presets: [presetTailwind(), presetAutoprefix()],
});
