"use client";

import { Button } from "rizzui";
import { useRouter } from "next/navigation";
import { MdCheckCircle } from "react-icons/md";

export default function SubscriptionSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        <MdCheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-green-600 mt-4">
          Subscription Successful!
        </h1>
        <p className="text-gray-700 mt-2">
          Your subscription has been activated. You can now enjoy all the
          features of your plan.
        </p>
        <Button className="mt-6 w-full" onClick={() => router.push("/tenant")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
