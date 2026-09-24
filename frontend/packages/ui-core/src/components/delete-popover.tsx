"use client";

import React, { useState } from "react";
import { ActionIcon, Button, Popover, Text, Title, Tooltip } from "rizzui";

export interface DeletePopoverProps {
  title: string;
  description: string;
  onDelete: () => void | Promise<void>;
}

/**
 * Inline confirm-before-delete affordance for table row actions.
 *
 * `onDelete` may be async; the button stays in a loading state until it
 * settles, and the popover closes only on success so a failed delete leaves
 * the confirmation open for a retry.
 */
export default function DeletePopover({
  title,
  description,
  onDelete,
}: DeletePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await onDelete();
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Popover placement="left" isOpen={isOpen} setIsOpen={setIsOpen}>
      <Popover.Trigger>
        <ActionIcon
          as="span"
          size="sm"
          variant="outline"
          className="cursor-pointer hover:!border-red-600 hover:text-red-600"
          aria-label={title}
        >
          <Tooltip content="Delete" placement="top" color="invert">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6.5h16M9.5 6.5V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
              <path d="M6.5 6.5 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-12.5" />
              <path d="M10.5 10.5v6M13.5 10.5v6" />
            </svg>
          </Tooltip>
        </ActionIcon>
      </Popover.Trigger>

      <Popover.Content className="z-50 w-64 p-4">
        <Title as="h6" className="mb-1 text-sm font-semibold">
          {title}
        </Title>
        <Text className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {description}
        </Text>

        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            color="danger"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
