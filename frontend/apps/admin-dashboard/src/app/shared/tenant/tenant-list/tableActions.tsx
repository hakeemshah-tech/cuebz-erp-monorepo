// import { Dropdown, ActionIcon, Tooltip, Flex } from "rizzui";
// import {
//   FiEye,
//   FiEdit,
//   FiTrash2,
//   FiPlus,
//   FiRefreshCw,
//   FiTool,
// } from "react-icons/fi";
// import { useModal } from "@/app/shared/modal-views/use-modal";
// import toast from "react-hot-toast";
// import { routes } from "@/config/routes";
// import Link from "next/link";
// import tenantService from "@/services/tenantService";
// import SubscriptionModal from "@/app/shared/tenant/tenant-list/tenantSubscription";
// import DeletePopover from "@core/components/delete-popover";
// import TenantDetailsModal from "./tenantDetails";

// export default function TenantsTableActions({ row, fetchTenants }) {
//   const { openModal, closeModal } = useModal();

//   const handleSubscriptionAction = async (action) => {
//     openModal({
//       view: (
//         <SubscriptionModal
//           tenantId={row.original._id}
//           action={action}
//           onSuccess={() => {
//             toast.success(`Subscription ${action}d successfully.`);
//             closeModal();
//             fetchTenants(); // Refresh the table
//           }}
//         />
//       ),
//       size: "lg",
//     });
//   };

//   const handleDelete = async () => {
//     try {
//       await tenantService.delete(row.original._id);
//       toast.success("Tenant deleted successfully.");
//       fetchTenants(); // Refresh the table
//     } catch (error) {
//       toast.error("Failed to delete the tenant.");
//     }
//   };

//   const hasSubscription = !!row.original.subscription_plan;

//   return (
//     <Flex align="center" justify="end" className="pe-4">
//       <Tooltip size="sm" content="View Details" placement="top" color="invert">
//         <ActionIcon
//           as="span"
//           size="sm"
//           variant="outline"
//           aria-label="View Details"
//           onClick={() => {
//             openModal({
//               view: (
//                 <TenantDetailsModal
//                   tenant={row.original}
//                   closeModal={closeModal}
//                 />
//               ),
//               size: "lg",
//             });
//           }}
//         >
//           <FiEye />
//         </ActionIcon>
//       </Tooltip>

//       <Dropdown placement="bottom-end">
//         <Dropdown.Trigger>
//           <ActionIcon variant="outline" rounded="full">
//             <FiTool />
//           </ActionIcon>
//         </Dropdown.Trigger>
//         <Dropdown.Menu className="divide-y">
//           <div className="mb-2">
//             <Dropdown.Item>
//               <Link href={routes.tenants.editTenant(row.original._id)}>
//                 <Flex align="center" gap="2">
//                   <FiEdit /> Edit Tenant
//                 </Flex>
//               </Link>
//             </Dropdown.Item>
//           </div>
//           {!hasSubscription && (
//             <div className="mb-2 pt-2">
//               <Dropdown.Item onClick={() => handleSubscriptionAction("create")}>
//                 <Flex align="center" gap="2">
//                   <FiPlus /> Create Subscription
//                 </Flex>
//               </Dropdown.Item>
//             </div>
//           )}
//           {hasSubscription && (
//             <div className="mb-2 pt-2">
//               <Dropdown.Item onClick={() => handleSubscriptionAction("update")}>
//                 <Flex align="center" gap="2">
//                   <FiRefreshCw /> Update Subscription
//                 </Flex>
//               </Dropdown.Item>
//               <Dropdown.Item onClick={() => handleSubscriptionAction("renew")}>
//                 <Flex align="center" gap="2">
//                   <FiRefreshCw /> Renew Subscription
//                 </Flex>
//               </Dropdown.Item>
//             </div>
//           )}
//         </Dropdown.Menu>
//       </Dropdown>
//     </Flex>
//   );
// }
"use client";

import { useState } from "react";
import { Dropdown, ActionIcon, Tooltip, Flex, Button } from "rizzui";
import { FiEye, FiEdit, FiTool, FiPlus, FiRefreshCw } from "react-icons/fi";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import Link from "next/link";
import toast from "react-hot-toast";
import { routesSuperAdmin } from "@/config/routes";
import { useModal } from "@/app/shared/modal-views/use-modal";
import tenantService from "@/services/tenantService";
import SubscriptionModal from "@/app/shared/tenant/tenant-list/tenantSubscription";
import TenantDetailsModal from "./tenantDetails";

interface ITenantProps {
  row: any;
  fetchTenants: any;
}

export default function TenantsTableActions({
  row,
  fetchTenants,
}: ITenantProps) {
  const { openModal, closeModal } = useModal();

  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const hasSubscription = !!row?.original?.subscription_plan;
  const isPendingApproval =
    row.original.subscription_status === "PendingApproval";

  const handleSubscriptionAction = async (action: any) => {
    openModal({
      view: (
        <SubscriptionModal
          tenantId={row.original._id}
          action={action}
          onSuccess={() => {
            toast.success(`Subscription ${action}d successfully.`);
            closeModal();
            fetchTenants();
          }}
        />
      ),
      size: "lg",
    });
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      toast.loading("Approving tenant...");
      await tenantService.approve(row.original._id);
      toast.dismiss();
      toast.success("Tenant approved successfully.");
      fetchTenants();
    } catch {
      toast.dismiss();
      toast.error("Failed to approve tenant.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setRejecting(true);
      toast.loading("Rejecting tenant...");
      await tenantService.reject(row.original._id);
      toast.dismiss();
      toast.success("Tenant rejected successfully.");
      fetchTenants();
    } catch {
      toast.dismiss();
      toast.error("Failed to reject tenant.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <Flex align="center" justify="end" className="pe-4 gap-2">
      {/* View Details */}
      <Tooltip size="sm" content="View Details" placement="top" color="invert">
        <ActionIcon
          as="span"
          size="sm"
          variant="outline"
          aria-label="View Details"
          onClick={() =>
            openModal({
              view: (
                <TenantDetailsModal
                  tenant={row.original}
                  closeModal={closeModal}
                />
              ),
              size: "lg",
            })
          }
        >
          <FiEye />
        </ActionIcon>
      </Tooltip>

      {/* Approve/Reject */}
      {isPendingApproval && (
        <>
          <Tooltip content="Approve Tenant">
            <Button
              size="sm"
              // color="success"
              variant="outline"
              isLoading={approving}
              onClick={handleApprove}
              className="gap-1"
            >
              <MdCheckCircle className="w-4 h-4" />
              Approve
            </Button>
          </Tooltip>
          <Tooltip content="Reject Tenant">
            <Button
              size="sm"
              color="danger"
              variant="outline"
              isLoading={rejecting}
              onClick={handleReject}
              className="gap-1"
            >
              <MdCancel className="w-4 h-4" />
              Reject
            </Button>
          </Tooltip>
        </>
      )}

      {/* Dropdown */}
      <Dropdown placement="bottom-end">
        <Dropdown.Trigger>
          <ActionIcon variant="outline" rounded="full">
            <FiTool />
          </ActionIcon>
        </Dropdown.Trigger>
        <Dropdown.Menu className="divide-y">
          <div className="mb-2">
            <Dropdown.Item>
              <Link
                href={routesSuperAdmin.tenants.editTenant(row.original._id)}
              >
                <Flex align="center" gap="2">
                  <FiEdit /> Edit Tenant
                </Flex>
              </Link>
            </Dropdown.Item>
          </div>
          {!hasSubscription && (
            <div className="mb-2 pt-2">
              <Dropdown.Item onClick={() => handleSubscriptionAction("create")}>
                <Flex align="center" gap="2">
                  <FiPlus /> Create Subscription
                </Flex>
              </Dropdown.Item>
            </div>
          )}
          {hasSubscription && (
            <div className="mb-2 pt-2">
              <Dropdown.Item onClick={() => handleSubscriptionAction("update")}>
                <Flex align="center" gap="2">
                  <FiRefreshCw /> Update Subscription
                </Flex>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSubscriptionAction("renew")}>
                <Flex align="center" gap="2">
                  <FiRefreshCw /> Renew Subscription
                </Flex>
              </Dropdown.Item>
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Flex>
  );
}
