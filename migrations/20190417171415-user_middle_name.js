module.exports = {
  async up(db) {
    await db.collection("users").updateMany({}, { $set: { middleName: "" } });
  },

  async down(db) {}
};
