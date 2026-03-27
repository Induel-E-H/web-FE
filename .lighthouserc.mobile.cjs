module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/'],
      numberOfRuns: 5,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
