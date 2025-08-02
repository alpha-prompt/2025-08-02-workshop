/** @type {import('prettier').Config} */
export default {
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/data/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/utils/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};
