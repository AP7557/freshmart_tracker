import React from "react";
import { useForm } from "react-hook-form";

function CompanySelection(companySelected, setCompanySelected, companyList) {
  const { register } = useForm();

  return (
    <div className="mt-4">
      <div>Company:</div>
      <select
        {...register("company", { required: true })}
        onChange={(e) => setCompanySelected(e.target.value)} // Set the company when changed
        value={companySelected}
        className="w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a Company</option>
        {companyList.map((company, index) => (
          <option key={index} value={company}>
            {company}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CompanySelection;
