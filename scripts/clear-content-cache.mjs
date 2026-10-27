import { rm } from "node:fs/promises";

// The content loader leaves deleted entries in place when the blog directory
// has no markdown left. Drop the local store so an empty collection stays empty.
await rm(new URL("../node_modules/.astro", import.meta.url), { recursive: true, force: true });
