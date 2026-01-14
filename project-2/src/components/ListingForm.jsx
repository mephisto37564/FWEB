import { useState, useEffect } from "react";
import TextInput from "./TextInput";
import FormCard from "./FormCard";

export default function ListingForm({ initialData, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    duration: "",
    description: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        company: initialData.company || "",
        duration: initialData.duration || "",
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <FormCard>
      <form onSubmit={submit}>
        <TextInput
          label="Job Title"
          placeholder="Frontend Developer Intern"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <TextInput
          label="Company"
          placeholder="ABC Tech"
          value={form.company}
          onChange={(e) =>
            setForm({ ...form, company: e.target.value })
          }
          required
        />

        <TextInput
          label="Duration"
          placeholder="3 Months"
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: e.target.value })
          }
          required
        />

        <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "0.5rem", fontWeight: "500" }}>
            Description
          </label>
          <textarea
            placeholder="Describe the internship role, responsibilities, requirements, and what interns will learn..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={5}
            style={{
              padding: "0.6rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit">
            {initialData ? "Update Listing" : "Add Listing"}
          </button>
        </div>
      </form>
    </FormCard>
  );
}