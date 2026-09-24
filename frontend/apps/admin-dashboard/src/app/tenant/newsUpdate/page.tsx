"use client";

import React, { useState, useEffect } from "react";
import newsUpdateService from "@/services/newsUpdatesService";
import { Input, Button, Modal } from "rizzui";
import { FiSearch, FiClock, FiX } from "react-icons/fi";
import dayjs from "dayjs";
import PageHeader from "@/app/shared/page-header";

export default function NewsUpdatesPage() {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsUpdateService.getList({ search: searchQuery });
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    fetchNews();
  };

  const openNewsModal = (newsItem: any) => {
    setSelectedNews(newsItem);
    setModalOpen(true);
  };

  return (
    <div>
      <PageHeader title="News Updates" breadcrumb={[]} />
      <div className="max-w-screen-xl mx-auto p-6 pt-11">
        {/* <div className="flex items-center gap-2 mb-6">
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 border rounded-md"
          />
          <Button
            onClick={handleSearchSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiSearch className="mr-2" /> Search
          </Button>
        </div> */}

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length > 0 ? (
            news.map((item: any) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden"
                onClick={() => openNewsModal(item)}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt="News Image"
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.news_title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.news_description.length > 100
                      ? `${item.news_description.substring(0, 100)}...`
                      : item.news_description}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiClock className="mr-2" />
                    {dayjs(item.created_at).format("DD MMM YYYY, hh:mm A")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              No news updates found.
            </p>
          )}
        </div>

        {/* News Details Modal */}
        {selectedNews && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  📰 {(selectedNews as any).news_title}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  <FiX />
                </Button>
              </div>

              {selectedNews.image && (
                <img
                  src={selectedNews.image}
                  alt="News Image"
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              )}

              <p className="text-gray-700 text-base leading-relaxed">
                {selectedNews.news_description}
              </p>

              <div className="flex items-center text-gray-500 text-sm mt-4">
                <FiClock className="mr-2" />
                Published on{" "}
                {dayjs(selectedNews.created_at).format("DD MMM YYYY, hh:mm A")}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
