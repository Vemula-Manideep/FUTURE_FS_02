const connectDB = require("./config/db");
const User = require("./models/User");
const Lead = require("./models/Lead");
const FollowUp = require("./models/FollowUp");

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Lead.deleteMany(), FollowUp.deleteMany()]);

  const admin = await User.create({
    name: "Aarav Admin",
    email: "admin@minicrm.test",
    password: "Password123!",
    role: "Admin",
    permissions: ["*"],
  });

  const manager = await User.create({
    name: "Mira Manager",
    email: "manager@minicrm.test",
    password: "Password123!",
    role: "Manager",
    permissions: ["lead:read", "lead:write"],
  });

  const leads = await Lead.create([
    {
      client: { name: "Rohan Mehta", company: "Northstar Labs", email: "rohan@northstar.test", phone: "+91 90000 00001" },
      source: "Website",
      status: "Qualified",
      assignedTo: manager._id,
      priority: "High",
      estimatedValue: 180000,
      tags: ["saas", "hot"],
      createdBy: admin._id,
    },
    {
      client: { name: "Priya Shah", company: "BluePeak Media", email: "priya@bluepeak.test", phone: "+91 90000 00002" },
      source: "LinkedIn",
      status: "Proposal Sent",
      assignedTo: manager._id,
      priority: "Medium",
      estimatedValue: 95000,
      tags: ["agency"],
      createdBy: admin._id,
    },
  ]);

  await FollowUp.create({ lead: leads[0]._id, note: "Send pricing comparison and schedule demo.", type: "task", createdBy: manager._id });
  console.log("Seed complete: admin@minicrm.test / Password123!");
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
