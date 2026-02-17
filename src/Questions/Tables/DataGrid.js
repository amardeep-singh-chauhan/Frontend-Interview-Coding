import React, { useState, useMemo, useEffect } from "react";

const sampleData = Array.from({ length: 42 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@mail.com`,
  role: i % 2 === 0 ? "Admin" : "User",
  salary: Math.floor(Math.random() * 80000) + 20000
}));

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "salary", label: "Salary" }
];

export default function DataGrid() {
  const [data, setData] = useState(sampleData);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map(c => c.key)
  );

  /* ---------------- SEARCH ---------------- */
  const filteredData = useMemo(() => {
    return data.filter(row =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  /* ---------------- SORT ---------------- */
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (!isNaN(aVal) && !isNaN(bVal)) {
        return sortConfig.direction === "asc"
          ? aVal - bVal
          : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: "base" })
        : String(bVal).localeCompare(String(aVal), undefined, { numeric: true, sensitivity: "base" });
    });

    return sorted;
  }, [filteredData, sortConfig]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  /* ---------------- HANDLERS ---------------- */

  const handleSort = key => {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: "asc" });
    } else if (sortConfig.direction === "asc") {
      setSortConfig({ key, direction: "desc" });
    } else {
      setSortConfig(null);
    }
  };

  const toggleRowSelect = id => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(i => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const deleteRow = id => {
    if (!window.confirm("Delete this row?")) return;
    setData(data.filter(row => row.id !== id));
    setSelectedRows(selectedRows.filter(i => i !== id));
  };

  const deleteSelected = () => {
    if (!window.confirm("Delete selected rows?")) return;
    setData(data.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  const startEdit = row => {
    setEditingId(row.id);
    setEditData(row);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (!editData.name.trim()) {
        alert("Name is required");
        return;
    }

    if (!/\S+@\S+\.\S+/.test(editData.email)) {
        alert("Invalid email");
        return;
    }

    // ✅ Coerce salary back to number after editing
    const normalizedEdit = {
        ...editData,
        salary: Number(editData.salary) || 0,
    };

    setData(data.map(row => row.id === editingId ? normalizedEdit : row));
    cancelEdit();
  };

  const toggleColumn = key => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter(k => k !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={{ padding: 20 }}>
      <h2>Simple Data Grid</h2>

      {/* Search */}
      <input
        placeholder="Search..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{ marginBottom: 10 }}
      />

      <button
        onClick={deleteSelected}
        disabled={!selectedRows.length}
        style={{ marginLeft: 10 }}
      >
        Delete Selected
      </button>

      {/* Column Toggle */}
      <div style={{ margin: "10px 0" }}>
        {columns.map(col => (
          <label key={col.key} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={visibleColumns.includes(col.key)}
              onChange={() => toggleColumn(col.key)}
            />
            {col.label}
          </label>
        ))}
      </div>

      {/* Table */}
      <div style={{ maxHeight: 300, overflow: "auto" }}>
        <table border="1" width="100%">
          <thead style={{ position: "sticky", top: 0, background: "#f0f0f0" }}>
            <tr>
              <th>Select</th>
              {columns
                .filter(col => visibleColumns.includes(col.key))
                .map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{ cursor: "pointer" }}
                  >
                    {col.label}
                    {sortConfig?.key === col.key
                      ? sortConfig.direction === "asc"
                        ? " 🔼"
                        : " 🔽"
                      : ""}
                  </th>
                ))}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map(row => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleRowSelect(row.id)}
                  />
                </td>

                {columns
                  .filter(col => visibleColumns.includes(col.key))
                  .map(col => (
                    <td key={col.key}>
                      {editingId === row.id ? (
                        <input
                          value={editData[col.key]}
                          onChange={e =>
                            setEditData({
                              ...editData,
                              [col.key]: e.target.value
                            })
                          }
                        />
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}

                <td>
                  {editingId === row.id ? (
                    <>
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(row)}>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRow(row.id)}
                        style={{ marginLeft: 5 }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div style={{ marginTop: 15 }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? "bold" : "normal"
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>

        {/* Page size near pagination */}
        <span style={{ marginLeft: 20 }}>
          Rows per page:
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{ marginLeft: 5 }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </span>
      </div>
    </div>
  );
}