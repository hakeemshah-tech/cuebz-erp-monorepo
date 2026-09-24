// import { Badge, ActionIcon } from "rizzui";
// import MessagesDropdown from "@/layouts/messages-dropdown";
// import ProfileMenu from "@/layouts/profile-menu";
// import RingBellSolidIcon from "@core/components/icons/ring-bell-solid";
// import ChatSolidIcon from "@core/components/icons/chat-solid";
// import NotificationDropdown from "./notification-dropdown";

// export default function HeaderMenuRight() {
//   return (
//     <div className="ms-auto grid shrink-0 grid-cols-3 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
//       <NotificationDropdown>
//         <ActionIcon
//           aria-label="Notification"
//           variant="text"
//           className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
//         >
//           <RingBellSolidIcon className="h-[18px] w-auto" />
//           <Badge
//             renderAsDot
//             color="warning"
//             enableOutlineRing
//             className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
//           />
//         </ActionIcon>
//       </NotificationDropdown>
//       <MessagesDropdown>
//         <ActionIcon
//           aria-label="Messages"
//           variant="text"
//           className="relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9"
//         >
//           <ChatSolidIcon className="h-[18px] w-auto" />
//           <Badge
//             renderAsDot
//             color="success"
//             enableOutlineRing
//             className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
//           />
//         </ActionIcon>
//       </MessagesDropdown>

//       <ProfileMenu />
//     </div>
//   );
// }

"use client";

import { ActionIcon } from "rizzui";
import NotificationDropdown from "./notification-dropdown";
import ProfileMenu from "@/layouts/profile-menu";
import RenewModal from "@/app/shared/subscriptionRenewModal";
import subscriptionService from "@/services/subscriptionservice";
import { useState } from "react";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/store/authAtom";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { PiBellRingingBold } from "react-icons/pi";
import { FcSettings } from "react-icons/fc";

export default function HeaderMenuRight() {
  const [currentUser] = useAtom(currentUserAtom);
  const [isRenewModalOpen, setRenewModalOpen] = useState(false);

  const subscriptionStatus = currentUser?.tenant_id?.subscription_status;
  const subscriptionEndDate = currentUser?.tenant_id?.subscription_end_date;
  const daysRemaining = subscriptionEndDate
    ? dayjs(subscriptionEndDate).diff(dayjs(), "day")
    : null;

  const openBillingPortal = async () => {
    try {
      const response = await subscriptionService.openBillingPortal();
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error("An error occurred while opening the billing portal.");
    }
  };

  return (
    <div className="ms-auto flex items-center gap-6 pr-4">
      {/* Plan Expiry Status */}
      {/* {subscriptionStatus === "active" && daysRemaining !== null && ( */}
      {/* Plan Expiry Status */}
      {/* {subscriptionStatus === "active" && daysRemaining !== null && ( */}
      <div className="hidden lg:flex bg-white rounded-full px-2 py-1 text-sm font-medium items-center shadow-sm border">
        <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
          Active
        </span>
        <span className="text-[#657079]">
          Your plan will expire in {daysRemaining}{" "}
          {daysRemaining === 1 ? "day" : "days"}
        </span>
      </div>
      {/* )} */}
      {/* )} */}

      <RenewModal
        isOpen={isRenewModalOpen}
        onClose={() => setRenewModalOpen(false)}
      />

      {/* Notification Button */}
      <NotificationDropdown>
        <div className="relative">
          <ActionIcon
            aria-label="Notification"
            variant="text"
            className="text-tertiary hover:text-tertiary/80 p-0"
          >
            {/* <PiBellRingingBold className="w-6 h-6" /> */}
            <img src="/notification.svg" alt="notification" />
          </ActionIcon>
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
        </div>
      </NotificationDropdown>

      {/* Settings */}
      <img src="/settings-icon.svg" alt="settings" />
      {/* <FcSettings className="w-6 h-6 cursor-pointer text-white" color="#fff" /> */}

      {/* Profile Menu */}
      <ProfileMenu />
    </div>
  );
}

// <div className="ms-auto flex items-center gap-6 pr-4">
//   <RenewModal
//     isOpen={isRenewModalOpen}
//     onClose={() => setRenewModalOpen(false)}
//   />

//   {/* Notification Button */}
//   <NotificationDropdown>
//     <div className="relative">
//       <ActionIcon
//         aria-label="Notification"
//         variant="text"
//         className="text-tertiary hover:text-tertiary/80 p-0"
//       >
//         <PiBellRingingBold className="w-6 h-6" />
//       </ActionIcon>
//       <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
//     </div>
//   </NotificationDropdown>

//   {/* Settings */}
//   <FcSettings className="w-6 h-6 cursor-pointer text-white" />

//   {/* Profile Menu */}
//   <ProfileMenu />
// </div>

//----OLD ONE------------
// import { Badge, ActionIcon, Button, Flex } from "rizzui";
// import MessagesDropdown from "@/layouts/messages-dropdown";
// import ProfileMenu from "@/layouts/profile-menu";
// import RingBellSolidIcon from "@core/components/icons/ring-bell-solid";

// import ChatSolidIcon from "@core/components/icons/chat-solid";
// import NotificationDropdown from "./notification-dropdown";
// import dayjs from "dayjs";
// import { useAtom } from "jotai";
// import { currentUserAtom } from "@/store/authAtom";
// import { useState } from "react";
// import RenewModal from "@/app/shared/subscriptionRenewModal";
// import subscriptionService from "@/services/subscriptionservice";
// import toast from "react-hot-toast";
// import { FcSettings } from "react-icons/fc";

// export default function HeaderMenuRight() {
//   const [currentUser] = useAtom(currentUserAtom);

//   const [isRenewModalOpen, setRenewModalOpen] = useState(false);

//   const handleRenewClick = () => {
//     setRenewModalOpen(true);
//   };

//   const closeRenewModal = () => {
//     setRenewModalOpen(false);
//   };

//   const subscriptionStatus = currentUser?.tenant_id?.subscription_status;
//   const subscriptionEndDate = currentUser?.tenant_id?.subscription_end_date;
//   const daysRemaining = subscriptionEndDate
//     ? dayjs(subscriptionEndDate).diff(dayjs(), "day")
//     : null;

//   const getBadgeDetails = () => {
//     switch (subscriptionStatus) {
//       case "Expired":
//         return {
//           color: "danger",
//           text: "Expired",
//           message: "Your subscription has expired.",
//         };
//       case "Trialing":
//         return {
//           color: "warning",
//           text: "Trialing",
//           message: `Your trial will end in ${daysRemaining} days.`,
//         };
//       case "Active":
//         return {
//           color: "success",
//           text: "Active",
//           message: `Your plan will expire in ${daysRemaining} days.`,
//         };
//       case "Payment Failed":
//         return {
//           color: "danger",
//           text: "Payment Failed",
//           message: "Your payment has failed. Try again.",
//         };
//       case "Pending Update":
//         return {
//           color: "info",
//           text: "Pending Update",
//           message: "Your plan is awaiting updates.",
//         };
//       default:
//         return null;
//     }
//   };

//   const openBillingPortal = async () => {
//     try {
//       const response = await subscriptionService.openBillingPortal();

//       if (response.data.url) {
//         window.location.href = response.data.url; // Redirect to the Stripe billing portal
//       }
//     } catch (error) {
//       toast.error("An error occurred while opening the billing portal.");
//     }
//   };

//   const badgeDetails = getBadgeDetails();

//   console.log(currentUser, "showw");

//   return (
//     <div className="ms-auto flex items-center gap-4">
//       <RenewModal isOpen={isRenewModalOpen} onClose={closeRenewModal} />

//       <NotificationDropdown>
//         <ActionIcon
//           aria-label="Notification"
//           variant="text"
//           className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
//         >
//           <RingBellSolidIcon className="h-[18px] w-auto" />
//           <Badge
//             renderAsDot
//             color="warning"
//             enableOutlineRing
//             className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
//           />
//         </ActionIcon>
//       </NotificationDropdown>
//       <FcSettings />
//       <ProfileMenu />
//     </div>
//   );
// }

{
  /* {currentUser?.role === "tenant-owner" && badgeDetails && (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-900 border dark:border-gray-700">
          <Badge
            color={
              badgeDetails.color as "danger" | "warning" | "success" | "info"
            }
            className="py-1 px-3 text-sm font-semibold rounded-full capitalize"
          >
            {badgeDetails.text}
          </Badge>
          <div className="flex-1 text-start md:text-left">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {badgeDetails.message}
            </p>
          </div>
          <Button
            variant="text"
            size="sm"
            className="px-4 py-2 text-xs font-semibold self-stretch md:self-auto"
            onClick={
              currentUser?.tenant_id?.subscription_status === "Trialing" ||
              currentUser?.tenant_id?.subscription_status === "Expired"
                ? handleRenewClick
                : openBillingPortal
            }
          >
            {currentUser?.tenant_id?.subscription_status === "Trialing" ||
            currentUser?.tenant_id?.subscription_status === "Expired"
              ? "Upgrade"
              : "Portal"}
          </Button>
        </div>
      )} */
}

{
  /* <MessagesDropdown>
        <ActionIcon
          aria-label="Messages"
          variant="text"
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9"
        >
          <ChatSolidIcon className="h-[18px] w-auto" />
          <Badge
            renderAsDot
            color="success"
            enableOutlineRing
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
          />
        </ActionIcon>
      </MessagesDropdown> */
}
