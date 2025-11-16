const Endpoints = {
    login: '/api/auth/login',
    register: '/auth/sign-up',
    verify: '/auth/verify-account',
    requestOtp: '/auth/resend-otp',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    resetPin: '/auth/reset-pin',
    logout: '/api/auth/logout',
    verifyPin: '/account/verify-pin/',
    updateAccount: '/api/users/',
    createuser: '/api/users',
    profile: '/api/auth/profile',
    account: '/account',
    users: '/api/users',
    deactivateUser: '/api/users/deactivate/',
    activateUser: '/api/users/activate/',
    checkEmail: '/api/users/check-email',
    checkUsername: '/api/users/check-username',

    // Added Client Endpoints
    createClient: '/api/clients',
    getAllClients: '/api/clients',
    getClientById: '/api/clients/',
    updateClientById: '/api/clients/',
    deleteClientById: '/api/clients/',

    // Classification Endpoints
    createClassification: '/api/classifications',
    getAllClassifications: '/api/classifications',
    getClassificationById: '/api/classifications/',
    updateClassificationById: '/api/classifications/',
    deleteClassificationById: '/api/classifications/',

    // Bank Account Endpoints
    createBankAccount: '/api/bank-accounts',
    getAllBankAccounts: '/api/bank-accounts',
    getClientBankAccounts: '/api/bank-accounts/client/',
    getBankAccountById: '/api/bank-accounts/',
    updateBankAccountById: '/api/bank-accounts/',
    deleteBankAccountById: '/api/bank-accounts/',
    assignRateToAccount: '/api/bank-accounts/assign-rate/',

  // Rates Endpoints
  getAllRates: '/api/rates',
  getRateById: '/api/rates/',
  createRate: '/api/rates',
  deleteRate: '/api/rates/',
  uploadRateDocument: '/api/rates/document',
  getRateDocuments: '/api/rates/',
  getAllContractDocuments: '/api/rates/documents',
  getDocumentById: '/api/rates/document/',
  updateRateDocument: '/api/rates/document/',
  deleteRateDocument: '/api/rates/document/',
  getRatesByClientId: '/api/rates/client/',

    //Bank Endpoints
    createBank: '/api/banks',
    getAllBanks: '/api/banks',
    getBankById: '/api/banks/',
    updateBankById: '/api/banks/',
    deleteBankById: '/api/banks/',

    // Staff Assignment Endpoints
    getStaffAssignmentsByAccount: '/api/staff-assignments/bank-account/',
    getStaffAssignmentsByStaff: '/api/staff-assignments/staff/',
    createStaffAssignment: '/api/staff-assignments',
    deleteStaffAssignment: '/api/staff-assignments/',

    // Classification Pattern Endpoints
    createClassificationPattern: '/api/classification-patterns',
    getAllClassificationPatterns: '/api/classification-patterns',
    getClassificationPatternById: '/api/classification-patterns/',
    updateClassificationPatternById: '/api/classification-patterns/',
    deleteClassificationPatternById: '/api/classification-patterns/',

    // Reversal Keyword Endpoints
    createReversalKeyword: '/api/reversal-keywords',
    getAllReversalKeywords: '/api/reversal-keywords',
    getReversalKeywordById: '/api/reversal-keywords/',
    updateReversalKeywordById: '/api/reversal-keywords/',
    deleteReversalKeywordById: '/api/reversal-keywords/',
};

export default Endpoints;