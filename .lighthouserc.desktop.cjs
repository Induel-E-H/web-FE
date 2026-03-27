module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/'],
      numberOfRuns: 5,
      settings: {
        preset: 'desktop',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
