import { useState } from "react";

import { useSparePartStore } from "../store/sparePartStore";
import ImageUploader from "../components/ImageUploader";

export default function AddPart() {
  const addPart = useSparePartStore((s) => s.addPart);

  const [form, setForm] = useState({
    machine: "",
    machineCode: "",
    partNumber: "",
    partName: "",
    category: "",
    quantity: 0,
    minStock: 0,
    location: "",
    supplier: "",
    image: "",
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addPart({
      id: crypto.randomUUID(),
      ...form,
    });

    alert("Part Added");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Add Spare Part</h1>

      <form onSubmit={submit}>
        <input
          placeholder="Machine"
          value={form.machine}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              machine: e.target.value,
            }))
          }
        />

        <br />
        <br />

        <input
          placeholder="Machine Code"
          value={form.machineCode}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              machineCode: e.target.value,
            }))
          }
        />

        <br />
        <br />

        <ImageUploader
          onImageUpload={(image) =>
            setForm((prev) => ({
              ...prev,
              image,
            }))
          }
        />

        <br />
        <br />

        <input
          placeholder="Part Number"
          value={form.partNumber}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              partNumber: e.target.value,
            }))
          }
        />

        <br />
        <br />

        <input
          placeholder="Part Name"
          value={form.partName}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              partName: e.target.value,
            }))
          }
        />

        <br />
        <br />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              quantity: Number(e.target.value),
            }))
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Minimum Stock"
          value={form.minStock}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              minStock: Number(e.target.value),
            }))
          }
        />

        <br />
        <br />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
        />

        <br />
        <br />

        <input
          placeholder="Supplier"
          value={form.supplier}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              supplier: e.target.value,
            }))
          }
        />

        <br />
        <br />

        <button type="submit">Save Spare Part</button>
      </form>
    </div>
  );
}

``