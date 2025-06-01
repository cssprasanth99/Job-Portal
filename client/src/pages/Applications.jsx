import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { useContext } from "react";
import { appContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
  } = useContext(appContext);

  const uploadResume = async () => {
    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/users/update-resume",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsEdit(false);
    setResume(null);
  };

  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="contoner px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || (userData && userData.resume === "") ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 cursor-pointer">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept="application/pdf"
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="" />
                <button
                  onClick={uploadResume}
                  className="bg-green-100 border border-green-400 rounded-lg px-4 py-2 ml-2 cursor-pointer"
                >
                  Save
                </button>
              </label>
            </>
          ) : (
            <div className="flex gap-2">
              <a
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                href={userData.resume}
                target="_blank"
              >
                Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 text-left">
                Company
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left">
                Job Title
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left max-sm:hidden">
                Location
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left max-sm:hidden">
                Date
              </th>
              <th className="py-3 px-4 border-b border-gray-200 text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {userApplications.map(
              (job, index) =>
                true && (
                  <tr key={index}>
                    <td className="py-3 px-4 flex items-center gap-2 border-b border-gray-200">
                      <img
                        className="w-8 h-8"
                        src={job.companyId.image}
                        alt="img"
                      />
                      {job.companyId.name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {job.jobId.title}
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden border-gray-200">
                      {job.jobId.location}
                    </td>
                    <td className="py-2 px-4 border-b max-sm:hidden border-gray-200">
                      {moment(job.date).format("ll")}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <span
                        className={`px-4 py-1.5 rounded ${
                          job.status === "Accepted"
                            ? "bg-green-200"
                            : job.status === "Rejected"
                            ? "bg-red-200"
                            : "bg-blue-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
