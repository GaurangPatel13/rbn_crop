import { useState, useEffect } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Swal from "sweetalert2";
import PageLoader from "../components/ui/PageLoader";
import { getLevelIncomePlan, updateLevelIncomePlan } from "../api/product-management-api";

export default function ReferralManagement() {
  const [levels, setLevels] = useState([]); // [6, 3, 2, 4, 5, 6]
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        const response = await getLevelIncomePlan();
        if (response && Array.isArray(response.levels)) {
          setLevels(response.levels); // response.levels = [6, 3, 2, 4, 5, 6]
        }
      } catch (error) {
        console.error("Error fetching referral levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const handleLevelChange = (index, value) => {
    const updatedLevels = [...levels];
    updatedLevels[index] = Number(value);
    setLevels(updatedLevels);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await updateLevelIncomePlan({ levels });
      if (response) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Referral levels updated successfully!",
        });
        setShowEditForm(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="p-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Level</th>
              <th className="border p-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {levels.length > 0 ? (
              levels.map((value, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">Level {index + 1}</td>
                  <td className="border p-2 text-center">{value}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-gray-500 p-2">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4">
          <Button title="Update" onClick={() => setShowEditForm(true)} disabled={loading} />
        </div>
      </div>

      {showEditForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[400px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Referral Levels</h2>
            {levels.map((value, index) => (
              <InputField
                key={index}
                type="number"
                label={`Level ${index + 1} %`}
                name={`level-${index}`}
                value={value}
                onChange={(e) => handleLevelChange(index, e.target.value)}
              />
            ))}
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
