"use client";

import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input, Select, Textarea, Button, ActionIcon, Table } from "rizzui";
import { DatePicker } from "@core/ui/datepicker";
import { PiTrashBold, PiEyeBold, PiPlusBold } from "react-icons/pi";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import customerService from "@/services/customerService.ts";

// Load PDF preview component dynamically
const PDFPreviewModal = dynamic(() => import("./preview.tsx"), { ssr: false });

export default function QuotationForm({ filePreviews, setFilePreviews }: any) {
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();

  const [customerOptions, setCustomerOptions] = useState([]);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerService.getList();
        const options = response.data.map((customer: any) => ({
          value: customer._id,
          label: customer.full_name,
        }));
        setCustomerOptions(options);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchCustomers();

    // Generate a unique proposal number
    generateProposalNumber();
  }, []);

  // Generate a unique proposal number
  const generateProposalNumber = () => {
    const timestamp = new Date().getTime().toString().slice(-6); // Get last 6 digits of timestamp
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate 4 random digits
    const proposalNumber = `QTN-${timestamp}-${randomDigits}`;
    setValue("proposal_number", proposalNumber);
  };

  // Add Item to Quotation
  const addItem = () => {
    const currentItems = getValues("items") || [];
    setValue("items", [
      ...currentItems,
      {
        item_name: "",
        description: "",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      },
    ]);
  };

  // Remove Item
  const removeItem = (index: number) => {
    const updatedItems = [...getValues("items")];
    updatedItems.splice(index, 1);
    setValue("items", updatedItems);
  };

  // Calculate Total Price for Each Item
  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...getValues("items")];
    updatedItems[index][field] = value;
    if (field === "quantity" || field === "unit_price") {
      updatedItems[index]["total_price"] =
        updatedItems[index]["quantity"] * updatedItems[index]["unit_price"];
    }
    setValue("items", updatedItems);
    calculateTotals();
  };

  // Calculate Subtotal, VAT, and Total Amount
  const calculateTotals = () => {
    const items = getValues("items") || [];
    const subtotal = items.reduce(
      (acc: any, item: any) => acc + item.total_price,
      0
    );
    const vat = subtotal * 0.05; // Assuming 5% VAT
    const total = subtotal + vat;
    setValue("subtotal", subtotal);
    setValue("vat", vat);
    setValue("total_amount", total);
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold mb-4">Quotation Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Proposal Number"
          {...register("proposal_number")}
          error={errors.proposal_number?.message?.toString()}
          disabled
        />

        <Select
          label="Customer"
          placeholder="Select Customer"
          options={customerOptions}
          value={
            customerOptions.find(
              (option: any) => option.value === watch("customer_id")
            ) || null
          }
          onChange={(option: any) =>
            setValue("customer_id", option?.value || "")
          }
          error={errors.customer_id?.message?.toString()}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Proposal Date
          </label>
          <DatePicker
            selected={
              watch("proposal_date")
                ? new Date(watch("proposal_date"))
                : new Date()
            }
            onChange={(date: Date | null) =>
              setValue("proposal_date", date?.toISOString() || "")
            }
            error={errors.proposal_date?.message?.toString()}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Expiry Date
          </label>
          <DatePicker
            selected={
              watch("proposal_expiry_date")
                ? new Date(watch("proposal_expiry_date"))
                : null
            }
            onChange={(date: Date | null) =>
              setValue("proposal_expiry_date", date?.toISOString() || "")
            }
            error={errors.proposal_expiry_date?.message?.toString()}
          />
        </div>

        <Input
          label="Proposal Title"
          {...register("proposal_title")}
          error={errors.proposal_title?.message?.toString()}
        />

        <Input
          label="Proposal Details"
          {...register("proposal_details")}
          error={errors.proposal_details?.message?.toString()}
        />
      </div>

      <hr className="my-8 border-gray-300" />

      <h3 className="text-lg font-semibold mb-4">Quotation Items</h3>
      <Table className="mb-4">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {watch("items")?.map((item: any, index: number) => (
            <tr key={index}>
              <td>
                <Input
                  value={item.item_name}
                  onChange={(e) =>
                    handleItemChange(index, "item_name", e.target.value)
                  }
                />
              </td>
              <td>
                <Input
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", Number(e.target.value))
                  }
                />
              </td>
              <td>
                <Input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "unit_price",
                      Number(e.target.value)
                    )
                  }
                />
              </td>
              <td>{item.total_price.toFixed(2)}</td>
              <td>
                <ActionIcon
                  size="sm"
                  color="danger"
                  onClick={() => removeItem(index)}
                >
                  <PiTrashBold className="w-5 h-5" />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="outline" onClick={addItem}>
        <PiPlusBold className="mr-1" /> Add Item
      </Button>

      <hr className="my-8 border-gray-300" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Subtotal" value={watch("subtotal")} disabled />
        <Input label="VAT (5%)" value={watch("vat")} disabled />
        <Input label="Total Amount" value={watch("total_amount")} disabled />
      </div>

      <hr className="my-8 border-gray-300" />

      <Textarea
        label="Payment Terms"
        {...register("payment_terms")}
        error={errors.payment_terms?.message?.toString()}
      />

      <Textarea
        label="terms & Condition"
        {...register("termsCondition")}
        error={errors.termsCondition?.message?.toString()}
      />

      <Textarea
        label="Comments"
        placeholder="Enter any additional comments..."
        {...register("comments")}
        error={errors.comments?.message?.toString()}
      />

      <Button
        variant="outline"
        className="mt-4"
        onClick={() => setShowPDFPreview(true)}
      >
        <PiEyeBold className="mr-2" /> Preview Quotation PDF
      </Button>

      {showPDFPreview && (
        <PDFPreviewModal
          data={getValues()}
          onClose={() => setShowPDFPreview(false)}
        />
      )}
    </div>
  );
}
