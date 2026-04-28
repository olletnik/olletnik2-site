import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootFiles = [
    "index.html",
    "akademie.html",
    "datenschutz.html",
    "impressum.html",
    "it-services.html",
    "ki-innovation.html",
    "kontakt.html",
    "ueber-uns.html",
    "styles.css",
    "script.js",
    "robots.txt",
    "sitemap.xml",
    "favicon.ico",
    "favicon.svg",
    "favicon-96x96.png",
    "apple-touch-icon.png",
    "site.webmanifest",
    "web-app-manifest-192x192.png",
    "web-app-manifest-512x512.png"
];

const assetDirectories = ["Fotos", "Logos", "Referenzen"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outputDirectory = process.argv[2] ?? ".cloudflare-pages";
const publishPath = path.resolve(repoRoot, outputDirectory);

async function assertExists(relativePath) {
    const fullPath = path.resolve(repoRoot, relativePath);

    try {
        await stat(fullPath);
    }
    catch {
        throw new Error(`Expected publish path is missing: ${relativePath}`);
    }

    return fullPath;
}

await rm(publishPath, { recursive: true, force: true });
await mkdir(publishPath, { recursive: true });

for (const file of rootFiles) {
    const sourcePath = await assertExists(file);
    const destinationPath = path.join(publishPath, file);
    await cp(sourcePath, destinationPath, { force: true });
}

for (const directory of assetDirectories) {
    const sourcePath = await assertExists(directory);
    const destinationPath = path.join(publishPath, directory);
    await cp(sourcePath, destinationPath, { recursive: true, force: true });
}

console.log(`Cloudflare publish directory prepared at: ${publishPath}`);