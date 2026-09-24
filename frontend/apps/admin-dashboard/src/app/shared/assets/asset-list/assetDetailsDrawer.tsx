// "use client";

// import React from "react";
// import { Box, Flex, Badge, ActionIcon } from "rizzui";
// import { PiXBold } from "react-icons/pi";
// import dayjs from "dayjs";
// import { category } from "@/types/assetTypes";

// type AssetDetailsModalProps = {
//   asset: category;
//   closeModal?: () => void;
// };

// const statusColors: any = {
//   "In Use": "bg-green-500 text-white",
//   "In Storage": "bg-yellow-500 text-white",
//   "Under Maintenance": "bg-orange-500 text-white",
//   Retired: "bg-red-500 text-white",
// };

// export default function AssetDetailsModal({
//   asset,
//   closeModal,
// }: AssetDetailsModalProps) {
//   return (
//     <Box className="p-6 space-y-6 rounded-lg bg-white shadow-md">
//       {/* Header */}
//       <Flex justify="between" align="center" className="border-b pb-4">
//         <h2 className="text-xl font-semibold">Asset Details</h2>
//         <ActionIcon
//           size="sm"
//           variant="text"
//           onClick={closeModal}
//           className="text-gray-500 hover:!text-gray-900"
//         >
//           <PiXBold className="h-5 w-5" />
//         </ActionIcon>
//       </Flex>

//       {/* Content */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
//         {/* Asset Name */}
//         <div>
//           <p className="text-sm text-gray-500">Asset Name</p>
//           <p className="text-lg font-medium text-gray-900">
//             {asset.name || "N/A"}
//           </p>
//         </div>

//         {/* Asset Type */}
//         <div>
//           <p className="text-sm text-gray-500">Asset Type</p>
//           <p className="text-lg font-medium text-gray-900">
//             {asset.category || "N/A"}
//           </p>
//         </div>

//         {/* Serial Number */}
//         {asset.serial_number && (
//           <div>
//             <p className="text-sm text-gray-500">Serial Number</p>
//             <p className="text-lg font-medium text-gray-900">
//               {asset.serial_number || "N/A"}
//             </p>
//           </div>
//         )}

//         {/* Purchase Date */}
//         {asset.purchase_date && (
//           <div>
//             <p className="text-sm text-gray-500">Purchase Date</p>
//             <p className="text-lg font-medium text-gray-900">
//               {dayjs(asset.purchase_date).format("DD-MMM-YYYY")}
//             </p>
//           </div>
//         )}

//         {/* Warranty Expiry Date */}
//         {asset.warranty_expiry && (
//           <div>
//             <p className="text-sm text-gray-500">Warranty Expiry</p>
//             <p className="text-lg font-medium text-gray-900">
//               {dayjs(asset.warranty_expiry).format("DD-MMM-YYYY")}
//             </p>
//           </div>
//         )}

//         {/* Assigned To */}
//         {asset.assigned_to && (
//           <div>
//             <p className="text-sm text-gray-500">Assigned To</p>
//             <p className="text-lg font-medium text-gray-900">
//               {asset.assigned_to.full_name || "N/A"}
//             </p>
//           </div>
//         )}

//         {/* Location */}
//         {asset.location && (
//           <div>
//             <p className="text-sm text-gray-500">Location</p>
//             <p className="text-lg font-medium text-gray-900">
//               {asset.location || "N/A"}
//             </p>
//           </div>
//         )}

//         {/* Status */}
//         <div>
//           <p className="text-sm text-gray-500 mb-1">Status</p>
//           <Badge
//             className={`py-1 px-3 rounded-full text-sm font-medium ${
//               statusColors[asset.status] || "bg-gray-500 text-white"
//             }`}
//           >
//             {asset.status || "N/A"}
//           </Badge>
//         </div>

//         {/* Additional Notes */}
//         {asset.notes && (
//           <div className="col-span-2">
//             <p className="text-sm text-gray-500">Additional Notes</p>
//             <p className="text-lg font-medium text-gray-900">
//               {asset.notes || "N/A"}
//             </p>
//           </div>
//         )}
//       </div>
//     </Box>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Drawer, Button } from "rizzui";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import assetService from "@/services/assetManagementService";
import FormFooter from "@core/components/form-footer";
import { assetSchema, AssetSchema } from "@/validators/asset.schema";
import AssetForm from "../create-edit/form";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";

export default function AssetDetailsDrawer({
  asset,
  open,
  onClose,
  onUpdated,
  refreshData,
}: {
  asset: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  refreshData?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm<AssetSchema>({
    resolver: zodResolver(assetSchema),
    defaultValues: asset,
  });

  useEffect(() => {
    if (asset) {
      methods.reset(asset);
    }
  }, [asset]);

  const handleSubmit = async (data: AssetSchema) => {
    setIsLoading(true);
    try {
      await assetService.edit(asset._id, data);
      toast.success("Asset updated successfully.");
      refreshData?.();
      onClose();
      onUpdated?.();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update asset.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={open}
      onClose={handleCloseDrawer}
      containerClassName="w-full sm:!max-w-[calc(100%-530px)] !shadow-2xl z-[999]"
    >
      <div className="flex items-center justify-between px-5 py-3 bg-[#F5F6F7] border-b border-gray-300">
        <h2 className="text-base font-semibold text-gray-900">Asset Details</h2>
        <Button size="sm" variant="text" onClick={onClose}>
          <MdClose className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-60px)]">
        {isEditing ? (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <AssetForm />
              <FormFooter
                submitBtnText="Update Asset"
                isLoading={isLoading}
                onCancel={() => setIsEditing(false)}
              />
            </form>
          </FormProvider>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border rounded-md">
              <div className="flex items-center justify-between bg-[#F5F6F7] px-4 py-3">
                <h3 className="text-base font-semibold text-gray-900">
                  {asset.name || "N/A"}
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => setIsEditing(true)}
                  >
                    <img src="/edit.svg" alt="Edit" className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm p-4">
                <InfoItem label="Asset Type" value={asset.category} />
                <InfoItem label="Serial Number" value={asset.serial_number} />
                <InfoItem
                  label="Purchase Date"
                  value={
                    asset.purchase_date
                      ? dayjs(asset.purchase_date).format("DD-MMM-YYYY")
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Warranty Expiry"
                  value={
                    asset.warranty_expiry
                      ? dayjs(asset.warranty_expiry).format("DD-MMM-YYYY")
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Assigned To"
                  value={asset.assigned_to?.full_name}
                />
                <InfoItem label="Location" value={asset.location} />
                <InfoItem label="Status" value={asset.status} />
              </div>
            </div>

            {asset.notes && (
              <div className="bg-white border rounded-md p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">
                  {asset.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          try {
            setDeleting(true);
            toast.loading("Deleting asset...");
            await assetService.delete(asset._id);
            toast.dismiss();
            toast.success(`Asset deleted successfully.`);
            setDeleteOpen(false);
            if (onUpdated) onUpdated();
            onClose();
            if (refreshData) refreshData();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete asset.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete Asset"
        description={`Are you sure you want to delete this asset?`}
      />
    </Drawer>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <p className="text-gray-500 font-medium text-xs mb-1">{label}</p>
      <p className="text-gray-900 font-semibold break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}
