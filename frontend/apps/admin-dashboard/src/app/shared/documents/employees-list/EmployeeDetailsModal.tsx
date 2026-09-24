"use client";

import React from "react";
import { Box, Flex, Badge, ActionIcon } from "rizzui";
import { PiXBold } from "react-icons/pi";
import dayjs from "dayjs";
import { EmployeeType } from "@/types/employeeTypes";

type EmployeeDetailsModalProps = {
  employee: EmployeeType;
  closeModal?: () => void;
};

export default function EmployeeDetailsModal({
  employee,
  closeModal,
}: EmployeeDetailsModalProps) {
  return (
    <Box className="p-6 space-y-6 rounded-lg bg-white shadow-md">
      {/* Header */}
      <Flex justify="between" align="center" className="border-b pb-4">
        <h2 className="text-xl font-semibold">Employee Details</h2>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={closeModal}
          className="text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-5 w-5" />
        </ActionIcon>
      </Flex>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {/* Full Name */}
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.full_name || "N/A"}
          </p>
        </div>

        {/* Nationality */}
        <div>
          <p className="text-sm text-gray-500">Nationality</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.nationality || "N/A"}
          </p>
        </div>

        {/* Contact Number */}
        <div>
          <p className="text-sm text-gray-500">Contact Number</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.uae_contact_number || "N/A"}
          </p>
        </div>

        {/* Home Country Contact Number */}
        <div>
          <p className="text-sm text-gray-500">Home Country Contact Number</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.home_country_contact_number || "N/A"}
          </p>
        </div>

        {/* Emergency Contact Number */}
        <div>
          <p className="text-sm text-gray-500">Emergency Contact Number</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.emergency_contact_number || "N/A"}
          </p>
        </div>

        {/* Department */}
        <div>
          <p className="text-sm text-gray-500">Department</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.department || "N/A"}
          </p>
        </div>

        {/* Job Title */}
        <div>
          <p className="text-sm text-gray-500">Job Title</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.job_title || "N/A"}
          </p>
        </div>

        {/* Date of Joining */}
        <div>
          <p className="text-sm text-gray-500">Date of Joining</p>
          <p className="text-lg font-medium text-gray-900">
            {dayjs(employee.date_of_joining).isValid()
              ? dayjs(employee.date_of_joining).format("DD-MMM-YYYY")
              : "N/A"}
          </p>
        </div>

        {/* UAE Address */}
        <div>
          <p className="text-sm text-gray-500">UAE Address</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.uae_address || "N/A"}
          </p>
        </div>

        {/* Home Country Address */}
        {employee.home_country_address && (
          <div>
            <p className="text-sm text-gray-500">Home Country Address</p>
            <p className="text-lg font-medium text-gray-900">
              {employee.home_country_address || "N/A"}
            </p>
          </div>
        )}

        {/* Personal Email */}
        <div>
          <p className="text-sm text-gray-500">Personal Email</p>
          <p className="text-lg font-medium text-gray-900">
            {employee.personal_email || "N/A"}
          </p>
        </div>

        {/* Company Email */}
        {employee.company_email && (
          <div>
            <p className="text-sm text-gray-500">Company Email</p>
            <p className="text-lg font-medium text-gray-900">
              {employee.company_email || "N/A"}
            </p>
          </div>
        )}

        {/* Emergency Contact Information */}
        {employee.emergency_contact_info && (
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Emergency Contact</p>
            <p className="text-lg font-medium text-gray-900">
              Name: {employee.emergency_contact_info.name || "N/A"}
            </p>
            <p className="text-lg font-medium text-gray-900">
              Relationship:{" "}
              {employee.emergency_contact_info.relationship || "N/A"}
            </p>
            <p className="text-lg font-medium text-gray-900">
              Contact: {employee.emergency_contact_info.contact_number || "N/A"}
            </p>
          </div>
        )}

        {/* Comments */}
        {employee.comments && (
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Comments</p>
            <p className="text-lg font-medium text-gray-900">
              {employee.comments || "N/A"}
            </p>
          </div>
        )}
      </div>
    </Box>
  );
}
