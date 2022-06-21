module.exports = {
    space: 4,
    prettier: true,
    rules: {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                'js': 'never',
                'ts': 'never',
            },
        ],
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/prefer-module': 'off',
        'capitalized-comments': 'off',
        'no-alert': 'off',
        'no-warning-comments': 'off',
        'unicorn/no-array-reduce': 'off',
        'node/prefer-global/process': 'off',
        'n/prefer-global/process': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/padding-line-between-statements': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-redundant-type-constituents': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
    },
};
