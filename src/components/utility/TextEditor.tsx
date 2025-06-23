import React, { useCallback, useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export type WordEditorProps = {
  onSave: (fileName: string, content: string) => void;
  onClose: () => void;
  user: any;
};

// Table Creation Modal Component
const CreateTableModal: React.FC<{
  onClose: () => void;
  onTableCreated: (html: string) => void;
}> = ({ onClose, onTableCreated }) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [tableData, setTableData] = useState<string[][]>(
    Array(2).fill(null).map(() => Array(2).fill(""))
  );

  useEffect(() => {
    // Initialize or resize tableData when rows/cols change
    const newTableData: string[][] = Array(rows)
      .fill(null)
      .map((_, rIdx) =>
        Array(cols)
          .fill(null)
          .map((_, cIdx) => tableData[rIdx]?.[cIdx] || "")
      );
    setTableData(newTableData);
  }, [rows, cols]);

  const handleAddRow = () => setRows((prev) => prev + 1);
  const handleAddCol = () => setCols((prev) => prev + 1);
  const handleRemoveRow = () => setRows((prev) => Math.max(1, prev - 1));
  const handleRemoveCol = () => setCols((prev) => Math.max(1, prev - 1));

  const handleCellChange = (rIdx: number, cIdx: number, value: string) => {
    const newData = [...tableData];
    newData[rIdx][cIdx] = value;
    setTableData(newData);
  };

  const handleInsert = () => {
    let tableHtml = `
      <table border="1" style="width:100%; color: #000; border-collapse: collapse; margin: 10px 0;">
        <thead>
          <tr>
    `;
    // Table Headers
    for (let i = 0; i < cols; i++) {
      tableHtml += `<th style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;">${tableData[0]?.[i] || `Header ${i + 1}`}</th>`;
    }
    tableHtml += `
          </tr>
        </thead>
        <tbody>
    `;
    // Table Rows (starting from second row for data)
    for (let r = 1; r < rows; r++) {
      tableHtml += `<tr>`;
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td style="padding: 8px; border: 1px solid #ddd;">${tableData[r]?.[c] || ''}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `
        </tbody>
      </table>
    `;
    onTableCreated(tableHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-black font-bold">Create Table</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4 mb-3">
            <label className="text-gray-700">Rows:</label>
            <input
              type="number"
              min="1"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-700"
            />
            <button onClick={handleAddRow} className="px-3 py-1 bg-gray-900 rounded text-sm">+ Row</button>
            <button onClick={handleRemoveRow} className="px-3 py-1 bg-red-500 rounded text-sm"> - Row</button>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-gray-700">Columns:</label>
            <input
              type="number"
              min="1"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-700"
            />
            <button onClick={handleAddCol} className="px-3 py-1 bg-gray-900 rounded text-sm">+ Col</button>
            <button onClick={handleRemoveCol} className="px-3 py-1 bg-red-500 rounded text-sm">- Col</button>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded">
            <thead>
              <tr>
                {Array.from({ length: cols }).map((_, cIdx) => (
                  <th key={cIdx} className="p-2 border border-gray-300 bg-gray-100 text-gray-700">
                    <input
                      type="text"
                      placeholder={`Header ${cIdx + 1}`}
                      value={tableData[0]?.[cIdx] || ''}
                      onChange={(e) => handleCellChange(0, cIdx, e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none text-center"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows - 1 }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {Array.from({ length: cols }).map((_, cIdx) => (
                    <td key={cIdx} className="p-2 border border-gray-300">
                      <input
                        type="text"
                        value={tableData[rIdx + 1]?.[cIdx] || ''}
                        onChange={(e) => handleCellChange(rIdx + 1, cIdx, e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-auto flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded text-gray-800">
            Cancel
          </button>
          <button onClick={handleInsert} className="px-4 py-2 bg-[#F36F2E] text-white rounded">
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
};

// Graph Creation Modal Component
const GraphCreationModal: React.FC<{
  onClose: () => void;
  onGraphCreated: (svg: string) => void;
}> = ({ onClose, onGraphCreated }) => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 200 },
    { name: 'Category D', value: 278 },
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [chartType, setChartType] = useState<'Bar' | 'Line'>('Bar');
  const chartRef = useRef<HTMLDivElement>(null);

  const handleAddDataPoint = () => {
    if (newLabel && newValue && !isNaN(Number(newValue))) {
      setChartData([...chartData, { name: newLabel, value: Number(newValue) }]);
      setNewLabel('');
      setNewValue('');
    }
  };

  const handleDeleteDataPoint = (index: number) => {
    const updatedData = chartData.filter((_, i) => i !== index);
    setChartData(updatedData);
  };

  const handleInsertGraph = () => {
    if (chartRef.current) {
      // Find the SVG element within the chartRef
      const svgElement = chartRef.current.querySelector('svg');
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        onGraphCreated(svgString);
        onClose();
      } else {
        console.error("SVG element not found in chart container.");
        // Fallback or error message if SVG is not found
        onGraphCreated('<div style="border: 1px dashed #ccc; padding: 20px; color: #000; text-align: center; margin: 10px 0;">[Error: Could not generate graph SVG. Please try again.]</div>');
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl text-black font-bold">Create Graph from Data</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 flex-1">
          {/* Data Input Section */}
          <div className="border border-gray-300 rounded p-4 flex flex-col">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Data Input</h4>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-gray-700"
              />
              <input
                type="number"
                placeholder="Value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded text-gray-700"
              />
              <button onClick={handleAddDataPoint} className="px-3 py-2 bg-gray-900 rounded text-sm text-white">Add</button>
            </div>
            <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-2">
              {chartData.length === 0 ? (
                <p className="text-gray-500 text-sm">No data points added yet.</p>
              ) : (
                <ul className="list-disc list-inside text-gray-700">
                  {chartData.map((point, index) => (
                    <li key={index} className="flex justify-between items-center py-1">
                      <span>{point.name}: {point.value}</span>
                      <button
                        onClick={() => handleDeleteDataPoint(index)}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Chart Preview Section */}
          <div className="border border-gray-300 rounded p-4 flex flex-col">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Chart Preview</h4>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="chartType"
                  value="Bar"
                  checked={chartType === 'Bar'}
                  onChange={() => setChartType('Bar')}
                  className="mr-1"
                /> Bar Chart
              </label>
              <label className="flex items-center text-gray-700">
                <input
                  type="radio"
                  name="chartType"
                  value="Line"
                  checked={chartType === 'Line'}
                  onChange={() => setChartType('Line')}
                  className="mr-1"
                /> Line Chart
              </label>
            </div>
            <div ref={chartRef} className="flex-1 w-full h-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'Bar' ? (
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded text-gray-800">
            Cancel
          </button>
          <button onClick={handleInsertGraph} className="px-4 py-2 bg-[#F36F2E] text-white rounded">
            Insert Graph
          </button>
        </div>
      </div>
    </div>
  );
};


const WordEditor: React.FC<WordEditorProps> = ({ onSave, onClose, user }) => {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState(`report_${user.firstName}_${user.lastName}.docx`);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [showGraphCreationModal, setShowGraphCreationModal] = useState(false);

  // Initialize editor with empty content
  useEffect(() => {
    if (editorRef.current && !content) {
      editorRef.current.innerHTML = "<p><br></p>";
    }
  }, []);

  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  };

  const insertAtCursor = (html: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const div = document.createElement('div');
      div.innerHTML = html;
      const frag = document.createDocumentFragment();
      
      while (div.firstChild) {
        frag.appendChild(div.firstChild);
      }
      
      range.insertNode(frag);
      
      // Move cursor to end of inserted content
      if (frag.lastChild) {
        range.setStartAfter(frag.lastChild);
        range.setEndAfter(frag.lastChild);
      } else {
        range.collapse(false); // Collapse to end if no content inserted
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Update content state
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    } else if (editorRef.current) {
      // Fallback if no selection, append to end
      editorRef.current.innerHTML += html;
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        insertAtCursor(`<img src="${imageUrl}" alt="Uploaded Image" width="400" style="max-width:100%; height:auto;" /><br/>`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertTable = () => {
    setShowCreateTableModal(true);
  };

  const handleInsertGraph = () => {
    setShowGraphCreationModal(true);
  };

  const handleSave = () => {
    const currentContent = editorRef.current?.innerHTML || content;
    const fullContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.6; margin: 20px; color: #333; }
          h1, h2, h3, h4 { color: #2c3e50; margin-top: 1.5em; margin-bottom: 0.5em; }
          .header { margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .client-info { margin-bottom: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #f0f0f0; }
          img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          th, td { padding: 12px 15px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          ul { margin: 10px 0; padding-left: 25px; }
          li { margin-bottom: 5px; }
          p { margin-bottom: 10px; }
          svg { max-width: 100%; height: auto; } /* Ensure SVG responsiveness */
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="header">
          <h1>Client Report: ${user.firstName} ${user.lastName}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="client-info">
          <h2>Client Details</h2>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Company:</strong> ${user.companyName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone}</p>
          <p><strong>Address:</strong> ${user.address}, ${user.city}, ${user.state}, ${user.country}</p>
        </div>

        <div class="report-content">
          ${currentContent || "<p>No report content added yet.</p>"}
        </div>
      </body>
      </html>
    `;

    onSave(fileName, fullContent);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl h-4/5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-black font-bold">
            Create Report for {user.firstName} {user.lastName}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => insertAtCursor('<h2 style="margin: 16px 0 8px; color: #000;">Section Heading</h2><p style="margin: 8px 0; color: #000;">Content goes here...</p>')}
            className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors duration-200"
          >
            Add Section
          </button>
          <button 
            onClick={handleImageUpload} 
            className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors duration-200"
          >
            Insert Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button 
            onClick={handleInsertTable}
            className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors duration-200"
          >
            Insert Table
          </button>
          <button 
            onClick={handleInsertGraph}
            className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors duration-200"
          >
            Insert Graph
          </button>
          <button
            onClick={() => insertAtCursor('<ul style="margin: 8px 0; padding-left: 20px; color: #000;"><li style="margin: 4px 0;">List item 1</li><li style="margin: 4px 0;">List item 2</li></ul>')}
            className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 transition-colors duration-200"
          >
            Add List
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleContentInput}
          className="flex-1 border border-gray-300 rounded-md p-4 overflow-auto prose max-w-none text-black focus:ring-blue-500 focus:border-blue-500"
          style={{ minHeight: "200px" }}
          suppressContentEditableWarning={true}
          data-placeholder="Start building your report using the buttons above or type directly here..."
        />

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#F36F2E] text-white rounded-md hover:bg-[#e0652a] transition-colors duration-200">
            Save Report
          </button>
        </div>
      </div>

      {showCreateTableModal && (
        <CreateTableModal
          onClose={() => setShowCreateTableModal(false)}
          onTableCreated={(html) => {
            insertAtCursor(html);
            setShowCreateTableModal(false);
          }}
        />
      )}

      {showGraphCreationModal && (
        <GraphCreationModal
          onClose={() => setShowGraphCreationModal(false)}
          onGraphCreated={(svg) => {
            insertAtCursor(svg);
            setShowGraphCreationModal(false);
          }}
        />
      )}
    </div>
  );
};

export default WordEditor;
