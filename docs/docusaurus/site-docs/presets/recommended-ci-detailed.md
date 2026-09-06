# recommended-ci-detailed

Hide live output in CI while retaining the detailed process summary.

```js
export default {
 extends: ["stylelint-plugin-file-progress/configs/recommended-ci-detailed"],
};
```

![recommended-ci-detailed colored terminal demonstration](../../static/demos/presets/recommended-ci-detailed.gif)

This recording uses CI=true. Outside CI, the preset displays ordinary progress.

See [all options](../activate.md) and [compatibility](../compatibility.md) for summary and terminal behavior.
