module.exports = {
  async up(db) {
    await db.collection("users").updateMany({}, { $set: { email: { required: false } } });
  },
  async down(db) {
    await db.collection("users").updateMany({}, { $set: { email: { required: true } } });
  }
};
