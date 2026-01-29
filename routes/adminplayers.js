const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Profiles = require("../models/profiles");

console.log("Admin ROute loaded!");

router.get("/admin/players", async (req, res) => {
  try {
    const users = await User.find().lean();

    const data = await Promise.all(users.map(async (u) => {
      const profile = await Profiles.findOne({ accountId: u.accountId }).lean();

      const vbucks =
        profile?.profiles?.common_core?.items?.["Currency:MtxPurchased"]?.quantity || 0;

      let hype = 0;
      if (profile?.profiles?.arena?.stats?.attributes?.hype) {
        hype = profile.profiles.arena.stats.attributes.hype;
      } else if (profile?.profiles?.common_core?.stats?.attributes?.hype) {
        hype = profile.profiles.common_core.stats.attributes.hype;
      }

      return {
        username: u.username,
        accountId: u.accountId,
        banned: u.banned,
        created: u.created,
        hype,
        vbucks
      };
    }));

    res.json(data);
  } catch (err) {
    console.error("Admin players route error:", err);
    res.status(500).json({ error: "failed to fetch players" });
  }
});

module.exports = router;
