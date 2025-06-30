const bcrypt = require("bcrypt");
const {
  User,
  Base,
  Asset,
  Purchase,
  Transfer,
  Assignment,
} = require("./models/associations");

const seedData = async () => {
  try {
    // console.log("Starting database seeding...");

    // Clear dependent tables first
    await Transfer.destroy({ where: {}, truncate: true, cascade: true });
    await Assignment.destroy({ where: {}, truncate: true, cascade: true });
    await Asset.destroy({ where: {}, truncate: true, cascade: true });
    await Purchase.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    // Now clear bases
    await Base.destroy({ where: {}, truncate: true, cascade: true });
    const bases = await Base.bulkCreate([
      { name: "Alpha Base", location: "North Region" },
      { name: "Bravo Base", location: "South Region" },
      { name: "Charlie Base", location: "East Region" },
      { name: "Delta Base", location: "West Region" },
    ]);
    // console.log(" Bases created:", bases.length);

    // Create users with hashed passwords
    const passwordHash = await bcrypt.hash("password123", 10);
    const users = await User.bulkCreate([
      {
        name: "Admin User",
        email: "admin@military.com",
        password_hash: passwordHash,
        role: "admin",
        base_id: null,
      },
      {
        name: "Commander Alpha",
        email: "commander.alpha@military.com",
        password_hash: passwordHash,
        role: "base_commander",
        base_id: bases[0].id,
      },
      {
        name: "Commander Bravo",
        email: "commander.bravo@military.com",
        password_hash: passwordHash,
        role: "base_commander",
        base_id: bases[1].id,
      },
      {
        name: "Logistics Officer Alpha",
        email: "logistics.alpha@military.com",
        password_hash: passwordHash,
        role: "logistics_officer",
        base_id: bases[0].id,
      },
      {
        name: "Logistics Officer Bravo",
        email: "logistics.bravo@military.com",
        password_hash: passwordHash,
        role: "logistics_officer",
        base_id: bases[1].id,
      },
      {
        name: "Soldier Alpha 1",
        email: "soldier.alpha1@military.com",
        password_hash: passwordHash,
        role: "logistics_officer",
        base_id: bases[0].id,
      },
      {
        name: "Soldier Bravo 1",
        email: "soldier.bravo1@military.com",
        password_hash: passwordHash,
        role: "logistics_officer",
        base_id: bases[1].id,
      },
    ]);
    // console.log("Users created:", users.length);

    // Create assets
    const assets = await Asset.bulkCreate([
      {
        type: "weapon",
        description: "Rifle M4A1",
        serial_number: "WEAPON-001",
        base_id: bases[0].id,
        status: "available",
      },
      {
        type: "weapon",
        description: "Pistol Glock 17",
        serial_number: "WEAPON-002",
        base_id: bases[0].id,
        status: "available",
      },
      {
        type: "vehicle",
        description: "Humvee Transport",
        serial_number: "VEHICLE-001",
        base_id: bases[0].id,
        status: "available",
      },
      {
        type: "ammunition",
        description: "5.56mm Rounds",
        serial_number: "AMMO-001",
        base_id: bases[0].id,
        status: "available",
      },
      {
        type: "equipment",
        description: "Night Vision Goggles",
        serial_number: "EQUIP-001",
        base_id: bases[0].id,
        status: "available",
      },
      {
        type: "weapon",
        description: "Sniper Rifle",
        serial_number: "WEAPON-003",
        base_id: bases[1].id,
        status: "available",
      },
      {
        type: "vehicle",
        description: "Tank M1A2",
        serial_number: "VEHICLE-002",
        base_id: bases[1].id,
        status: "available",
      },
      {
        type: "communication",
        description: "Radio Set",
        serial_number: "COMM-001",
        base_id: bases[1].id,
        status: "available",
      },
    ]);
    // console.log("Assets created:", assets.length);

    // Create purchases
    const purchases = await Purchase.bulkCreate([
      {
        asset_type: "weapon",
        quantity: 10,
        base_id: bases[0].id,
        date: new Date("2024-01-15"),
      },
      {
        asset_type: "vehicle",
        quantity: 2,
        base_id: bases[0].id,
        date: new Date("2024-01-20"),
      },
      {
        asset_type: "ammunition",
        quantity: 1000,
        base_id: bases[0].id,
        date: new Date("2024-02-01"),
      },
      {
        asset_type: "weapon",
        quantity: 5,
        base_id: bases[1].id,
        date: new Date("2024-02-10"),
      },
      {
        asset_type: "equipment",
        quantity: 20,
        base_id: bases[1].id,
        date: new Date("2024-02-15"),
      },
    ]);
    // console.log("Purchases created:", purchases.length);

    // Create transfers
    const transfers = await Transfer.bulkCreate([
      {
        asset_id: assets[0].id,
        from_base_id: bases[0].id,
        to_base_id: bases[1].id,
        quantity: 1,
        date: new Date("2024-02-20"),
      },
      {
        asset_id: assets[2].id,
        from_base_id: bases[0].id,
        to_base_id: bases[2].id,
        quantity: 1,
        date: new Date("2024-02-25"),
      },
      {
        asset_id: assets[5].id,
        from_base_id: bases[1].id,
        to_base_id: bases[0].id,
        quantity: 1,
        date: new Date("2024-03-01"),
      },
    ]);
    // console.log("Transfers created:", transfers.length);

    // Create assignments
    const assignments = await Assignment.bulkCreate([
      {
        asset_id: assets[1].id,
        personnel_id: users[5].id,
        assigned_at: new Date("2024-01-25"),
      },
      {
        asset_id: assets[3].id,
        personnel_id: users[6].id,
        assigned_at: new Date("2024-02-05"),
      },
      {
        asset_id: assets[4].id,
        personnel_id: users[5].id,
        assigned_at: new Date("2024-02-10"),
      },
    ]);
    // console.log(" Assignments created:", assignments.length);

    // Update asset statuses for assigned assets
    await Asset.update(
      { status: "assigned" },
      { where: { id: [assets[1].id, assets[3].id, assets[4].id] } }
    );

    // console.log(" Database seeding completed successfully!");
    // console.log("\n Sample Data Summary:");
    // console.log(`- Bases: ${bases.length}`);
    // console.log(`- Users: ${users.length}`);
    // console.log(`- Assets: ${assets.length}`);
    // console.log(`- Purchases: ${purchases.length}`);
    // console.log(`- Transfers: ${transfers.length}`);
    // console.log(`- Assignments: ${assignments.length}`);

    // console.log("\n Test Credentials:");
    // console.log("Admin: admin@military.com / password123");
    // console.log("Commander Alpha: commander.alpha@military.com / password123");
    // console.log("Logistics Alpha: logistics.alpha@military.com / password123");
  } catch (error) {
    console.error(" Error seeding data:", error);
    throw error;
  }
};

module.exports = { seedData };
