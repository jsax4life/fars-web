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
};

export default Endpoints;