"use client";

import { Button } from "rizzui";
import { useRouter } from "next/navigation";
import { MdError } from "react-icons/md";

export default function SubscriptionFailed() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        <MdError className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-red-600 mt-4">
          Subscription Failed
        </h1>
        <p className="text-gray-700 mt-2">
          Unfortunately, we couldn’t process your subscription. Please try again
          or contact support if the issue persists.
        </p>
        <div className="flex gap-4 mt-6">
          <Button className="w-full" onClick={() => router.push("/renew")}>
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/support")}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
