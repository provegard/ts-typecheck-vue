# ts-typecheck-vue

## What is it?

`ts-typecheck-vue` is a piece of code that type checks TypeScript code with Vue support, i.e. it can
type check regular TypeScript code as well as
code inside a `<script lang="ts">` block in a Vue [Single File Component](https://vuejs.org/v2/guide/single-file-components.html) (SFC).
Vue SFC files are files with a `.vue` extension.

## Why does it exist?

`ts-typecheck-vue` was born out of the following situation:

I have a project that uses [Parcel](https://parceljs.org/) to build TypeScript code as well as Vue SFC files.
Parcel performs no type checking when compiling TypeScript files, so I have a separate build step that invokes
the TypeScript compiler (tsc) with `--noEmit`.

To be able to to import a Vue component from an SFC file, I use the following shim
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
