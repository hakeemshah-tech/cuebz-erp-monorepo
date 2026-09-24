"use client";

import React from "react";
import { Button, Modal, Text, Title } from "rizzui";

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

/**
 * Blocking confirmation dialog for destructive actions that need more weight
 * than the inline row popover (deleting a record from its detail page, for
 * instance, where there is no row to fall back to).
 */
export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm delete",
  description = "This action cannot be undone.",
  loading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <Title as="h4" className="mb-2 text-lg font-semibold">
          {title}
        </Title>
        <Text className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {description}
        </Text>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button color="danger" isLoading={loading} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
