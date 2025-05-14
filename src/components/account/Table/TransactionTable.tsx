// components/tables/TransactionTable.tsx
import { Transaction } from "@/types/Transaction";
import React from "react";

interface TransactionTableProps {
    headers: string[];
    data: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ headers, data }) => {
    return (
        <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((transaction) => (
                            <tr key={transaction.sNo || transaction.no}>
                                {Object.values(transaction).map((value, index) => (
                                    <td
                                        key={`<span class="math-inline">\{transaction\.sNo \|\| transaction\.no\}\-</span>{index}`}
                                        className="px-3 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 text-sm text-gray-500">
                Showing 1 to {data.length} of {data.length} entries
            </div>
        </div>
    );
};

export default TransactionTable;