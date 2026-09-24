"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tab, Button, Text } from "rizzui";
import customerService from "@/services/customerService";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { MdArrowBack } from "react-icons/md";

export default function CustomerDetailsPage() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id }: { id: string } = useParams();

  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await customerService.getById(id);
      if (response?.data) {
        setCustomer(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch customer details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-600">
          Customer details not found.
        </h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="px-4 py-2"
          >
            <MdArrowBack className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Details
          </h1>
        </div>
        <Button
          className="text-sm px-4 py-2 bg-primary text-white hover:bg-primary-dark"
          onClick={() =>
            router.push(`/tenant/customers-vendors/customer/${id}/edit`)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.293.195l-4 1.5a1 1 0 01-1.272-1.272l1.5-4a1 1 0 01.195-.293l9.9-9.9a2 2 0 012.828 0z" />
          </svg>
          Edit
        </Button>
      </div>

      <Tab>
        <Tab.List className="border-b mb-6 text-sm font-medium text-gray-600">
          <Tab.ListItem>Personal</Tab.ListItem>
          <Tab.ListItem>Address</Tab.ListItem>
          <Tab.ListItem>Additional</Tab.ListItem>
        </Tab.List>

        <Tab.Panels className="grid gap-6">
          {/* Personal Info */}
          <Tab.Panel>
            <DetailsGrid
              items={[
                { label: "Full Name", value: customer.full_name },
                { label: "Email", value: customer.email },
                { label: "Phone Number", value: customer.phone_number },
                {
                  label: "Date of Birth",
                  value: formatDate(customer.date_of_birth),
                },
                { label: "Customer Type", value: customer.customer_type },
                {
                  label: "Assigned To",
                  value: customer.assigned_to?.full_name || "N/A",
                },
              ]}
            />
          </Tab.Panel>

          {/* Address */}
          <Tab.Panel>
            <DetailsGrid
              items={[
                { label: "Street", value: customer.address?.street },
                { label: "City", value: customer.address?.city },
                { label: "State", value: customer.address?.state },
                { label: "Postal Code", value: customer.address?.postal_code },
                { label: "Country", value: customer.address?.country },
              ]}
            />
          </Tab.Panel>

          {/* Additional Info */}
          <Tab.Panel>
            <DetailsGrid
              items={[
                { label: "Created By", value: customer.createdBy?.name },
                { label: "Created At", value: formatDate(customer.createdAt) },
                { label: "Updated At", value: formatDate(customer.updatedAt) },
              ]}
            />
            <div className="mt-6">
              <Text className="text-sm font-medium text-gray-600 mb-1">
                Notes
              </Text>
              <div className="text-gray-800 text-sm whitespace-pre-line">
                {customer.notes || "No notes available."}
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab>
    </div>
  );
}

/* Utility function */
function formatDate(dateString: string) {
  return dateString ? dayjs(dateString).format("DD-MMM-YYYY") : "N/A";
}

/* Grid display */
function DetailsGrid({
  items,
}: {
  items: { label: string; value?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col text-xs sm:text-sm gap-1">
          <span className="text-gray-500 text-xs font-medium">{label}</span>
          <span className="text-gray-800 text-base font-semibold truncate">
            {value || "N/A"}
          </span>
        </div>
      ))}
    </div>
  );
}
