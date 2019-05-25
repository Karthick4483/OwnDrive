module.exports = {
  async up(db) {
    await db.collection('files').dropIndex('name');
  },

  async down(db) {
    await db.collection('files').createIndex('name');
  },
};
