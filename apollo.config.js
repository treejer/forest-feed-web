module.exports = {
  client: {
    service: {
      name: 'forest_feed_api',
      localSchemaFile: './src/data/schema/forest_feed_api.graphql',
      includes: './src/**/*.graphql',
    },
    excludes: 'src/data/schema/**/*',
    clientOnlyDirectives: ['connection', 'type', 'rest'],
    clientSchemaDirectives: ['client', 'rest', 'contract'],
  },
};
