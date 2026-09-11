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
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="page-title">Add Spare Part</h1>
        </div>
      </header>

      <div className="form-panel panel">
        <form onSubmit={submit} className="form-grid">
          <div className="field-group">
            <label htmlFor="machine">Machine</label>
            <input
              id="machine"
              placeholder="Machine"
              value={form.machine}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  machine: e.target.value,
                }))
              }
            />
          </div>

          <div className="field-group">
            <label htmlFor="machineCode">Machine Code</label>
            <input
              id="machineCode"
              placeholder="Machine Code"
              value={form.machineCode}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  machineCode: e.target.value,
                }))
              }
            />
          </div>

          <div className="field-group full-width">
            <label htmlFor="partNumber">Part Number</label>
            <input
              id="partNumber"
              placeholder="Part Number"
              value={form.partNumber}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  partNumber: e.target.value,
                }))
              }
            />
          </div>

          <div className="field-group full-width">
            <label htmlFor="partName">Part Name</label>
            <input
              id="partName"
              placeholder="Part Name"
              value={form.partName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  partName: e.target.value,
                }))
              }
            />
          </div>

          <div className="field-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            />
          </div>

          <div className="field-group">
            <label htmlFor="supplier">Supplier</label>
            <input
              id="supplier"
              placeholder="Supplier"
              value={form.supplier}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  supplier: e.target.value,
                }))
              }
            />
          </div>

          <div className="field-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
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
          </div>

          <div className="field-group">
            <label htmlFor="minStock">Minimum Stock</label>
            <input
              id="minStock"
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
          </div>

          <div className="field-group full-width">
            <label>Image</label>
            <ImageUploader
              onImageUpload={(image) =>
                setForm((prev) => ({
                  ...prev,
                  image,
                }))
              }
            />
          </div>

          <div className="field-group full-width form-actions">
            <button type="submit" className="primary-button">
              Save Spare Part
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

``