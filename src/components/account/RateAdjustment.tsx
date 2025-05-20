import { X } from 'lucide-react'; // Assuming you have lucide-react for the X icon
interface ModalFormData {
    fromDate: string; // Added From Date
    toDate: string; // Added To Date
    localCheques: string;
    intraStateCheques: string;
    upCountryCheques: string;
    setAsPrevailingDays: boolean;
    setParametersAsPrevailing: boolean;
    camfFrequency: string;
    camfOnShortfall: string;
    camfCoverRate: string;
    camfOCRate: string;
    turnoverLimit: string;
    currencyDescription: string;
    rate: string;
    retChgRate: string;
    retChgLimit: string;
    overdraftLimit: string;
    drRate: string;
    exRate: string;
    exChargeType: string;
    creditInterestRate: string;
    whtRate: string;
}

// Assuming these are props or state variables in your component
interface RateAdjustmentFormProps {
    setShowModal: (show: boolean) => void;
    modalFormData: ModalFormData;
    handleModalChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSelectChange: (name: keyof ModalFormData, value: string) => void;
    handleSave: () => void;
}

const RateAdjustmentForm: React.FC<RateAdjustmentFormProps> = ({
    setShowModal,
    modalFormData,
    handleModalChange,
    handleSelectChange,
    handleSave,
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Rate Adjustment Form</h3>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>

                    <div className="mt-4 space-y-6">
                        {/* From and To Date Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                                <input
                                    type="date"
                                    id="fromDate"
                                    name="fromDate"
                                    value={modalFormData.fromDate}
                                    onChange={handleModalChange}
                                    className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                                <input
                                    type="date"
                                    id="toDate"
                                    name="toDate"
                                    value={modalFormData.toDate}
                                    onChange={handleModalChange}
                                    className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Currency Section */}
                        <div>
                            <h4 className="text-lg font-medium mb-4 text-gray-700">Currency</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency Description</label>
                                    <select
                                        name="currencyDescription"
                                        value={modalFormData.currencyDescription}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    >
                                        <option value="">Select description</option>
                                        <option value="USD">US Dollar</option>
                                        <option value="EUR">Euro</option>
                                        <option value="GBP">British Pound</option>
                                        {/* Add more currency options as needed */}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                                    <input
                                        type="text"
                                        name="rate"
                                        value={modalFormData.rate}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ret. Chg. Rate</label>
                                    <input
                                        type="text"
                                        name="retChgRate"
                                        value={modalFormData.retChgRate}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ret. Chg. Limit</label>
                                    <input
                                        type="text"
                                        name="retChgLimit"
                                        value={modalFormData.retChgLimit}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Overdraft Section */}
                        <div>
                            <h4 className="text-lg font-medium mb-4 text-gray-700">Overdraft</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Overdraft Limit</label>
                                    <input
                                        type="text"
                                        name="overdraftLimit"
                                        value={modalFormData.overdraftLimit}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dr. Rate</label>
                                    <input
                                        type="text"
                                        name="drRate"
                                        value={modalFormData.drRate}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ex. Rate</label>
                                    <input
                                        type="text"
                                        name="exRate"
                                        value={modalFormData.exRate}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ex. Charge Type</label>
                                    <input
                                        type="text"
                                        name="exChargeType"
                                        value={modalFormData.exChargeType}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Credit Interest/Cash Cover/Cash Collateral Section */}
                        <div>
                            <h4 className="text-lg font-medium mb-4 text-gray-700">Credit Interest/Cash Cover/Cash Collateral</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Credit Interest Rate</label>
                                    <input
                                        type="text"
                                        name="creditInterestRate"
                                        value={modalFormData.creditInterestRate}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WHT Rate</label>
                                    <input
                                        type="text"
                                        name="whtRate"
                                        value={modalFormData.whtRate}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Existing Cheque Clearing Days Section */}
                        <div>
                            <h4 className="text-lg text-gray-700 font-medium mb-4">Cheque Clearing Days</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Local cheques</label>
                                    <input
                                        type="text"
                                        name="localCheques"
                                        value={modalFormData.localCheques}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Intra-state cheques</label>
                                    <input
                                        type="text"
                                        name="intraStateCheques"
                                        value={modalFormData.intraStateCheques}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Up-country cheques</label>
                                    <input
                                        type="text"
                                        name="upCountryCheques"
                                        value={modalFormData.upCountryCheques}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="setAsPrevailingDays"
                                        name="setAsPrevailingDays"
                                        checked={modalFormData.setAsPrevailingDays}
                                        onChange={handleModalChange}
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 text-gray-700  rounded mr-2"
                                    />
                                    <label htmlFor="setAsPrevailingDays" className="text-sm font-medium text-gray-700">
                                        Set as prevailing clearing days
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="setParametersAsPrevailing"
                                        name="setParametersAsPrevailing"
                                        checked={modalFormData.setParametersAsPrevailing}
                                        onChange={handleModalChange}
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 text-gray-700  rounded mr-2"
                                    />
                                    <label htmlFor="setParametersAsPrevailing" className="text-sm font-medium text-gray-700">
                                        Set parameters as prevailing account parameters
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Existing CAMF Section */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-700 mb-4">CAMF</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CAMF frequency</label>
                                    <select
                                        onChange={(e) => handleSelectChange('camfFrequency', e.target.value)}
                                        value={modalFormData.camfFrequency}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    >
                                        <option value="">Select frequency</option>
                                        <option value="daily">Daily</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CAMF on shortfall</label>
                                    <select
                                        onChange={(e) => handleSelectChange('camfOnShortfall', e.target.value)}
                                        value={modalFormData.camfOnShortfall}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    >
                                        <option value="">Select option</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CAMF cover rate</label>
                                    <input
                                        type="text"
                                        name="camfCoverRate"
                                        value={modalFormData.camfCoverRate}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CAMF O/C rate</label>
                                    <input
                                        type="text"
                                        name="camfOCRate"
                                        value={modalFormData.camfOCRate}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Turnover limit</label>
                                    <input
                                        type="text"
                                        name="turnoverLimit"
                                        value={modalFormData.turnoverLimit}
                                        onChange={handleModalChange}
                                        className="w-full border border-gray-300 text-gray-700  rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700  rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RateAdjustmentForm;