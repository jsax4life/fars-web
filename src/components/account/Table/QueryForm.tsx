import React from "react";

const QueryForm = () => {
  return (
    <div className="p-4 md:p-6 max-h-[500px] overflow-y-scroll">
      <div className="mb-4 flex flex-wrap gap-2">
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
       
      </div>

      <div className="max-h-[900px]  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
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
            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
            style={{ border: "none" }}
            onFocus={(e) =>
              e.target.classList.replace("border-transparent", "border-orange-500")
            }
            onBlur={(e) =>
              e.target.classList.replace("border-orange-500", "border-transparent")
            }
          />
        </div>
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
            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
            style={{ border: "none" }}
            onFocus={(e) =>
              e.target.classList.replace("border-transparent", "border-orange-500")
            }
            onBlur={(e) =>
              e.target.classList.replace("border-orange-500", "border-transparent")
            }
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
            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
            style={{ border: "none" }}
            onFocus={(e) =>
              e.target.classList.replace("border-transparent", "border-orange-500")
            }
            onBlur={(e) =>
              e.target.classList.replace("border-orange-500", "border-transparent")
            }
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
            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
            style={{ border: "none" }}
            onFocus={(e) =>
              e.target.classList.replace("border-transparent", "border-orange-500")
            }
            onBlur={(e) =>
              e.target.classList.replace("border-orange-500", "border-transparent")
            }
          />
        </div>
        <div>
          <label
            htmlFor="transStatus"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Transaction Status
          </label>
          <div className="relative">
            <select
              id="transStatus"
              className="block appearance-none w-full bg-gray-100 text-gray-700 border border-transparent hover:border-gray-400 py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 text-sm"
              onFocus={(e) =>
                e.target.classList.replace("border-transparent", "border-orange-500")
              }
              onBlur={(e) =>
                e.target.classList.replace("border-orange-500", "border-transparent")
              }
            >
              <option>Credit</option>
              <option>Debit</option>
              <option>Returned</option>
              <option>Reversed</option>
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
            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
            style={{ border: "none" }}
            onFocus={(e) =>
              e.target.classList.replace("border-transparent", "border-orange-500")
            }
            onBlur={(e) =>
              e.target.classList.replace("border-orange-500", "border-transparent")
            }
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
              className="block appearance-none w-full bg-gray-100 text-gray-700 border border-transparent hover:border-gray-400 py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 text-sm"
              onFocus={(e) =>
                e.target.classList.replace("border-transparent", "border-orange-500")
              }
              onBlur={(e) =>
                e.target.classList.replace("border-orange-500", "border-transparent")
              }
            >
              <option>Cash/Cheque</option>
              <option>Local</option>
              <option>Intra-state</option>
              <option>Up-country</option>
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
              className="block appearance-none w-full bg-gray-100 text-gray-700 border border-transparent hover:border-gray-400 py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 text-sm"
              onFocus={(e) =>
                e.target.classList.replace("border-transparent", "border-orange-500")
              }
              onBlur={(e) =>
                e.target.classList.replace("border-orange-500", "border-transparent")
              }
            >
              <option>balance</option>
              <option>cheque no.</option>
              <option>clearance</option>
              <option>clr</option>
              <option>conf</option>
              <option>credit</option>
              <option>curr</option>
              <option>debit</option>
              <option>entry date</option>
              <option>exch rate</option>
              <option>orginal value</option>
              <option>teller no.</option>
              <option>trans. date</option>
              <option>trans. type</option>
              <option>transaction description</option>
              <option>value date</option>
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
            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
            style={{ border: "none" }}
            onFocus={(e) =>
              e.target.classList.replace("border-transparent", "border-orange-500")
            }
            onBlur={(e) =>
              e.target.classList.replace("border-orange-500", "border-transparent")
            }
          />
        </div>

        <div className="col-span-full md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Entry Date
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="entryDateFrom"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                From
              </label>
              <input
                type="date"
                id="entryDateFrom"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
            <div>
              <label
                htmlFor="entryDateTo"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                To
              </label>
              <input
                type="date"
                id="entryDateTo"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Transaction Date
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="transactionDateFrom"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                From
              </label>
              <input
                type="date"
                id="transactionDateFrom"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }/>
            </div>
            <div>
              <label
                htmlFor="transactionDateTo"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                To
              </label>
              <input
                type="date"
                id="transactionDateTo"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Value Date
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="valueDateFrom"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                From
              </label>
              <input
                type="date"
                id="valueDateFrom"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
            <div>
              <label
                htmlFor="valueDateTo"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                To
              </label>
              <input
                type="date"
                id="valueDateTo"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Credit
          </label>
         <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="accountDateFrom"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                From
              </label>
              <input
                type="date"
                id="accountDateFrom"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
            <div>
              <label
                htmlFor="accountDateTo"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                To
              </label>
              <input
                type="date"
                id="accountDateTo"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Debit
          </label>
         <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="accountDateFrom"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                From
              </label>
              <input
                type="date"
                id="accountDateFrom"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
            <div>
              <label
                htmlFor="accountDateTo"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                To
              </label>
              <input
                type="date"
                id="accountDateTo"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Account Date
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="accountDateFrom"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                From
              </label>
              <input
                type="date"
                id="accountDateFrom"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
            <div>
              <label
                htmlFor="accountDateTo"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                To
              </label>
              <input
                type="date"
                id="accountDateTo"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Account Time
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="accountTimeFrom"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                From
              </label>
              <input
                type="time"
                id="accountTimeFrom"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
            <div>
              <label
                htmlFor="accountTimeTo"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                To
              </label>
              <input
                type="time"
                id="accountTimeTo"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
          </div>
        </div>

        <div className="col-span-full md:col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Balance
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="accountDateFrom"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                From
              </label>
              <input
                type="date"
                id="accountDateFrom"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
            <div>
              <label
                htmlFor="accountDateTo"
                className="block text-gray-700 text-xs font-bold mb-1"
              >
                To
              </label>
              <input
                type="date"
                id="accountDateTo"
                className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 bg-gray-100 text-gray-700 border-transparent text-sm"
                style={{ border: "none" }}
                onFocus={(e) =>
                  e.target.classList.replace("border-transparent", "border-orange-500")
                }
                onBlur={(e) =>
                  e.target.classList.replace("border-orange-500", "border-transparent")
                }
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmed"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Confirmed
          </label>
          <div className="relative">
            <select
              id="confirmed"
              className="block appearance-none w-full bg-gray-100 text-gray-700 border border-transparent hover:border-gray-400 py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 text-sm"
              onFocus={(e) =>
                e.target.classList.replace("border-transparent", "border-orange-500")
              }
              onBlur={(e) =>
                e.target.classList.replace("border-orange-500", "border-transparent")
              }
            >
              <option>Confirmed</option>
              <option>Unconfirmed</option>
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
            htmlFor="cleared"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cleared
          </label>
          <div className="relative">
            <select
              id="cleared"
              className="block appearance-none w-full bg-gray-100 text-gray-700 border border-transparent hover:border-gray-400 py-2 px-4 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 text-sm"
              onFocus={(e) =>
                e.target.classList.replace("border-transparent", "border-orange-500")
              }
              onBlur={(e) =>
                e.target.classList.replace("border-orange-500", "border-transparent")
              }
            >
              <option>Cleared</option>
              <option>Uncleared</option>
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