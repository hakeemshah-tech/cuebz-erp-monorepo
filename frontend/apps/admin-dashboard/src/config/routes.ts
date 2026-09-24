export const routesSuperAdmin = {
  subscriptions: {
    subscriptionsList: "/dashboard/subscriptions",
    editSubscription: (id: string) => `/dashboard/subscriptions/${id}/edit`,
    createSubscription: `/dashboard/subscriptions/create`,
  },
  tenants: {
    tenantsList: "/dashboard/tenants",
    editTenant: (id: string) => `/dashboard/tenants/${id}/edit`,
    createTenant: `/dashboard/tenants/create`,
  },
  subscriptionOrders: {
    ordersList: "/dashboard/subscription-orders",
    // editTenant: (id: string) => `/dashboard/tenants/${id}/edit`,
    // createTenant: `/dashboard/tenants/create`,
  },

  newUpdates: {
    newsUpdateList: "/dashboard/newsUpdates",
  },

  eCommerce: {
    dashboard: "/ecommerce",
    products: "/ecommerce/products",
    createProduct: "/ecommerce/products/create",
    productDetails: (slug: string) => `/ecommerce/products/${slug}`,
    ediProduct: (slug: string) => `/ecommerce/products/${slug}/edit`,
    categories: "/ecommerce/categories",
    createCategory: "/ecommerce/categories/create",
    editCategory: (id: string) => `/ecommerce/categories/${id}/edit`,
    orders: "/ecommerce/orders",
    createOrder: "/ecommerce/orders/create",
    orderDetails: (id: string) => `/ecommerce/orders/${id}`,
    editOrder: (id: string) => `/ecommerce/orders/${id}/edit`,
    reviews: "/ecommerce/reviews",
    shop: "/ecommerce/shop",
    cart: "/ecommerce/cart",
    checkout: "/ecommerce/checkout",
    trackingId: (id: string) => `/ecommerce/tracking/${id}`,
  },
  searchAndFilter: {
    realEstate: "/search/real-estate",
    nft: "/search/nft",
    flight: "/search/flight",
  },
  support: {
    dashboard: "/support",
    inbox: "/support/inbox",
    supportCategory: (category: string) => `/support/inbox/${category}`,
    messageDetails: (id: string) => `/support/inbox/${id}`,
    snippets: "/support/snippets",
    createSnippet: "/support/snippets/create",
    viewSnippet: (id: string) => `/support/snippets/${id}`,
    editSnippet: (id: string) => `/support/snippets/${id}/edit`,
    templates: "/support/templates",
    createTemplate: "/support/templates/create",
    viewTemplate: (id: string) => `/support/templates/${id}`,
    editTemplate: (id: string) => `/support/templates/${id}/edit`,
  },
  logistics: {
    dashboard: "/logistics",
    shipmentList: "/logistics/shipments",
    customerProfile: "/logistics/customer-profile",
    createShipment: "/logistics/shipments/create",
    editShipment: (id: string) => `/logistics/shipments/${id}/edit`,
    shipmentDetails: (id: string) => `/logistics/shipments/${id}`,
    tracking: (id: string) => `/logistics/tracking/${id}`,
  },
  appointment: {
    dashboard: "/appointment",
    appointmentList: "/appointment/list",
  },
  executive: {
    dashboard: "/executive",
  },
  jobBoard: {
    dashboard: "/job-board",
    jobFeed: "/job-board/feed",
  },
  analytics: "/analytics",
  financial: {
    dashboard: "/financial",
  },
  file: {
    dashboard: "/file",
    manager: "/file-manager",
    upload: "/file-manager/upload",
    create: "/file-manager/create",
  },
  pos: {
    index: "/point-of-sale",
  },
  eventCalendar: "/event-calendar",
  rolesPermissions: "/roles-permissions",
  invoice: {
    home: "/invoice",
    create: "/invoice/create",
    details: (id: string) => `/invoice/${id}`,
    edit: (id: string) => `/invoice/${id}/edit`,
    builder: "/invoice/builder",
  },
  widgets: {
    cards: "/widgets/cards",
    icons: "/widgets/icons",
    charts: "/widgets/charts",
    maps: "/widgets/maps",
    banners: "/widgets/banners",
  },
  tables: {
    basic: "/tables/basic",
    collapsible: "/tables/collapsible",
    enhanced: "/tables/enhanced",
    pagination: "/tables/pagination",
    search: "/tables/search",
    stickyHeader: "/tables/sticky-header",
    tanTable: "/tables/tan-table",
    tanTableResizable: "/tables/tan-table-resizable",
    tanTableDnD: "/tables/tan-table-dnd",
    tanTablePinning: "/tables/tan-table-pinning",
    tanTableEnhanced: "/tables/tan-table-enhanced",
    tanTableCollapsible: "/tables/tan-table-collapsible",
  },
  multiStep: "/multi-step",
  forms: {
    profileSettings: "/forms/profile-settings",
    notificationPreference: "/forms/profile-settings/notification",
    personalInformation: "/forms/profile-settings/profile",
    newsletter: "/forms/newsletter",
  },
  emailTemplates: "/email-templates",
  profile: "/profile",
  welcome: "/welcome",
  comingSoon: "/coming-soon",
  accessDenied: "/access-denied",
  notFound: "/not-found",
  maintenance: "/maintenance",
  blank: "/blank",
  auth: {
    signUp1: "/auth/sign-up-1",
    signUp2: "/auth/sign-up-2",
    signUp3: "/auth/sign-up-3",
    signUp4: "/auth/sign-up-4",
    signUp5: "/auth/sign-up-5",
    // sign in
    signIn1: "/auth/sign-in-1",
    signIn2: "/auth/sign-in-2",
    signIn3: "/auth/sign-in-3",
    signIn4: "/auth/sign-in-4",
    signIn5: "/auth/sign-in-5",
    // forgot password
    forgotPassword1: "/auth/forgot-password-1",
    forgotPassword2: "/auth/forgot-password-2",
    forgotPassword3: "/auth/forgot-password-3",
    forgotPassword4: "/auth/forgot-password-4",
    forgotPassword5: "/auth/forgot-password-5",
    // OTP
    otp1: "/auth/otp-1",
    otp2: "/auth/otp-2",
    otp3: "/auth/otp-3",
    otp4: "/auth/otp-4",
    otp5: "/auth/otp-5",
  },
  signIn: "/signin",
};

export const routesTenant = {
  reception: {
    // Visitor Log
    visitorLogList: "/tenant/reception/visitor-log",
    editVisitorLog: (id: string) => `/tenant/reception/visitor-log/${id}/edit`,
    createVisitorLog: `/tenant/reception/visitor-log/create`,

    // Call Log
    callLogList: "/tenant/reception/call-log",
    editCallLog: (id: string) => `/tenant/reception/call-log/${id}/edit`,
    createCallLog: `/tenant/reception/call-log/create`,
  },
  newsUpdates: "/tenant/newsUpdate",
  company: {
    documentList: "/tenant/company/documents",
    credentialsList: "/tenant/company/credentials",
    eventCalendar: "/tenant/company/eventCalendar",
    assetList: "/tenant/company/assets",
    brandKit: "/tenant/company/brandkit",
  },
  sales: {
    // Customer
    customerList: "/tenant/customers-vendors/customer",
    editCustomer: (id: string) =>
      `/tenant/customers-vendors/customer/${id}/edit`,
    createCustomer: `/tenant/customers-vendors/customer/create`,

    // Vendor
    vendorList: "/tenant/customers-vendors/vendor",
    editVendor: (id: string) => `/tenant/customers-vendors/vendor/${id}/edit`,
    createVendor: `/tenant/customers-vendors/vendor/create`,
  },
  salesManagement: {
    // Lead
    leadList: "/tenant/sales/leads",
    editLead: (id: string) => `/tenant/sales/leads/${id}/edit`,
    createLead: `/tenant/sales/leads/create`,

    // Quotatation
    quotationList: "/tenant/sales/quotation",
    editQuotation: (id: string) => `/tenant/sales/quotation/${id}/edit`,
    createQuotation: `/tenant/sales/quotation/create`,

    // Invoice
    invoiceList: "/tenant/sales/invoice",
    editInvoice: (id: string) => `/tenant/sales/invoice/${id}/edit`,
    createInvoice: `/tenant/sales/invoice/create`,
  },
  employees: {
    // Employee Records
    employeesRecordsList: "/tenant/employees/employee-records",
    editEmployeeRecord: (id: string) =>
      `/tenant/employees/employee-records/${id}/edit`,
    createEmployeeRecord: `/tenant/employees/employee-records/create`,

    // Task Management
    taskManagementList: "/tenant/employees/task-management",
    editTaskManagementRecord: (id: string) =>
      `/tenant/employees/task-management/${id}/edit`,
    createTaskManagementRecord: `/tenant/employees/task-management/create`,

    // Leave Management
    leaveManagementList: "/tenant/employees/leave-management",
  },
  rolesUser: {
    createRoleUser: "/tenant/roles-user/create",
    roleUserList: "/tenant/roles-user",
    editRoleUser: (id: string) => `/tenant/roles-user/${id}/edit`,
  },
  financials: {
    // Cheque Tracker
    chequeTrackerList: "/tenant/financial/cheque-tracker",
    createChequeTracker: "/tenant/financial/cheque-tracker/create",
    editChequeTracker: (id: string) =>
      `/tenant/financial/cheque-tracker/${id}/edit`,

    // Petty cash
    createPettyCash: "/tenant/financial/petty-cash/create",
    editPettyCash: (id: string) => `/tenant/financial/petty-cash/${id}/edit`,
    pettyCashList: "/tenant/financial/petty-cash",
  },

  // tenants: {
  //   tenantsList: "/dashboard/tenants",
  //   editTenant: (id: string) => `/dashboard/tenants/${id}/edit`,
  //   createTenant: `/dashboard/tenants/create`,
  // },
  // subscriptionOrders: {
  //   ordersList: "/dashboard/subscription-orders",
  //   // editTenant: (id: string) => `/dashboard/tenants/${id}/edit`,
  //   // createTenant: `/dashboard/tenants/create`,
  // },

  eCommerce: {
    dashboard: "/ecommerce",
    products: "/ecommerce/products",
    createProduct: "/ecommerce/products/create",
    productDetails: (slug: string) => `/ecommerce/products/${slug}`,
    ediProduct: (slug: string) => `/ecommerce/products/${slug}/edit`,
    categories: "/ecommerce/categories",
    createCategory: "/ecommerce/categories/create",
    editCategory: (id: string) => `/ecommerce/categories/${id}/edit`,
    orders: "/ecommerce/orders",
    createOrder: "/ecommerce/orders/create",
    orderDetails: (id: string) => `/ecommerce/orders/${id}`,
    editOrder: (id: string) => `/ecommerce/orders/${id}/edit`,
    reviews: "/ecommerce/reviews",
    shop: "/ecommerce/shop",
    cart: "/ecommerce/cart",
    checkout: "/ecommerce/checkout",
    trackingId: (id: string) => `/ecommerce/tracking/${id}`,
  },
  searchAndFilter: {
    realEstate: "/search/real-estate",
    nft: "/search/nft",
    flight: "/search/flight",
  },
  support: {
    dashboard: "/support",
    inbox: "/support/inbox",
    supportCategory: (category: string) => `/support/inbox/${category}`,
    messageDetails: (id: string) => `/support/inbox/${id}`,
    snippets: "/support/snippets",
    createSnippet: "/support/snippets/create",
    viewSnippet: (id: string) => `/support/snippets/${id}`,
    editSnippet: (id: string) => `/support/snippets/${id}/edit`,
    templates: "/support/templates",
    createTemplate: "/support/templates/create",
    viewTemplate: (id: string) => `/support/templates/${id}`,
    editTemplate: (id: string) => `/support/templates/${id}/edit`,
  },
  logistics: {
    dashboard: "/logistics",
    shipmentList: "/logistics/shipments",
    customerProfile: "/logistics/customer-profile",
    createShipment: "/logistics/shipments/create",
    editShipment: (id: string) => `/logistics/shipments/${id}/edit`,
    shipmentDetails: (id: string) => `/logistics/shipments/${id}`,
    tracking: (id: string) => `/logistics/tracking/${id}`,
  },
  appointment: {
    dashboard: "/appointment",
    appointmentList: "/appointment/list",
  },
  executive: {
    dashboard: "/executive",
  },
  jobBoard: {
    dashboard: "/job-board",
    jobFeed: "/job-board/feed",
  },
  analytics: "/analytics",
  financial: {
    dashboard: "/financial",
  },
  file: {
    dashboard: "/file",
    manager: "/file-manager",
    upload: "/file-manager/upload",
    create: "/file-manager/create",
  },
  pos: {
    index: "/point-of-sale",
  },
  eventCalendar: "/event-calendar",
  rolesPermissions: "/roles-permissions",
  invoice: {
    home: "/invoice",
    create: "/invoice/create",
    details: (id: string) => `/invoice/${id}`,
    edit: (id: string) => `/invoice/${id}/edit`,
    builder: "/invoice/builder",
  },
  widgets: {
    cards: "/widgets/cards",
    icons: "/widgets/icons",
    charts: "/widgets/charts",
    maps: "/widgets/maps",
    banners: "/widgets/banners",
  },
  tables: {
    basic: "/tables/basic",
    collapsible: "/tables/collapsible",
    enhanced: "/tables/enhanced",
    pagination: "/tables/pagination",
    search: "/tables/search",
    stickyHeader: "/tables/sticky-header",
    tanTable: "/tables/tan-table",
    tanTableResizable: "/tables/tan-table-resizable",
    tanTableDnD: "/tables/tan-table-dnd",
    tanTablePinning: "/tables/tan-table-pinning",
    tanTableEnhanced: "/tables/tan-table-enhanced",
    tanTableCollapsible: "/tables/tan-table-collapsible",
  },
  multiStep: "/multi-step",
  forms: {
    profileSettings: "/forms/profile-settings",
    notificationPreference: "/forms/profile-settings/notification",
    personalInformation: "/forms/profile-settings/profile",
    newsletter: "/forms/newsletter",
  },
  emailTemplates: "/email-templates",
  profile: "/profile",
  welcome: "/welcome",
  comingSoon: "/coming-soon",
  accessDenied: "/access-denied",
  notFound: "/not-found",
  maintenance: "/maintenance",
  blank: "/blank",
  auth: {
    signUp1: "/auth/sign-up-1",
    signUp2: "/auth/sign-up-2",
    signUp3: "/auth/sign-up-3",
    signUp4: "/auth/sign-up-4",
    signUp5: "/auth/sign-up-5",
    // sign in
    signIn1: "/auth/sign-in-1",
    signIn2: "/auth/sign-in-2",
    signIn3: "/auth/sign-in-3",
    signIn4: "/auth/sign-in-4",
    signIn5: "/auth/sign-in-5",
    // forgot password
    forgotPassword1: "/auth/forgot-password-1",
    forgotPassword2: "/auth/forgot-password-2",
    forgotPassword3: "/auth/forgot-password-3",
    forgotPassword4: "/auth/forgot-password-4",
    forgotPassword5: "/auth/forgot-password-5",
    // OTP
    otp1: "/auth/otp-1",
    otp2: "/auth/otp-2",
    otp3: "/auth/otp-3",
    otp4: "/auth/otp-4",
    otp5: "/auth/otp-5",
  },
  signIn: "/signin",
};

export const commonRoutes = {
  signup: "/register",
  signin: "/signin",
};
