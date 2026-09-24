import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
// En GitHub Actions el nombre del repositorio es la ruta base de GitHub Pages (usuario.github.io/<repositorio>).
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "portfolio-erick-coll";
const repositoryBasePath = `/${repositoryName}`;

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        typescript: { tsconfigPath: "tsconfig.pages.json" },
      }
    : {}),
  basePath: isGitHubPages ? repositoryBasePath : "",
  assetPrefix: isGitHubPages ? repositoryBasePath : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? repositoryBasePath : "",
  },
};

export default nextConfig;
