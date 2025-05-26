import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with Database
export const clerkWebHook = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Log the incoming headers and body for debugging
    console.log("Webhook Headers:", req.headers);
    console.log("Webhook Body:", req.body);

    // Verifying Header
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;
    console.log("Webhook Event Type:", type);
    console.log("Webhook Data:", data);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
          resume: "",
        };
        console.log("Creating User:", userData);
        await User.create(userData);
        res.json({ success: true });
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url || "",
        };
        console.log("Updating User:", userData);
        await User.findByIdAndUpdate(data.id, userData);
        res.json({ success: true });
        break;
      }
      case "user.deleted": {
        console.log("Deleting User:", data.id);
        await User.findByIdAndDelete(data.id);
        res.json({ success: true });
        break;
      }
      default:
        console.log("Unhandled Event Type:", type);
        res.json({ success: false, message: "Unhandled event type" });
        break;
    }
  } catch (error) {
    console.error("Webhook Error:", {
      message: error.message,
      stack: error.stack,
      headers: req.headers,
      body: req.body,
    });
    res.json({ success: false, message: `Webhook Error: ${error.message}` });
  }
};