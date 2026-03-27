module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
      },
    },
    upload: {
      target: 'filesystem',
    },
  },
};
