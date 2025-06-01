import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true }, // Fixed typo: requried -> required
  password: { type: String, required: true }, // Fixed typo: requried -> required
});

const Company = mongoose.model("Company", companySchema);

export default Company;
