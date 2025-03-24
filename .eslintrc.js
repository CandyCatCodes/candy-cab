// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "import", "typescript"],
  rules: {
    "prettier/prettier": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};

// module.exports = {
//   extends: ["expo", "prettier"],
//   plugins: ["prettier", "typescript"],
//   rules: {
//     "prettier/prettier": "error",
//   },
// };

// // https://docs.expo.dev/guides/using-eslint/
// module.exports = {
//   extends: 'expo',
//   ignorePatterns: ['/dist/*'],
// };
