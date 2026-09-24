import { routesSuperAdmin, routesTenant } from "@/config/routes";
import { MODULES } from "@/config/constants";
import {
  PiChartBarDuotone,
  PiHeadsetDuotone,
  PiUsersThreeDuotone,
  PiCurrencyDollarDuotone,
  PiStorefrontDuotone,
  PiBriefcaseDuotone,
  PiBuildingsDuotone,
  PiNewspaperClippingDuotone,
  PiUserCircleDuotone,
} from "react-icons/pi";

// Note: do not add href in the label object, it is rendering as label
export const menuItemsSuperAmin = [
  // label start
  // {
  //   name: "Overview",
  // },
  // label end
  {
    name: "Analytics",
    href: "/dashboard",
    icon: <PiChartBarDuotone />,
  },
  {
    name: "Subscription Plans",
    href: routesSuperAdmin.subscriptions.subscriptionsList,
    icon: <PiChartBarDuotone />,
  },
  {
    name: "Tenants",
    href: routesSuperAdmin.tenants.tenantsList,
    icon: <PiChartBarDuotone />,
  },
  {
    name: "News & Updates",
    href: routesSuperAdmin.newUpdates.newsUpdateList,
    icon: <PiChartBarDuotone />,
  },
  {
    name: "Subscription Orders",
    href: routesSuperAdmin.subscriptionOrders.ordersList,
    icon: <PiChartBarDuotone />,
  },
];

export const menuItemsTenant = [
  {
    name: "Analytics",
    href: "/dashboard",
    key: MODULES.dashboard,
    icon: <img src="/dashboard.svg" alt="Analytics" className="w-5 h-5" />,
  },
  {
    name: "Reception",
    href: "#",
    icon: <img src="/concierge.svg" alt="Reception" className="w-5 h-5" />,
    dropdownItems: [
      {
        name: "Visitor Logs",
        key: MODULES.visitorLog,
        href: routesTenant.reception.visitorLogList,
      },
      {
        name: "Call Logs",
        key: MODULES.callLog,
        href: routesTenant.reception.callLogList,
      },
    ],
  },
  {
    name: "Employees",
    href: "#",
    icon: <img src="/assignment_ind.svg" alt="Employees" className="w-5 h-5" />,
    dropdownItems: [
      {
        name: "Employee Records",
        key: MODULES.employees,
        href: routesTenant.employees.employeesRecordsList,
      },
      {
        name: "Leave Management",
        key: MODULES.leaveManagement,
        href: routesTenant.employees.leaveManagementList,
      },
      {
        name: "Task Management",
        key: MODULES.taskManagement,
        href: routesTenant.employees.taskManagementList,
      },
    ],
  },
  {
    name: "Finance",
    href: "#",
    icon: (
      <img
        src="/account_balance_wallet.svg"
        alt="Finance"
        className="w-5 h-5"
      />
    ),
    dropdownItems: [
      {
        name: "Cheque Tracker",
        key: MODULES.chequeTracker,
        href: routesTenant.financials.chequeTrackerList,
      },
      {
        name: "Petty Cash",
        key: MODULES.pettyCash,
        href: routesTenant.financials.pettyCashList,
      },
    ],
  },
  {
    name: "Customers & Vendors",
    href: "#",
    icon: (
      <img src="/group.svg" alt="Customer and Vendors" className="w-5 h-5" />
    ),
    dropdownItems: [
      {
        name: "Customer",
        key: MODULES.customer,
        href: routesTenant.sales.customerList,
      },
      {
        name: "Vendor",
        key: MODULES.vendor,
        href: routesTenant.sales.vendorList,
      },
    ],
  },
  {
    name: "Sales Management",
    href: "#",
    icon: <img src="/campaign.svg" alt="Sales" className="w-5 h-5" />,
    dropdownItems: [
      {
        name: "Leads",
        key: MODULES.lead,
        href: routesTenant.salesManagement.leadList,
      },
      {
        name: "Quotations",
        key: MODULES.quotation,
        href: routesTenant.salesManagement.quotationList,
      },
      {
        name: "Invoices",
        key: MODULES.invoice,
        href: routesTenant.salesManagement.invoiceList,
      },
    ],
  },
  {
    name: "Company",
    href: "#",
    icon: <img src="/corporate_fare.svg" alt="Company" className="w-5 h-5" />,
    dropdownItems: [
      {
        name: "Documents",
        key: MODULES.document,
        href: routesTenant.company.documentList,
      },
      {
        name: "Credentials",
        key: MODULES.credentials,
        href: routesTenant.company.credentialsList,
      },
      {
        name: "Event Calendar",
        key: MODULES.credentials,
        href: routesTenant.company.eventCalendar,
      },
      {
        name: "Assets Management",
        key: MODULES.assetManagement,
        href: routesTenant.company.assetList,
      },
      {
        name: "Brand Kit",
        key: MODULES.brandKit,
        href: routesTenant.company.brandKit,
      },
    ],
  },
  {
    name: "News & Updates",
    href: routesTenant.newsUpdates,
    key: MODULES.newsUpdates,
    icon: <img src="/full_coverage.svg" alt="News" className="w-5 h-5" />,
  },
  {
    name: "Roles & Users",
    href: routesTenant.rolesUser.roleUserList,
    icon: (
      <img
        src="/settings_account_box.svg"
        alt="Roles & Users"
        className="w-5 h-5"
      />
    ),
    badge: "",
  },
];

// {
//   name: "File Manager",
//   href: "/",
//   icon: <PiFolder />,
//   badge: "",
// },
// {
//   name: "Appointment",
//   href: routes.appointment.dashboard,
//   icon: <PiCalendarDuotone />,
// },
// {
//   name: "Executive",
//   href: routes.executive.dashboard,
//   icon: <PiBriefcaseDuotone />,
// },
// {
//   name: "Job Board",
//   href: routes.jobBoard.dashboard,
//   icon: <PiShapesDuotone />,
// },
// {
//   name: "Financial",
//   href: routes.financial.dashboard,
//   icon: <PiCurrencyCircleDollarDuotone />,
// },
// {
//   name: "Logistics",
//   href: routes.logistics.dashboard,
//   icon: <PiPackageDuotone />,
// },
// {
//   name: "E-Commerce",
//   href: routes.eCommerce.dashboard,
//   icon: <PiShoppingCartDuotone />,
// },

// {
//   name: "Support",
//   href: routes.support.dashboard,
//   icon: <PiHeadsetDuotone />,
// },

// label start
// {
//   name: "Apps Kit",
// },
// label end
// {
//   name: "E-Commerce",
//   href: "#",
//   icon: <PiShoppingCartDuotone />,
//   dropdownItems: [
//     {
//       name: "Products",
//       href: routes.eCommerce.products,
//       badge: "",
//     },
//     {
//       name: "Product Details",
//       href: routes.eCommerce.productDetails(DUMMY_ID),
//     },
//     {
//       name: "Create Product",
//       href: routes.eCommerce.createProduct,
//     },
//     {
//       name: "Edit Product",
//       href: routes.eCommerce.ediProduct(DUMMY_ID),
//     },
//     {
//       name: "Categories",
//       href: routes.eCommerce.categories,
//     },
//     {
//       name: "Create Category",
//       href: routes.eCommerce.createCategory,
//     },
//     {
//       name: "Edit Category",
//       href: routes.eCommerce.editCategory(DUMMY_ID),
//     },
//     {
//       name: "Orders",
//       href: routes.eCommerce.orders,
//     },
//     {
//       name: "Order Details",
//       href: routes.eCommerce.orderDetails(DUMMY_ID),
//     },
//     {
//       name: "Create Order",
//       href: routes.eCommerce.createOrder,
//     },
//     {
//       name: "Edit Order",
//       href: routes.eCommerce.editOrder(DUMMY_ID),
//     },
//     {
//       name: "Reviews",
//       href: routes.eCommerce.reviews,
//     },
//     {
//       name: "Shop",
//       href: routes.eCommerce.shop,
//     },
//     {
//       name: "Cart",
//       href: routes.eCommerce.cart,
//     },
//     {
//       name: "Checkout & Payment",
//       href: routes.eCommerce.checkout,
//     },
//   ],
// },
// {
//   name: "Support",
//   href: "#",
//   icon: <PiHeadsetDuotone />,
//   dropdownItems: [
//     {
//       name: "Inbox",
//       href: routes.support.inbox,
//     },
//     {
//       name: "Snippets",
//       href: routes.support.snippets,
//     },
//     {
//       name: "Templates",
//       href: routes.support.templates,
//     },
//   ],
// },
// {
//   name: "Invoice",
//   href: "#",
//   icon: <PiCurrencyDollarDuotone />,
//   dropdownItems: [
//     {
//       name: "List",
//       href: routes.invoice.home,
//     },
//     {
//       name: "Details",
//       href: routes.invoice.details(DUMMY_ID),
//     },
//     {
//       name: "Create",
//       href: routes.invoice.create,
//     },
//     {
//       name: "Edit",
//       href: routes.invoice.edit(DUMMY_ID),
//     },
//   ],
// },
// {
//   name: "Logistics",
//   href: "#",
//   icon: <PiPackageDuotone />,
//   dropdownItems: [
//     {
//       name: "Shipment List",
//       href: routes.logistics.shipmentList,
//     },
//     {
//       name: "Shipment Details",
//       href: routes.logistics.shipmentDetails(DUMMY_ID),
//     },
//     {
//       name: "Create Shipment",
//       href: routes.logistics.createShipment,
//     },
//     {
//       name: "Edit Shipment",
//       href: routes.logistics.editShipment(DUMMY_ID),
//     },
//     {
//       name: "Customer Profile",
//       href: routes.logistics.customerProfile,
//     },
//     {
//       name: "Tracking",
//       href: routes.logistics.tracking(DUMMY_ID),
//     },
//   ],
// },
// {
//   name: "Job Feeds",
//   href: routes.jobBoard.jobFeed,
//   icon: <PiShapesDuotone />,
// },
// {
//   name: "Appointment",
//   href: routes.appointment.appointmentList,
//   icon: <PiCalendarDuotone />,
// },
// {
//   name: "File Manager",
//   href: routes.file.manager,
//   icon: <PiFolder />,
// },
// {
//   name: "Event Calendar",
//   href: routes.eventCalendar,
//   icon: <PiCalendarPlusDuotone />,
// },
// {
//   name: "Roles & Permissions",
//   href: routes.rolesPermissions,
//   icon: <PiFolderLockDuotone />,
// },
// {
//   name: "Point of Sale",
//   href: routes.pos.index,
//   icon: <PiCreditCardDuotone />,
// },
// {
//   name: "Invoice Builder",
//   href: routes.invoice.builder,
//   icon: <PiNewspaperClippingDuotone />,
// },
// label start
// {
//   name: "Search & Filters",
// },
// {
//   name: "Real Estate",
//   href: routes.searchAndFilter.realEstate,
//   icon: <PiHouseLineDuotone />,
// },
// {
//   name: "Flight Booking",
//   href: routes.searchAndFilter.flight,
//   icon: <PiAirplaneTiltDuotone />,
// },
// {
//   name: "NFT",
//   href: routes.searchAndFilter.nft,
//   icon: <PiCoinDuotone />,
// },
// label end
// label start
// {
//   name: "Widgets",
// },
// label end
// {
//   name: "Cards",
//   href: routes.widgets.cards,
//   icon: <PiSquaresFourDuotone />,
// },
// {
//   name: "Icons",
//   href: routes.widgets.icons,
//   icon: <PiFeatherDuotone />,
// },
// {
//   name: "Charts",
//   href: routes.widgets.charts,
//   icon: <PiChartLineUpDuotone />,
// },
// {
//   name: 'Banners',
//   href: routes.widgets.banners,
//   icon: <PiImageDuotone />,
// },
// {
//   name: "Maps",
//   href: routes.widgets.maps,
//   icon: <PiMapPinLineDuotone />,
// },
// {
//   name: "Email Templates",
//   href: routes.emailTemplates,
//   icon: <PiEnvelopeDuotone />,
// },
// label start
// {
//   name: "Forms",
// },
// label end
// {
//   name: "Account Settings",
//   href: routes.forms.profileSettings,
//   icon: <PiUserGearDuotone />,
// },
// {
//   name: "Notification Preference",
//   href: routes.forms.notificationPreference,
//   icon: <PiBellSimpleRingingDuotone />,
// },
// {
//   name: "Personal Information",
//   href: routes.forms.personalInformation,
//   icon: <PiUserDuotone />,
// },
// {
//   name: "Newsletter",
//   href: routes.forms.newsletter,
//   icon: <PiEnvelopeSimpleOpenDuotone />,
// },
// {
//   name: "Multi Step",
//   href: routes.multiStep,
//   icon: <PiStepsDuotone />,
// },
// {
//   name: "Payment Checkout",
//   href: routes.eCommerce.checkout,
//   icon: <PiCreditCardDuotone />,
// },
// label start
// {
//   name: "Tables",
// },
// label end
// {
//   name: "Basic",
//   href: routes.tables.basic,
//   icon: <PiGridFourDuotone />,
// },
// {
//   name: "Collapsible",
//   href: routes.tables.collapsible,
//   icon: <PiCaretCircleUpDownDuotone />,
// },
// {
//   name: "Enhanced",
//   href: routes.tables.enhanced,
//   icon: <PiTableDuotone />,
// },
// {
//   name: "Sticky Header",
//   href: routes.tables.stickyHeader,
//   icon: <PiBrowserDuotone />,
// },
// {
//   name: "Pagination",
//   href: routes.tables.pagination,
//   icon: <PiListNumbersDuotone />,
// },
// {
//   name: "Search",
//   href: routes.tables.search,
//   icon: <PiHourglassSimpleDuotone />,
// },
// {
//   name: "TanStack Table",
//   href: "#",
//   icon: <PiTableDuotone />,
//   dropdownItems: [
//     {
//       name: "Basic",
//       href: routes.tables.tanTable,
//     },
//     {
//       name: "Resizable",
//       href: routes.tables.tanTableResizable,
//     },
//     {
//       name: "Collapsible",
//       href: routes.tables.tanTableCollapsible,
//     },
//     {
//       name: "Drag & Drop",
//       href: routes.tables.tanTableDnD,
//     },
//     {
//       name: "Pinning",
//       href: routes.tables.tanTablePinning,
//     },
//     {
//       name: "Enhanced",
//       href: routes.tables.tanTableEnhanced,
//     },
//   ],
// },
// label start
// {
//   name: "Pages",
// },
// {
//   name: "Profile",
//   href: routes.profile,
//   icon: <PiUserCircleDuotone />,
// },
// {
//   name: "Welcome",
//   href: routes.welcome,
//   icon: <PiShootingStarDuotone />,
// },
// {
//   name: "Coming soon",
//   href: routes.comingSoon,
//   icon: <PiRocketLaunchDuotone />,
// },
// {
//   name: "Access Denied",
//   href: routes.accessDenied,
//   icon: <PiFolderLockDuotone />,
// },
// {
//   name: "Not Found",
//   href: routes.notFound,
//   icon: <PiBinocularsDuotone />,
// },
// {
//   name: "Maintenance",
//   href: routes.maintenance,
//   icon: <PiHammerDuotone />,
// },
// {
//   name: "Blank",
//   href: routes.blank,
//   icon: <PiNoteBlankDuotone />,
// },

// label start
// {
//   name: "Authentication",
// },
// label end
// {
//   name: "Sign Up",
//   href: "#",
//   icon: <PiUserPlusDuotone />,
//   dropdownItems: [
//     {
//       name: "Modern Sign up",
//       href: routes.auth.signUp1,
//     },
//     {
//       name: "Vintage Sign up",
//       href: routes.auth.signUp2,
//     },
//     {
//       name: "Trendy Sign up",
//       href: routes.auth.signUp3,
//     },
//     {
//       name: "Elegant Sign up",
//       href: routes.auth.signUp4,
//     },
//     {
//       name: "Classic Sign up",
//       href: routes.auth.signUp5,
//     },
//   ],
// },
// {
//   name: "Sign In",
//   href: "#",
//   icon: <PiShieldCheckDuotone />,
//   dropdownItems: [
//     {
//       name: "Modern Sign in",
//       href: routes.auth.signIn1,
//     },
//     {
//       name: "Vintage Sign in",
//       href: routes.auth.signIn2,
//     },
//     {
//       name: "Trendy Sign in",
//       href: routes.auth.signIn3,
//     },
//     {
//       name: "Elegant Sign in",
//       href: routes.auth.signIn4,
//     },
//     {
//       name: "Classic Sign in",
//       href: routes.auth.signIn5,
//     },
//   ],
// },
// {
//   name: "Forgot Password",
//   href: "#",
//   icon: <PiLockKeyDuotone />,
//   dropdownItems: [
//     {
//       name: "Modern Forgot password",
//       href: routes.auth.forgotPassword1,
//     },
//     {
//       name: "Vintage Forgot password",
//       href: routes.auth.forgotPassword2,
//     },
//     {
//       name: "Trendy Forgot password",
//       href: routes.auth.forgotPassword3,
//     },
//     {
//       name: "Elegant Forgot password",
//       href: routes.auth.forgotPassword4,
//     },
//     {
//       name: "Classic Forgot password",
//       href: routes.auth.forgotPassword5,
//     },
//   ],
// },
// {
//   name: "OTP Pages",
//   href: "#",
//   icon: <PiChatCenteredDotsDuotone />,
//   dropdownItems: [
//     {
//       name: "Modern OTP page",
//       href: routes.auth.otp1,
//     },
//     {
//       name: "Vintage OTP page",
//       href: routes.auth.otp2,
//     },
//     {
//       name: "Trendy OTP page",
//       href: routes.auth.otp3,
//     },
//     {
//       name: "Elegant OTP page",
//       href: routes.auth.otp4,
//     },
//     {
//       name: "Classic OTP page",
//       href: routes.auth.otp5,
//     },
//   ],
// },
