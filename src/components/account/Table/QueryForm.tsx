import React from "react";

const QueryForm = () => {
  return (
    <div className="p-4 md:p-6"> {/* Add some padding around the form */}
      <div className="mb-4 flex flex-wrap gap-2"> {/* Make radio buttons wrap on smaller screens */}
        <label className="inline-flex items-center mr-2">
          <input
            type="radio"
            className="form-radio text-orange-500 focus:ring-orange-500 h-5 w-5"
            name="queryType"
            value="Rec. Statement"
          />
          <span className="ml-2 text-gray-700 text-sm">Rec. Statement</span>
        </label>
        <label className="inline-flex items-center mr-2">
          <input
            type="radio"
            className="form-radio text-orange-500 focus:ring-orange-500 h-5 w-5"
            name="queryType"
            value="Bank Statement"
          />
          <span className="ml-2 text-gray-700 text-sm">Bank Statement</span>
        </label>
        <label className="inline-flex items-center mr-2">
          <input
            type="radio"
            className="form-radio text-orange-500 focus:ring-orange-500 h-5 w-5"
            name="queryType"
            value="Cash Book"
          />
          <span className="ml-2 text-gray-700 text-sm">Cash Book</span>
        </label>
        <label className="inline-flex items-center mr-2">
          <input
            type="radio"
            className="form-radio text-orange-500 focus:ring-orange-500 h-5 w-5"
            name="queryType"
            value="Trans Matched"
          />
          <span className="ml-2 text-gray-700 text-sm">Trans Matched</span>
        </label>
        <label className="inline-flex items-center mr-2">
          <input
            type="radio"
            className="form-radio text-orange-500 focus:ring-orange-500 h-5 w-5"
            name="queryType"
            value="Trash Bin"
          />
          <span className="ml-2 text-gray-700 text-sm">Trash Bin</span>
        </label>
      </div>

      <div className="max-h-[400px] overflow-y-auto"> {/* Added this container for scrollability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="recordNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Record Number
            </label>
            <input
              type="text"
              id="recordNumber"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          {/* ... other input fields ... */}
          <div>
            <label
              htmlFor="chequeNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Cheque Number
            </label>
            <input
              type="text"
              id="chequeNumber"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="tellerNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Teller Number
            </label>
            <input
              type="text"
              id="tellerNumber"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="chequeCash"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Transaction Status
            </label>
            <div className="relative">
              <select
                id="chequeCash"
                className="block appearance-none w-full bg-gray-100 border border-transparent hover:border-gray-400 py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 text-sm"
                onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
                onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
              >
                <option>Cheque/Cash</option>
                {/* Add more options here */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="transactionDescription"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Transaction Description
            </label>
            <input
              type="text"
              id="transactionDescription"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="transactionType"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Transaction Type
            </label>
            <div className="relative">
              <select
                id="transactionType"
                className="block appearance-none w-full bg-gray-100 border border-transparent hover:border-gray-400 py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 text-sm"
                onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
                onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
              >
                <option>NGN</option>
                {/* Add more options here */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="groupReport"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Group Report
            </label>
            <div className="relative">
              <select
                id="groupReport"
                className="block appearance-none w-full bg-gray-100 border border-transparent hover:border-gray-400 py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 text-sm"
                onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
                onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
              >
                <option>NGN</option>
                {/* Add more options here */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="transactionClass"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Transaction Class
            </label>
            <input
              type="text"
              id="transactionClass"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="entryDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Entry Date
            </label>
            <input
              type="date"
              id="entryDate"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="transactionDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Transaction Date
            </label>
            <input
              type="date"
              id="transactionDate"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="valueDate"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Value Date
            </label>
            <input
              type="date"
              id="valueDate"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="debit"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Debit
            </label>
            <input
              type="text"
              id="debit"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="credit"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Credit
            </label>
            <input
              type="text"
              id="credit"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
          <div>
            <label
              htmlFor="balance"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Balance
            </label>
            <input
              type="text"
              id="balance"
              className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 border-transparent text-sm"
              style={{ border: 'none' }}
              onFocus={(e) => e.target.classList.replace('border-transparent', 'border-orange-500')}
              onBlur={(e) => e.target.classList.replace('border-orange-500', 'border-transparent')}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-start">
        <button
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
          type="button"
        >
          Execute
        </button>
        <button
          className="bg-transparent hover:bg-gray-200 text-orange-500 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 border border-orange-500 text-sm"
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default QueryForm;