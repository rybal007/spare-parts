import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import SpareParts from "./pages/SpareParts";
import AddPart from "./pages/AddPart";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import { useSparePartStore } from "./store/sparePartStore";

function App() {
  const isLoading = useSparePartStore((state) => state.isLoading);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <main className="page-content">
          {isLoading ? (
            <div className="loading-state" role="status" aria-live="polite">
              <span className="loading-spinner" aria-hidden="true" />
              <div>
                <h1>Connecting to inventory</h1>
                <p>Loading your spare-parts database...</p>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/parts" element={<SpareParts />} />
              <Route path="/add" element={<AddPart />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;