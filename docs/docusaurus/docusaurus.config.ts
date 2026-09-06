import type { Config } from "@docusaurus/types";

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
                    editUrl:
                        "https://github.com/Nick2bad4u/stylelint-plugin-file-progress/edit/main/docs/docusaurus/",
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
        footer: {
            copyright: "Copyright © 2026 Nick2bad4u. MIT licensed.",
            links: [
                {
                    items: [
                        { label: "Getting started", to: "/" },
                        { label: "Compatibility", to: "/compatibility" },
                        { label: "Presets", to: "/presets" },
                    ],
                    title: "Use the plugin",
                },
                {
                    items: [
                        {
                            href: "https://github.com/Nick2bad4u/stylelint-plugin-file-progress",
                            label: "Repository",
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
                    title: "Development",
                },
            ],
            style: "dark",
        },
        image: "img/social-card.png",
        navbar: {
            items: [
                { label: "Options", position: "left", to: "/activate" },
                { label: "Presets", position: "left", to: "/presets" },
                {
                    href: "https://github.com/Nick2bad4u/stylelint-plugin-file-progress",
                    label: "GitHub",
                    position: "right",
                },
            ],
            title: "Stylelint File Progress",
        },
    },
    title: "Stylelint File Progress",
    trailingSlash: false,
    url: "https://nick2bad4u.github.io",
} satisfies Config;
export default config;
