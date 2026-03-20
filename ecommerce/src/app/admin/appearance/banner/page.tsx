"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import BannerList from "@/components/admin/BannerList";
import BannerForm from "@/components/admin/BannerForm";
import { Banner } from "@/types/banner";

export default function BannerPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreate = () => {
    setSelectedBanner(null);
    setShowForm(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedBanner(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedBanner(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bannières
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les bannières affichées sur la page d&apos;accueil.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle bannière
          </button>
        )}
      </div>

      <div className="mt-6">
        {showForm ? (
          <BannerForm
            initialData={selectedBanner}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <BannerList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        )}
      </div>
    </div>
  );
}
