---
sidebar_label: recommended-ci
description: Hide all plugin output when CI is exactly true.
---

# recommended-ci

<span className="sfp-pill sfp-tone-blue">Quiet in CI</span>

Hide all plugin output when CI is exactly true.

## Configuration

```js
export default {
 extends: ["stylelint-plugin-file-progress/configs/recommended-ci"],
};
```

Keep your existing shared configs before this preset.

## Terminal preview

![recommended-ci colored terminal demonstration](../../static/demos/presets/recommended-ci.gif)

This recording uses CI=true. Outside CI, the preset displays ordinary progress.

## Make it yours

See [all options](../activate.md), [compare presets](../presets.md), and [compatibility](../compatibility.md) for summary and terminal behavior. Explore the [demo gallery](../demos.md#recommended-ci) or follow the [setup guide](../getting-started.md).
