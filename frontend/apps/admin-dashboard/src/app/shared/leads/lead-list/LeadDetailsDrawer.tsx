"use client";

import { useState, useEffect } from "react";
import { Drawer, Button, Badge } from "rizzui";
import { PiXBold, PiTrashBold, PiPencilSimpleBold } from "react-icons/pi";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LeadType } from "@/types/leadTypes";
import { leadSchema, LeadSchema } from "@/validators/lead.schema";
import DeleteConfirmModal from "@core/components/DeleteConfirmModal";
import FormFooter from "@core/components/form-footer";
import LeadForm from "../create-edit/form";
import leadService from "@/services/leadService";

const leadStatusColors: any = {
  New: "bg-blue-500 text-white",
  Contacted: "bg-yellow-500 text-white",
  Qualified: "bg-green-500 text-white",
  "Proposal Sent": "bg-indigo-500 text-white",
  Won: "bg-teal-500 text-white",
  Lost: "bg-red-500 text-white",
};

type LeadDetailsDrawerProps = {
  lead: LeadType;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  refreshData?: () => void;
};

export default function LeadDetailsDrawer({
  lead,
  open,
  onClose,
  onUpdated,
  refreshData,
}: LeadDetailsDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const methods = useForm<LeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead,
  });

  useEffect(() => {
    if (lead) methods.reset(lead);
  }, [lead]);

  const handleSubmit = async (data: LeadSchema) => {
    setIsLoading(true);
    try {
      await leadService.edit(lead._id, data);
      toast.success("Lead updated successfully.");
      refreshData?.();
      onClose();
      onUpdated?.();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update lead.");
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
        <h2 className="text-base font-semibold text-gray-900">Lead Details</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="text" onClick={onClose}>
            <PiXBold className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-60px)]">
        {isEditing ? (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <LeadForm />
              <FormFooter
                submitBtnText="Update Lead"
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
                  {lead.lead_identifier_name || "N/A"}
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => setDeleteOpen(true)}
                  >
                    {/* <PiTrashBold className="w-5 h-5 text-red-500" /> */}
                    <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="text"
                    onClick={() => setIsEditing(true)}
                  >
                    {/* <PiPencilSimpleBold className="w-5 h-5 text-gray-600" /> */}
                    <img src="/edit.svg" alt="Edit" className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm p-4">
                <InfoItem label="Lead Source" value={lead.lead_source} />
                <InfoItem label="Company Name" value={lead.company_name} />
                <InfoItem label="Contact Person" value={lead.contact_person} />
                <InfoItem label="Contact Number" value={lead.contact_number} />
                <InfoItem label="Email Address" value={lead.email} />
                <InfoItem
                  label="Address"
                  value={`${lead.address?.street || ""}, ${lead.address?.city || ""}, ${lead.address?.state || ""}, ${lead.address?.postal_code || ""}, ${lead.address?.country || ""}`.trim()}
                />
                <div>
                  <p className="text-gray-500 font-medium text-xs mb-1">
                    Lead Status
                  </p>
                  <Badge
                    className={`py-1 px-3 rounded-full text-sm font-medium ${
                      leadStatusColors[lead.lead_status] ||
                      "bg-gray-500 text-white"
                    }`}
                  >
                    {lead.lead_status || "N/A"}
                  </Badge>
                </div>
                <InfoItem label="Lead Score" value={lead.lead_score} />
                <InfoItem
                  label="Assigned To"
                  value={(lead?.assigned_to as any)?.full_name || "N/A"}
                />
                <InfoItem label="Next Steps" value={lead.next_steps} />
                <InfoItem label="Comments/Notes" value={lead.comments} />
                <InfoItem
                  label="Customer Reference"
                  value={(lead.customer_reference as any)?.full_name || "N/A"}
                />
                <InfoItem
                  label="Created At"
                  value={
                    lead.createdAt
                      ? dayjs(lead.createdAt).format("DD-MMM-YYYY")
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          try {
            setDeleting(true);
            toast.loading("Deleting lead...");
            await leadService.delete(lead._id);
            toast.dismiss();
            toast.success(`Lead deleted successfully.`);
            setDeleteOpen(false);
            onClose();
            onUpdated?.();
            refreshData?.();
          } catch {
            toast.dismiss();
            toast.error("Failed to delete lead.");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
        title="Delete Lead"
        description={`Are you sure you want to delete this lead?`}
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
