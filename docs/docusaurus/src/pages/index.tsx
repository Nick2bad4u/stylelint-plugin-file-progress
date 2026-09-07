import type { JSX } from "react";

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import project from "../data/project.json" with { type: "json" };

const features = [
    {
        description: "One rule. Your existing config, fixes, and diagnostics.",
        icon: "◆",
        label: "Native Stylelint plugin",
    },
    {
        description:
            "File, compact, and summary modes, with CI and TTY presets.",
        icon: "›_",
        label: "Your terminal, your rules",
    },
    {
        description:
            "Observed files, elapsed time, and throughput at shutdown.",
        icon: "◷",
        label: "Useful process summaries",
    },
];

const paths = [
    {
        description:
            "Install the plugin and add a preset to your existing Stylelint configuration.",
        icon: "↗",
        label: "Install & configure",
        title: "Get started",
        to: "/getting-started",
        tone: "teal",
    },
    {
        description:
            "Compare seven presets, from everyday filenames to a quiet CI summary.",
        icon: "≋",
        label: "Compare presets",
        title: "Choose your output",
        to: "/presets",
        tone: "violet",
    },
    {
        description:
            "Explore paths, spinner styles, streams, messages, and display thresholds.",
        icon: "{ }",
        label: "Explore the rule",
        title: "Make it yours",
        to: "/activate",
        tone: "amber",
    },
];

/** Render the documentation landing page and its generated package catalog. */
export default function Home(): JSX.Element {
    const logo = useBaseUrl("/img/logo.svg");
    const terminal = useBaseUrl("/img/terminal.svg");
    const detailedDemo = useBaseUrl("/demos/presets/recommended-detailed.gif");

    return (
        <Layout
            description="See which stylesheet is being linted. Explore seven Stylelint presets, colored terminal demos, configurable output, and process summaries."
            title="Live file progress for Stylelint"
        >
            <main>
                <header className="sfp-hero">
                    <div className="container">
                        <div className="sfp-hero-grid">
                            <div>
                                <p className="sfp-kicker">
                                    <span aria-hidden="true">◆</span> A little
                                    clarity for every lint run
                                </p>
                                <Heading as="h1" className="sfp-hero-title">
                                    Stylelint
                                    <br />
                                    <span>File Progress</span>
                                </Heading>
                                <p className="sfp-package-name">
                                    stylelint-plugin-file-progress
                                </p>
                                <p className="sfp-hero-description">
                                    See the stylesheet behind the wait. Live
                                    filenames and configurable process summaries
                                    for{" "}
                                    <Link
                                        className="sfp-inline-pill"
                                        href="https://stylelint.io/"
                                    >
                                        Stylelint
                                    </Link>
                                    , with terminal colors from{" "}
                                    <Link
                                        className="sfp-inline-pill"
                                        href="https://github.com/alexeyraspopov/picocolors"
                                    >
                                        picocolors
                                    </Link>
                                    .
                                </p>
                                <div className="sfp-actions">
                                    <Link
                                        className="button button--lg sfp-primary"
                                        to="/getting-started"
                                    >
                                        Get started{" "}
                                        <span aria-hidden="true">↗</span>
                                    </Link>
                                    <Link
                                        className="button button--lg sfp-secondary"
                                        to="/demos"
                                    >
                                        See it in action{" "}
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </div>
                            <aside
                                aria-label="Plugin preview"
                                className="sfp-hero-panel"
                            >
                                <div className="sfp-panel-brand">
                                    <img
                                        alt=""
                                        height="68"
                                        src={logo}
                                        width="68"
                                    />
                                    <div>
                                        <strong>
                                            Small plugin. Clear progress.
                                        </strong>
                                        <span>
                                            Built for your Stylelint workflow.
                                        </span>
                                    </div>
                                </div>
                                <img
                                    alt="Terminal preview showing observed stylesheet paths and a detailed process summary"
                                    className="sfp-terminal-poster"
                                    height="540"
                                    src={terminal}
                                    width="940"
                                />
                                <div className="sfp-panel-tags">
                                    <span>CSS · SCSS · custom syntax</span>
                                    <Link to="/compatibility">
                                        How observation works →
                                    </Link>
                                </div>
                            </aside>
                        </div>
                        <div className="sfp-feature-grid">
                            {features.map((feature) => (
                                <article
                                    className="sfp-feature"
                                    key={feature.label}
                                >
                                    <span
                                        aria-hidden="true"
                                        className="sfp-feature-icon"
                                    >
                                        {feature.icon}
                                    </span>
                                    <div>
                                        <Heading as="h2">
                                            {feature.label}
                                        </Heading>
                                        <p>{feature.description}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <ul
                            aria-label="Package and repository status"
                            className="sfp-badges"
                        >
                            {project.badges.map((badge) => (
                                <li key={badge.src}>
                                    <Link href={badge.href}>
                                        <img
                                            alt={badge.alt}
                                            decoding="async"
                                            height="20"
                                            loading="lazy"
                                            src={badge.src}
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </header>

                <section
                    aria-labelledby="explore-title"
                    className="sfp-section container"
                >
                    <div className="sfp-section-heading">
                        <div>
                            <p className="sfp-eyebrow">Start here</p>
                            <Heading as="h2" id="explore-title">
                                Progress that fits your workflow.
                            </Heading>
                        </div>
                        <Link className="sfp-text-link" to="/overview">
                            Meet the plugin →
                        </Link>
                    </div>
                    <div className="sfp-card-grid">
                        {paths.map((path) => (
                            <article
                                className={`sfp-card sfp-tone-${path.tone}`}
                                key={path.to}
                            >
                                <span
                                    aria-hidden="true"
                                    className="sfp-card-icon"
                                >
                                    {path.icon}
                                </span>
                                <Heading as="h3">{path.title}</Heading>
                                <p>{path.description}</p>
                                <Link to={path.to}>{path.label} →</Link>
                            </article>
                        ))}
                    </div>
                    <div className="sfp-metrics">
                        <p>
                            <strong>1</strong> observational rule
                        </p>
                        <p>
                            <strong>{project.presets.length}</strong>{" "}
                            ready-to-use presets
                        </p>
                        <p>
                            <strong>{project.optionCount}</strong> display
                            options
                        </p>
                        <p>
                            <strong>{project.demoCount}</strong> terminal demos
                        </p>
                    </div>
                </section>

                <section
                    aria-labelledby="demo-title"
                    className="sfp-section sfp-section-tinted"
                >
                    <div className="container sfp-demo-grid">
                        <div>
                            <p className="sfp-eyebrow">
                                A look inside your terminal
                            </p>
                            <Heading as="h2" id="demo-title">
                                Follow the files.
                                <br />
                                Keep the useful details.
                            </Heading>
                            <p>
                                Choose readable filenames while Stylelint works,
                                then see observed file counts, elapsed time, and
                                throughput in a single process summary.
                            </p>
                            <p>
                                Each update ends on its own line. Spinner frames
                                advance with file events, with no background
                                animation running over your formatter.
                            </p>
                            <Link className="sfp-text-link" to="/demos">
                                Explore all {project.demoCount} recordings →
                            </Link>
                            <p className="sfp-small">
                                Timings in these reproducible demos illustrate
                                process metrics.{" "}
                                <Link to="/compatibility#what-a-file-event-means">
                                    What does a file event mean?
                                </Link>
                            </p>
                        </div>
                        <figure className="sfp-demo-frame">
                            <details className="sfp-demo-toggle">
                                <summary>
                                    Play the detailed terminal recording
                                </summary>
                                <img
                                    alt="recommended-detailed animated terminal demonstration"
                                    decoding="async"
                                    loading="lazy"
                                    src={detailedDemo}
                                />
                            </details>
                            <img
                                alt="Still preview of Stylelint file progress and its process summary"
                                className="sfp-demo-still"
                                height="540"
                                loading="lazy"
                                src={terminal}
                                width="940"
                            />
                            <figcaption>
                                <Link to="/presets/recommended-detailed">
                                    recommended-detailed
                                </Link>
                                <span>
                                    Real display controller · reproducible file
                                    events
                                </span>
                            </figcaption>
                        </figure>
                    </div>
                </section>

                <section
                    aria-labelledby="presets-title"
                    className="sfp-section container"
                >
                    <div className="sfp-section-heading">
                        <div>
                            <p className="sfp-eyebrow">
                                Seven ways to show progress
                            </p>
                            <Heading as="h2" id="presets-title">
                                Pick a preset. Get on with your CSS.
                            </Heading>
                        </div>
                        <Link className="sfp-text-link" to="/presets">
                            View the comparison →
                        </Link>
                    </div>
                    <div className="sfp-preset-grid">
                        {project.presets.map((preset) => (
                            <Link
                                className={`sfp-preset-card sfp-tone-${preset.tone}`}
                                key={preset.name}
                                to={`/presets/${preset.name}`}
                            >
                                <span className="sfp-pill">{preset.label}</span>
                                <Heading as="h3">{preset.name}</Heading>
                                <p>{preset.description}</p>
                                <span className="sfp-preset-link">
                                    View config & demo{" "}
                                    <span aria-hidden="true">↗</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section
                    aria-labelledby="install-title"
                    className="sfp-section sfp-section-tinted"
                >
                    <div className="container sfp-install-grid">
                        <div>
                            <p className="sfp-eyebrow">Ready when you are</p>
                            <Heading as="h2" id="install-title">
                                One install.
                                <br />
                                One config entry.
                            </Heading>
                            <p>
                                Add the progress preset after your existing
                                configs. Your lint rules and autofixes continue
                                to work as usual.
                            </p>
                            <div className="sfp-compat-pills">
                                <Link to="/compatibility">Node.js 22+</Link>
                                <Link to="/compatibility">
                                    Stylelint 16 & 17
                                </Link>
                                <Link to="/getting-started#commonjs">
                                    ESM + CommonJS
                                </Link>
                                <Link to="/developer/api">
                                    TypeScript declarations
                                </Link>
                            </div>
                        </div>
                        <div className="sfp-install-code">
                            <CodeBlock language="sh">
                                {
                                    "npm install --save-dev stylelint stylelint-plugin-file-progress"
                                }
                            </CodeBlock>
                            <CodeBlock
                                language="js"
                                title="stylelint.config.mjs"
                            >
                                {
                                    'export default {\n    extends: [\n        "stylelint-plugin-file-progress/configs/recommended",\n    ],\n};'
                                }
                            </CodeBlock>
                            <Link
                                className="sfp-text-link"
                                to="/getting-started"
                            >
                                Read the setup guide →
                            </Link>
                        </div>
                    </div>
                </section>
                <section
                    aria-labelledby="ecosystem-title"
                    className="sfp-section container sfp-ecosystem"
                >
                    <div>
                        <p className="sfp-eyebrow">Part of the same toolkit</p>
                        <Heading as="h2" id="ecosystem-title">
                            Familiar tools. Connected docs.
                        </Heading>
                        <p>
                            Explore the ESLint counterpart, shared Stylelint
                            config, and the inspectors behind this project.
                        </p>
                    </div>
                    <div className="sfp-ecosystem-links">
                        <Link href="https://nick2bad4u.github.io/eslint-plugin-file-progress-2/">
                            ESLint File Progress ↗
                        </Link>
                        <Link href="https://nick2bad4u.github.io/eslint-plugin-typefest/">
                            ESLint Typefest ↗
                        </Link>
                        <Link href="https://github.com/Nick2bad4u/stylelint-config-nick2bad4u">
                            Shared Stylelint config ↗
                        </Link>
                        <Link to="/resources">
                            Inspectors & project links →
                        </Link>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
