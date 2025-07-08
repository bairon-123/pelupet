import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'y7kq56',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:8101",
  },
});



