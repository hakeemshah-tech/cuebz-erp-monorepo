"use client";

import { useEffect, useState } from "react";
import { Drawer, Button } from "rizzui";
import { MdClose } from "react-icons/md";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import pettyCashService from "@/services/pettycashService";
import {
  pettyCashSchema,
  PettyCashSchema,
} from "@/validators/pettyCash.schema";
import PettyCashForm from "../create-edit/form";
import FormFooter from "@core/components/form-footer";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";

export default function PettyCashDetailsDrawer({
  pettyCash,
  open,
  onClose,
  onUpdated,
  refreshData,
}: {
  pettyCash: any;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  refreshData?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const methods = useForm<PettyCashSchema>({
    resolver: zodResolver(pettyCashSchema),
    defaultValues: pettyCash,
  });

  useEffect(() => {
    if (pettyCash) {
      methods.reset(pettyCash);
    }
  }, [pettyCash]);

  const handleSubmit = async (data: PettyCashSchema) => {
    setIsLoading(true);
    try {
      await pettyCashService.edit(pettyCash._id, data);
      toast.success("Petty cash entry updated successfully.");
      refreshData?.();
      onClose();
      onUpdated?.();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update petty cash entry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      isOpen={open}
      onClose={() => {
        setIsEditing(false);
        onClose();
      }}
      containerClassName="w-full sm:!max-w-[calc(100%-530px)] !shadow-2xl z-[999]"
    >
      <div className="flex items-center justify-between px-5 py-3 bg-[#F5F6F7] border-b border-gray-300">
        <h2 className="text-base font-semibold text-gray-900">
          Petty Cash Details
        </h2>
        <Button size="sm" variant="text" onClick={onClose}>
          <MdClose className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-60px)]">
        {isEditing ? (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className="min-h-[84vh] flex flex-col"
            >
              {/* Form Content */}
              <div className="flex-1">
                <PettyCashForm />
              </div>

              {/* Footer at bottom */}
              <div className="border-muted">
                <FormFooter
                  submitBtnText="Update Entry"
                  isLoading={isLoading}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            </form>
          </FormProvider>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border rounded-md">
              <div className="flex items-center justify-between bg-[#F5F6F7] px-4 py-3">
                <h3 className="text-base font-semibold text-gray-900">
                  {pettyCash.transaction_type || "N/A"}
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
                <InfoItem
                  label="Transaction Date"
                  value={dayjs(pettyCash.transaction_date).format(
                    "DD-MMM-YYYY"
                  )}
                />
                <InfoItem
                  label="Amount"
                  value={`AED ${pettyCash.amount || "0.00"}`}
                />
                <InfoItem label="Purpose" value={pettyCash.purpose} />
                <InfoItem label="Remarks" value={pettyCash.remarks} />
              </div>
            </div>
            {/* 
            {pettyCash.attachment && (
              <div className="bg-white border rounded-md p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  Attachment
                </h4>
                <div className="flex items-center gap-4">
                  <div className="h-32 w-32 overflow-hidden rounded border bg-gray-50">
                    <img
                      src={pettyCash.attachment}
                      alt="Attachment"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col text-sm">
                    <a
                      href={pettyCash.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                    <a
                      href={pettyCash.attachment}
                      download
                      className="text-gray-600 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          try {
            setDeleting(true);
            toast.loading("Deleting petty cash...");
            await pettyCashService.delete(pettyCash._id);
            toast.dismiss();
            toast.success("Petty cash entry deleted successfully.");
            setDeleteOpen(false);
            onClose();
            refreshData?.();
            onUpdated?.();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete petty cash.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete Petty Cash Entry"
        description="Are you sure you want to delete this petty cash entry?"
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
