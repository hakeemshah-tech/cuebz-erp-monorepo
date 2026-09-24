// "use client";

// import { useState, useEffect } from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import { useSearchParams, useRouter } from "next/navigation";
// import visitorLogService from "@/services/visitorLogService";
// import Form from "./form";
// import { defaultValues } from "./form-utils";
// import toast from "react-hot-toast";
// import FormFooter from "@core/components/form-footer";

// interface ICreateEditVisitorLog {
//   slug?: string;
//   visitor?: any;
// }

// export default function CreateEditVisitorLog({
//   slug,
//   visitor,
// }: ICreateEditVisitorLog) {
//   const [isLoading, setLoading] = useState(false);
//   const methods = useForm({
//     defaultValues: defaultValues(visitor),
//   });
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const visitorId = slug || searchParams.get("id");

//   useEffect(() => {
//     if (visitorId) {
//       fetchVisitorDetails();
//     }
//   }, [visitorId]);

//   const fetchVisitorDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await visitorLogService.getById(visitorId);
//       if (response) {
//         methods.reset(defaultValues(response.data));
//       }
//     } catch (error) {
//       toast.error("Failed to fetch visitor details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (data: any) => {
//     setLoading(true);

//     try {
//       if (visitorId) {
//         await visitorLogService.edit(visitorId, data);
//         toast.success("Visitor log updated successfully.");
//       } else {
//         await visitorLogService.create(data);
//         toast.success("Visitor log created successfully.");
//       }
//       router.push("/dashboard/visitor-log");
//     } catch (error) {
//       toast.error("Failed to save visitor log.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <FormProvider {...methods}>
//         <form onSubmit={methods.handleSubmit(onSubmit)}>
//           <Form />
//           <FormFooter
//             isLoading={isLoading}
//             submitBtnText={visitorId ? "Update" : "Create"}
//           />
//         </form>
//       </FormProvider>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  visitorLogSchema,
  VisitorLogSchema,
} from "@/validators/visitorLog.schema";
import { useSearchParams, useRouter } from "next/navigation";
import visitorLogService from "@/services/visitorLogService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";

interface ICreateEditVisitorLog {
  slug?: string;
  visitor?: any;
}

export default function CreateEditVisitorLog({
  slug,
  visitor,
}: ICreateEditVisitorLog) {
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<VisitorLogSchema>({
    resolver: zodResolver(visitorLogSchema),
    defaultValues: defaultValues(visitor),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitorId = slug || searchParams.get("id");

  useEffect(() => {
    if (visitorId) {
      fetchVisitorDetails();
    }
  }, [visitorId]);

  const fetchVisitorDetails = async () => {
    setLoading(true);
    try {
      const response = await visitorLogService.getById(visitorId);
      if (response) {
        methods.reset(defaultValues(response.data));
      }
    } catch (error) {
      toast.error("Failed to fetch visitor details.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: VisitorLogSchema) => {
    setLoading(true);

    if (!data.person_visiting) {
      delete data.person_visiting;
    }

    try {
      if (visitorId) {
        await visitorLogService.edit(visitorId, data);
        toast.success("Visitor log updated successfully.");
      } else {
        await visitorLogService.create(data);
        toast.success("Visitor log created successfully.");
      }
      router.push("/tenant/reception/visitor-log");
    } catch (error) {
      toast.error("Failed to save visitor log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="bg-white min-h-max">
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="min-h-[79vh] flex flex-col p-6"
        >
          <div className="flex-1">
            <Form />
          </div>

          <div className="border-muted">
            <FormFooter
              isLoading={isLoading}
              submitBtnText={visitorId ? "Update" : "Create"}
            />
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
