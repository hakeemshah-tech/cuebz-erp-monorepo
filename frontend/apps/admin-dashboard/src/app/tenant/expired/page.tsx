"use client";

import { useRouter } from "next/navigation";
import { Button } from "rizzui";
import { MdWarning } from "react-icons/md";
import RenewModal from "@/app/shared/subscriptionRenewModal";
import { useState } from "react";

export default function SubscriptionExpiredPage() {
  const router = useRouter();
  const [isRenewModalOpen, setRenewModalOpen] = useState(false);

  const closeRenewModal = () => {
    setRenewModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-6 text-center">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <MdWarning className="text-red-500 text-6xl" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          Your Subscription Has Expired
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          To continue accessing your account and services, please renew your
          subscription.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="solid"
            color="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => setRenewModalOpen(true)}
          >
            Renew Subscription
          </Button>
          <Button
            variant="outline"
            // color="gray"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push("/support")}
          >
            Contact Support
          </Button>
        </div>
      </div>
      <RenewModal isOpen={isRenewModalOpen} onClose={closeRenewModal} />
    </div>
  );
}
