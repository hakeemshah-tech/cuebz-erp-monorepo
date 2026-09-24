"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  rolesUserSchema,
  RolesUserSchema,
} from "@/validators/rolesUser.schema";
import { useSearchParams, useRouter } from "next/navigation";
import rolesUserService from "@/services/rolesUserService";
import Form from "./form";
import { defaultValues } from "./form-utils";
import toast from "react-hot-toast";
import FormFooter from "@core/components/form-footer";
import { routesTenant } from "@/config/routes";
import employeeService from "@/services/employeeService";

interface ICreateEditRolesUser {
  slug?: string;
  rolesUser?: any;
}

export default function CreateEditRolesUser({
  slug,
  rolesUser,
}: ICreateEditRolesUser) {
  const [isLoading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);

  const methods = useForm<RolesUserSchema>({
    resolver: zodResolver(rolesUserSchema),
    defaultValues: defaultValues(rolesUser),
  });

  const { setValue, watch, register } = methods;
  const router = useRouter();
  const searchParams = useSearchParams();
  const rolesUserId = slug || searchParams.get("id");

  useEffect(() => {
    if (rolesUserId) {
      fetchRolesUserDetails();
    }
  }, [rolesUserId]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔹 Explicitly register `employee_id`
  useEffect(() => {
    register("employee_id", { required: "Employee selection is required." });
  }, [register]);

  const fetchRolesUserDetails = async () => {
    setLoading(true);
    try {
      const response = await rolesUserService.getById(rolesUserId);
      if (response?.data) {
        methods.reset(defaultValues(response.data));

        // Ensure `employee_id` is set correctly
        setValue("employee_id", response.data.employee_id || "");
        setValue("email", response.data.email || "");
        setValue("name", response.data.name || "");
      }
    } catch (error) {
      toast.error("Failed to fetch roles user details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getList();
      const options = response.data.map((employee: any) => ({
        value: employee._id,
        label: employee.full_name,
        email: employee.personal_email,
        name: employee.full_name,
      }));

      setEmployeeOptions(options);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const onSubmit = async (data: RolesUserSchema) => {
    setLoading(true);

    try {
      const payload = {
        employee_id: data.employee_id, // 🔹 Ensure `employee_id` is passed
        name: data.name,
        email: data.email,
        accessible_modules: data.accessible_modules,
      };

      if (!payload.employee_id) {
        toast.error("Employee selection is required.");
        setLoading(false);
        return;
      }

      if (rolesUserId) {
        const editData = {
          userId: rolesUserId,
          name: payload.name,
          accessible_modules: payload.accessible_modules,
          // ...payload,
        };
        await rolesUserService.updateRoleAndModules(editData);
        toast.success("Roles user updated successfully.");
      } else {
        await rolesUserService.assignRole(payload);
        toast.success("Roles user created successfully.");
      }
      router.push(routesTenant.rolesUser.roleUserList);
    } catch (error) {
      toast.error("Failed to save roles user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="min-h-[79vh] flex flex-col p-6"
        >
          {/* Form Content */}
          <div className="flex-1">
            <Form isEditing={!!rolesUserId} employeeOptions={employeeOptions} />
          </div>

          {/* Footer at bottom */}
          <div className="border-muted">
            <FormFooter
              isLoading={isLoading}
              submitBtnText={rolesUserId ? "Update" : "Create"}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
