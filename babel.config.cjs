module.exports = {
    env: {
        test: {
            plugins: [
                // https://gist.github.com/rstacruz/511f43265de4939f6ca729a3df7b001c#method-b-using-babel
                '@babel/plugin-transform-modules-commonjs',
                // https://github.com/vitejs/vite/issues/1149#issuecomment-770846868
                'babel-plugin-transform-import-meta',
            ],
        },
    },
};
