# Widget specification v1

OSSInsight charts and visualizations will be developed under widget specification.

## Compositions

A widget implementation contains several config or code fragments:

- [Metadata](#metadata): Defines human-readable information for the widget. Including dynamic SEO info generator.
- [Datasource](#datasource): Defines how a widget fetch required data.
- [Visualization](#visualization): Defines how a widget rendering fetched data to browser chart or static image.
- [Parameters](#parameters): Defines dynamic parameters the widget takes to provide flexibilities.

### Metadata

#### package.json

Widget should provide a `package.json` file. Several fields will be used as widget metadata info:

- `name`: The unique name of the widget. All official widgets name should have `@ossinsight/widget-` prefix. And the
  name should be a valid npm package name.
- `version`: Required field by npm, not vital.
- `description` (Optional): Describe what the widget does. If no dynamic SEO description provided, this field will be
  taken as fallback text.
- `keywords` (Optional): Will be used to classify widget. For example: `Repository`, `Collection`, `PRs`, `Stars`, ...
- `author`: Default to `OSSInsight` for official widgets.

#### metadata.ts

Widget should provide a `metadata.ts` for generate dynamic metadata for SEO.

This file should provide a default exported function, takes
[`WidgetVisualizerContext`](./packages/widgets-types/index.d.ts) as argument and returns partial of
[Next.js metadata object](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

### Datasource

Widget must provide a `datasource.json` to define how the widget fetch required data.

See [Datasource Schema v1](schemas/widget/v1/datasource-schema.json) for documentations.

### Visualization

Widget must provide a `visualization.ts` to define how the widget renders data into chart or static images. The file
should export:

- `default`: A function to returns renderer config.
- `type`: Indicates which renderer the widget uses.

The renderer function body should be **platform independent** and **framework independent**.

The first argument is the fetched data from datasource. If the `datasource.json` provides multiple datasource, the
argument will be an array.

### Parameters

A widget could accept several dynamic parameters during data-fetching and rendering. All available parameters should be
defined in `params.json`.

See [Parameters Schema v1](schemas/widget/v1/parameters-schema.json) for documentations.

## Implementations

The package [`@ossinsight/widgets-core`](./packages/widgets-core) provides all widget logic codes during client side
render and server side rendering.

- [src/datasource](./packages/widgets-core/src/datasource): All types of datasource fetchers will be placed in this
  folder.
- [src/parameters](./packages/widgets-core/src/parameters)
  - [parser](./packages/widgets-core/src/parameters/parser): parse string value to typed value (like id string to
    number)
  - [react](./packages/widgets-core/src/parameters/react): UI input components for all parameter types
- [src/render](./packages/widgets-core/src/renderer)
  - [react](./packages/widgets-core/src/renderer/react): React renderers for different widget visualization types.
  - [node](./packages/widgets-core/src/renderer/node): Server buffer renderers for different widget visualization
    types.

## Utility packages



### `@ossinsight/widgets-utils`

Utils for widgets. Auto installed for all widgets.

### `@ossinsight/widgets-types`

Type definitions for widgets. Auto installed for all widgets.

### `@ossinsight/widgets-next`

Next plugin to automatically transform widgets into ESM Modules.

### *[Planned]* `@ossinsight/widgets-eslint-plugin`

ESLint plugin for validate widget folders.

### *[Planned]* `@ossinsight/create-widget`

Use pnpm create to create a widget folder conveniently.

### *[Planned]* `@ossinsight/widgets-devkit`

A tool to preview a widget locally without OSSInsight source code and dependencies.
