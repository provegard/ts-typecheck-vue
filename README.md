# ts-typecheck-vue

## What is it?

`ts-typecheck-vue` is a piece of code that type checks TypeScript code with Vue support, i.e. it can
type check regular TypeScript code as well as
code inside a `<script lang="ts">` block in a Vue [Single File Component](https://vuejs.org/v2/guide/single-file-components.html) (SFC).
Vue SFC files are files with a `.vue` extension.

## Why does it exist?

Let's assume we have project that uses [Parcel](https://parceljs.org/) to build TypeScript code as well as Vue SFC files.
Parcel performs no type checking when compiling TypeScript files, so we have to have a separate build step that invokes
the TypeScript compiler (tsc) with `--noEmit`.

To be able to to import a Vue component from an SFC file, we use the following shim
(see for example [here](https://www.digitalocean.com/community/tutorials/vuejs-using-typescript-with-vue)):

```typescript
declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}
```

This makes it possible to elsewhere do:

```typescript
import MyComponent from "./some/component.vue"
```

We also include `.vue` files in our `tsconfig.json`:

```
{
   "compilerOptions": {
     ...
   },
   "include": [
     ...,
     "./**/*.vue"
   ]
}
```

Now the problem is - how do we type check TypeScript code inside the SFC files?

There are some existing options:

* https://vuejsexamples.com/type-check-your-script-in-your-vue-loader/ - but it relies on Webpack.
* https://github.com/TypeStrong/fork-ts-checker-webpack-plugin - also Webpack
* https://github.com/Yuyz0112/vue-type-check - is based on Vetur

In contrast, `ts-typecheck-vue` only depends on TypeScript itself.

## How to use

### CLI

### Library
