module.exports = {
  async up(db) {
    await db.collection("users").updateMany({}, { $unset: { middleName: "" } });
  },

  async down(db) {
    await db.collection("users").updateMany({}, { $set: { middleName: "" } });
  };
}