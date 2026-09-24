"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Badge, Box, Flex, ActionIcon } from "rizzui";
import toast from "react-hot-toast";
import subscriptionPlanService from "@/services/subscriptionservice";
import { PiXBold } from "react-icons/pi";

export default function RenewModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchPlans();
  }, [isOpen]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await subscriptionPlanService.getList();
      setPlans(response.data);
    } catch (error) {
      toast.error("Failed to fetch subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: any) => {
    try {
      toast.loading("Redirecting to Stripe...");
      const data = await subscriptionPlanService.createStripeCheckout(
        plan.stripePriceId
      );
      window.location.href = data.session.url; // Redirect to Stripe checkout
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create Stripe session. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box className="p-6 space-y-6 rounded-lg bg-white shadow-md">
        {/* Header */}
        <Flex justify="between" align="center" className="border-b pb-4">
          <h2 className="text-xl font-semibold">Renew Subscription</h2>
          <ActionIcon
            size="sm"
            variant="text"
            onClick={onClose}
            className="text-gray-500 hover:!text-gray-900"
          >
            <PiXBold className="h-5 w-5" />
          </ActionIcon>
        </Flex>

        {/* Content */}
        <div className="space-y-4">
          {loading ? (
            <p>Loading plans...</p>
          ) : plans.length > 0 ? (
            plans.map((plan: any) => (
              <div
                key={plan._id}
                className="p-4 border rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                  <Badge className="mt-2 text-sm">
                    AED {plan.price} / {plan.interval}
                  </Badge>
                </div>
                <Button size="sm" onClick={() => handleSubscribe(plan)}>
                  Subscribe
                </Button>
              </div>
            ))
          ) : (
            <p>No plans available.</p>
          )}
        </div>
      </Box>
      {/* <div className="space-y-4">
        {loading ? (
          <p>Loading plans...</p>
        ) : plans.length > 0 ? (
          plans.map((plan: any) => (
            <div
              key={plan._id}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
                <Badge className="mt-2 text-sm">
                  AED {plan.price} / {plan.interval}
                </Badge>
              </div>
              <Button size="sm" onClick={() => handleSubscribe(plan)}>
                Subscribe
              </Button>
            </div>
          ))
        ) : (
          <p>No plans available.</p>
        )}
      </div> */}
    </Modal>
  );
}
