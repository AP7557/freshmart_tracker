import { useData } from "@/context/DataContext";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useRef } from "react";
import { FiBriefcase } from "react-icons/fi";

function CompanySelection({
  companySelected,
  setCompanySelected,
  register,
  errors,
}) {
  const { companyList } = useData();
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (autocompleteRef.current && companySelected) {
      autocompleteRef.current.querySelector("input").value = companySelected;
    }
  }, [companySelected]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <FiBriefcase className="text-green-600" />
        Company
      </label>
      <Autocomplete
        ref={autocompleteRef}
        options={companyList}
        value={companySelected || null}
        onChange={(_, newValue) => {
          setCompanySelected(newValue);
        }}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            {...register("company", { required: true })}
            label="Select a Company"
            variant="outlined"
            className="bg-white"
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default CompanySelection;
