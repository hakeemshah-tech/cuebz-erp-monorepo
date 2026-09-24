"use client";

import React, { useState, useEffect, useCallback } from "react";
import newsUpdateService from "@/services/newsUpdatesService";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { ActionIcon, Flex, Tooltip, Button } from "rizzui";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { debounce } from "lodash";
import DeletePopover from "@core/components/delete-popover";
import NewsUpdateModal from "@/app/shared/newsUpdates/NewsUpdateModal";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import Image from "next/image";

export default function AdminNewsTable() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsUpdateService.getList({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });
      const responseData = response?.data || [];
      const totalCount = response?.pagination?.total || 0;

      setNews(responseData);
      setPagination((prev) => ({ ...prev, totalCount }));
    } catch (error: any) {
      toast.error("Failed to fetch news updates.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchNews = useCallback(debounce(fetchNews, 300), [
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    debouncedFetchNews();
    return () => debouncedFetchNews.cancel();
  }, [debouncedFetchNews]);

  const handleCreate = () => {
    setEditingNews(null);
    setModalOpen(true);
  };

  const handleEdit = (newsItem: any) => {
    setEditingNews(newsItem);
    setModalOpen(true);
  };

  const { table } = useTanStackTable({
    tableData: news,
    columnConfig: [
      { accessorKey: "news_title", header: "Title" },
      {
        accessorKey: "news_description",
        header: "Description",
        cell: ({ row }: any) => (
          <span className="line-clamp-2">{row.original.news_description}</span>
        ),
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }: any) =>
          row.original.image ? (
            <img
              src={row.original.image}
              alt="News Image"
              className="w-16 h-16 object-cover rounded-md"
            />
          ) : (
            "N/A"
          ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }: any) =>
          dayjs(row.original.createdAt).isValid()
            ? dayjs(row.original.createdAt).format("DD-MMM-YYYY")
            : "N/A",
      },
      {
        accessorKey: "action",
        header: "Actions",
        cell: ({ row }: any) => (
          <Flex align="center" justify="end" className="pe-4 gap-2">
            <Tooltip content="Edit" placement="top" color="invert">
              <ActionIcon
                as="span"
                size="sm"
                variant="outline"
                onClick={() => handleEdit(row.original)}
              >
                <FiEdit />
              </ActionIcon>
            </Tooltip>

            <DeletePopover
              title={`Delete News`}
              description={`Are you sure you want to delete "${row.original.news_title}"?`}
              onDelete={async () => {
                try {
                  await newsUpdateService.delete(row.original._id);
                  toast.success("News deleted successfully.");
                  fetchNews();
                } catch {
                  toast.error("Failed to delete news.");
                }
              }}
            />
          </Flex>
        ),
      },
    ],
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">News & Events</h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleCreate}
        >
          <FiPlus className="mr-2" /> Add News
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <Table table={table} variant="modern" />
          <TablePagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            totalCount={pagination.totalCount}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, pageIndex: page }))
            }
            onPageSizeChange={(size) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: size,
                pageIndex: 0,
              }))
            }
          />
        </>
      )}

      {modalOpen && (
        <NewsUpdateModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          fetchNews={fetchNews}
          editingNews={editingNews}
        />
      )}
    </div>
  );
}
