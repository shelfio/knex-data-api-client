import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        plugins: {
            import: importPlugin,
        },
        rules: {
            "no-use-before-define": ["error", {
                functions: false,
            }],
            "comma-dangle": ["error", "always-multiline"],
            "arrow-parens": "off",
            "import/no-unresolved": "error",
            "import/named": "error",
            "import/default": "error",
            "import/namespace": "error",
            "import/no-absolute-path": "error",
            "import/no-dynamic-require": "error",
            "import/no-self-import": "error",
            "import/no-cycle": "error",
            "import/no-useless-path-segments": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",
        },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                global: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly",
            },
        },
    },
];