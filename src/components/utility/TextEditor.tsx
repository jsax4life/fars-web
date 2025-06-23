import React, { useCallback, useEffect, useRef, useState } from "react";


export type WordEditorProps = {
  onSave: (fileName: string, content: string) => void;
  onClose: () => void;
  user: any;
};
const WordEditor: React.FC<WordEditorProps> = ({ onSave, onClose, user  }) => {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState(`report_${user.firstName}_${user.lastName}.docx`);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

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
      range.setStartAfter(frag.lastChild || frag);
      range.setEndAfter(frag.lastChild || frag);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Update content state
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
    } else if (editorRef.current) {
      // Fallback if no selection
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
        insertAtCursor(`<img src="${imageUrl}" alt="Uploaded Image" width="400" /><br/>`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertTable = () => {
    const table = `
      <table border="1" style="width:100%; color: #000; border-collapse: collapse; margin: 10px 0;">
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd;">Header 1</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Header 2</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Data 1</td>
          <td style="padding: 8px; border: 1px solid #ddd;">Data 2</td>
        </tr>
      </table>
    `;
    insertAtCursor(table);
  };

  const handleInsertGraph = () => {
    const graphPlaceholder = `
      <div style="border: 1px dashed #ccc; padding: 20px; color: #000; text-align: center; margin: 10px 0;">
        [Graph Placeholder - Would display chart in a real implementation]
      </div>
    `;
    insertAtCursor(graphPlaceholder);
  };

  const handleSave = () => {
    const currentContent = editorRef.current?.innerHTML || content;
    const fullContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
          h1 { color: #2c3e50; }
          .header { margin-bottom: 30px; }
          .client-info { margin-bottom: 20px; }
          img { max-width: 100%; height: auto; }
          table { margin: 10px 0; }
        </style>
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
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-4/5 h-4/5 flex flex-col">
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
            className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-md"
          />
        </div>

       
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => insertAtCursor('<h2 style="margin: 16px 0 8px; color: #000;">Section Heading</h2><p style="margin: 8px 0; color: #000;">Content goes here...</p>')}
            className="px-3 py-1 bg-gray-900 rounded text-sm"
          >
            Add Section
          </button>
          <button 
            onClick={handleImageUpload} 
            className="px-3 py-1 bg-gray-900 rounded text-sm"
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
            className="px-3 py-1 bg-gray-900 rounded text-sm"
          >
            Insert Table
          </button>
          <button 
            onClick={handleInsertGraph}
            className="px-3 py-1 bg-gray-900 rounded text-sm"
          >
            Insert Graph
          </button>
          <button
            onClick={() => insertAtCursor('<ul style="margin: 8px 0; padding-left: 20px; color: #000;"><li style="margin: 4px 0;">List item 1</li><li style="margin: 4px 0;">List item 2</li></ul>')}
            className="px-3 py-1 bg-gray-900 rounded text-sm"
          >
            Add List
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleContentInput}
          className="flex-1 border border-gray-300 rounded p-4 overflow-auto prose max-w-none text-black"
          style={{ minHeight: "200px" }}
          suppressContentEditableWarning={true}
          data-placeholder="Start building your report using the buttons above or type directly here..."
        />

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-[#000] rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#F36F2E] text-white rounded">
            Save Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordEditor