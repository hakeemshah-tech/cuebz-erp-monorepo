"use client";

import React, { useState } from "react";
import { Modal, Button, Input, Textarea, FileInput } from "rizzui";
import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import newsUpdateService from "@/services/newsUpdatesService";

export default function NewsUpdateModal({
  isOpen,
  onClose,
  fetchNews,
  editingNews,
}: any) {
  const methods = useForm({
    defaultValues: {
      news_title: editingNews?.news_title || "",
      news_description: editingNews?.news_description || "",
      image: null,
    },
  });

  const { register, handleSubmit, setValue } = methods;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("news_title", data.news_title);
      formData.append("news_description", data.news_description);
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      if (editingNews) {
        await newsUpdateService.edit(editingNews._id, formData);
        toast.success("News updated successfully!");
      } else {
        await newsUpdateService.create(formData);
        toast.success("News added successfully!");
      }

      fetchNews();
      onClose();
    } catch {
      toast.error("Failed to save news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingNews ? "Edit News" : "Add News"}
        </h3>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Title" {...register("news_title")} required />
            <Textarea label="Description" {...register("news_description")} />
            <FileInput label="Upload Image" {...register("image")} />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {editingNews ? "Update News" : "Add News"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}
