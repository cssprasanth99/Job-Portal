import mongoose from "mongoose";

const JobApplicationShema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    requried: true,
  },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", requried: true },
  status: { type: String, default: "Pending" },
  date: { type: Number, required: true },
});

const JobApplication = mongoose.model("JobApplication", JobApplicationShema);

export default JobApplication;
