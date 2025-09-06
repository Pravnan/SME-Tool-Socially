import cron from "node-cron";
import fetch from "node-fetch";

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    await fetch("http://localhost:3000/api/run-cron");
    console.log("✅ Cron pinged run-cron");
  } catch (err) {
    console.error(" Cron failed:", err);
  }
});
