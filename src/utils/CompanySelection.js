import { useForm } from "react-hook-form";
import { useData } from "@/context/DataContext";

function CompanySelection({ companySelected, setCompanySelected, register }) {
  const { companyList } = useData();

  return (
    <div className="mt-4">
      <div>Company:</div>
      <select
        {...register("company", { required: true })}
        onChange={(e) => setCompanySelected(e.target.value)}
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
