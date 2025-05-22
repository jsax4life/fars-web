import React from "react";

interface AnalysisTableProps {
  headers: string[];
  data: any[];
  title: string;
  showSummary?: boolean;
  summaryData?: any[];
  summaryTitle?: string;
}

const AnalysisTable: React.FC<AnalysisTableProps> = ({
  headers,
  data,
  title,
  showSummary = false,
  summaryData = [],
  summaryTitle = "",
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((cell: any, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-5 py-3 border-b border-gray-200 text-sm"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showSummary && summaryData && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3 text-gray-700">
            {summaryTitle}
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <table className="w-full">
              <tbody>
                {summaryData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-700">
                      {item.category}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisTable;