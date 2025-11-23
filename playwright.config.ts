import { defineConfig, devices } from '@playwright/test';

type NodeLikeGlobal = typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const isCI = Boolean((globalThis as NodeLikeGlobal).process?.env?.CI);

export default defineConfig({
  testDir: './tests/e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: isCI,

  /* Retry on CI only */
  retries: isCI ? 2 : 0,

  /* Opt out of parallel tests on CI to keep it simple */
  ...(isCI ? { workers: 2 } : {}),

  /* Reporter */
  reporter: 'html',

  /* Shared settings for all projects. Requires `npm run dev` to be running locally. */
  use: {
    /* Base URL for `page.goto` calls in tests */
    baseURL: 'http://localhost:5175',

    /* Collect traces on first retry */
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Start a dedicated Vite dev server for tests on port 5175 */
  webServer: {
    command: 'npm run dev -- --port=5175',
    url: 'http://localhost:5175',
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
