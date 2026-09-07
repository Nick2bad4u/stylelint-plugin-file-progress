import type { Config } from "@docusaurus/types";

import project from "./src/data/project.json" with { type: "json" };

const config = {
    baseUrl: "/stylelint-plugin-file-progress/",
    baseUrlIssueBanner: true,
    deploymentBranch: "gh-pages",
    favicon: "img/favicon.svg",
    markdown: { format: "detect", hooks: { onBrokenMarkdownLinks: "throw" } },
    onBrokenAnchors: "throw",
    onBrokenLinks: "throw",
    onDuplicateRoutes: "throw",
    organizationName: "Nick2bad4u",
    plugins: [
        [
            "@docusaurus/plugin-pwa",
            {
                // eslint-disable-next-line n/no-process-env -- PWA debug is an explicit build-time opt-in.
                debug: process.env.DOCUSAURUS_PWA_DEBUG === "true",
                offlineModeActivationStrategies: [
                    "appInstalled",
                    "standalone",
                    "queryString",
                ],
                pwaHead: [
                    {
                        href: "/stylelint-plugin-file-progress/site.webmanifest",
                        rel: "manifest",
                        tagName: "link",
                    },
                    {
                        content: "#10bfae",
                        name: "theme-color",
                        tagName: "meta",
                    },
                    {
                        href: "/stylelint-plugin-file-progress/img/favicon.svg",
                        rel: "icon",
                        tagName: "link",
                    },
                ],
            },
        ],
    ],
    presets: [
        [
            "classic",
            {
                blog: false,
                docs: {
                    editUrl: ({ docPath }: Readonly<{ docPath: string }>) => {
                        if (docPath.startsWith("developer/api/"))
                            return undefined;
                        const source =
                            docPath === "activate.md"
                                ? "docs/rules/activate.md"
                                : docPath === "developer/contributing.md"
                                  ? "CONTRIBUTING.md"
                                  : docPath === "presets.md" ||
                                      docPath === "demos.md" ||
                                      docPath.startsWith("presets/")
                                    ? "scripts/sync.mjs"
                                    : `docs/docusaurus/site-docs/${docPath}`;
                        return `https://github.com/Nick2bad4u/stylelint-plugin-file-progress/edit/main/${source}`;
                    },
                    path: "site-docs",
                    routeBasePath: "/",
                    sidebarPath: "./sidebars.ts",
                },
                theme: { customCss: "./src/css/custom.css" },
            },
        ],
    ],
    projectName: "stylelint-plugin-file-progress",
    tagline: "Know which stylesheet is being linted.",
    themeConfig: {
        colorMode: { defaultMode: "dark", respectPrefersColorScheme: true },
        docs: { sidebar: { autoCollapseCategories: false, hideable: true } },
        footer: {
            copyright:
                '© 2026 <a href="https://github.com/Nick2bad4u">Nick2bad4u</a> · MIT licensed · Built with <a href="https://docusaurus.io/">Docusaurus</a>.',
            links: [
                {
                    items: [
                        { label: "Overview", to: "/overview" },
                        { label: "Getting started", to: "/getting-started" },
                        { label: "Compare presets", to: "/presets" },
                        { label: "Rule & options", to: "/activate" },
                        { label: "Terminal demos", to: "/demos" },
                    ],
                    title: "📚 Explore",
                },
                {
                    items: [
                        {
                            href: "https://github.com/Nick2bad4u/stylelint-plugin-file-progress",
                            label: "GitHub repository",
                        },
                        {
                            href: "https://www.npmjs.com/package/stylelint-plugin-file-progress",
                            label: "npm package",
                        },
                        {
                            href: "https://github.com/Nick2bad4u/stylelint-plugin-file-progress/releases",
                            label: "Releases & changelog",
                        },
                        {
                            href: "https://github.com/Nick2bad4u/stylelint-plugin-file-progress/issues",
                            label: "Report an issue",
                        },
                        {
                            label: "Project & ecosystem links",
                            to: "/resources",
                        },
                    ],
                    title: "📦 Project",
                },
                {
                    items: [
                        {
                            label: "Contributing",
                            to: "/developer/contributing",
                        },
                        { label: "API reference", to: "/developer/api" },
                        {
                            label: "Compatibility & metrics",
                            to: "/compatibility",
                        },
                        {
                            href: "pathname:///eslint-inspector/",
                            label: "ESLint inspector",
                            target: "_self",
                        },
                        {
                            href: "pathname:///stylelint-inspector/",
                            label: "Stylelint inspector",
                            target: "_self",
                        },
                    ],
                    title: "🛠 Development",
                },
            ],
            style: "dark",
        },
        image: "img/social-card.png",
        navbar: {
            items: [
                {
                    items: [
                        { label: "Overview", to: "/overview" },
                        { label: "Getting started", to: "/getting-started" },
                        { label: "Rule & options", to: "/activate" },
                        {
                            label: "Compatibility & metrics",
                            to: "/compatibility",
                        },
                        { label: "Troubleshooting", to: "/troubleshooting" },
                    ],
                    label: "📚 Docs",
                    position: "left",
                    type: "dropdown",
                },
                {
                    items: [
                        { label: "Compare all presets", to: "/presets" },
                        ...project.presets.map((preset) => ({
                            label: `${preset.icon} ${preset.label}`,
                            to: `/presets/${preset.name}`,
                        })),
                    ],
                    label: "⚙ Presets",
                    position: "left",
                    type: "dropdown",
                },
                { label: "▶ Demos", position: "left", to: "/demos" },
                {
                    items: [
                        {
                            label: "Contributing",
                            to: "/developer/contributing",
                        },
                        { label: "API reference", to: "/developer/api" },
                        {
                            label: "Quality review",
                            to: "/developer/quality-review",
                        },
                        { label: "Inspectors & resources", to: "/resources" },
                    ],
                    label: "🛠 Dev",
                    position: "right",
                    type: "dropdown",
                },
                {
                    href: "https://github.com/Nick2bad4u/stylelint-plugin-file-progress",
                    label: "GitHub",
                    position: "right",
                },
            ],
            logo: { alt: "", src: "img/logo.svg" },
            title: "Stylelint File Progress",
        },
        prism: {
            additionalLanguages: [
                "bash",
                "json",
                "scss",
            ],
        },
    },
    themes: [
        [
            "@easyops-cn/docusaurus-search-local",
            {
                docsDir: "site-docs",
                docsRouteBasePath: "/",
                hashed: "filename",
                highlightSearchTermsOnTargetPage: true,
                indexBlog: false,
                indexDocs: true,
                indexPages: true,
                language: "en",
                searchBarShortcut: true,
                searchBarShortcutHint: true,
                searchResultContextMaxLength: 96,
            },
        ],
    ],
    title: "Stylelint File Progress",
    trailingSlash: false,
    url: "https://nick2bad4u.github.io",
} satisfies Config;
export default config;
