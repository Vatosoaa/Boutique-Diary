"use client";

import React, { useState, useEffect } from "react";
import { Banner } from "@/types/banner";
import { X, Save, Image as ImageIcon } from "lucide-react";

interface BannerFormProps {
  initialData?: Banner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BannerForm({
  initialData,
  onSuccess,
  onCancel,
}: BannerFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    imageUrl: "",
    order: 1,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subtitle: initialData.subtitle || "",
        description: initialData.description || "",
        buttonText: initialData.buttonText || "",
        buttonLink: initialData.buttonLink || "",
        imageUrl: initialData.imageUrl,
        order: initialData.order,
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = initialData
        ? `/api/banners/${initialData.id}`
        : "/api/banners";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {initialData ? "Modifier la bannière" : "Nouvelle bannière"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Titre & Sous-titre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre principal *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="Ex: CUSTOMIZED"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sous-titre
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="Ex: FASHION"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            placeholder="Description de la bannière..."
          />
        </div>

        {/* Bouton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Texte du bouton
            </label>
            <input
              type="text"
              value={formData.buttonText}
              onChange={(e) =>
                setFormData({ ...formData, buttonText: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="Ex: SHOP NOW"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lien du bouton
            </label>
            <input
              type="text"
              value={formData.buttonLink}
              onChange={(e) =>
                setFormData({ ...formData, buttonLink: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="Ex: /shop?category=women"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URL de l'image *
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              required
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="https://..."
            />
          </div>
          {formData.imageUrl && (
            <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden border border-gray-200">
              <img
                src={formData.imageUrl}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Order & Active */}
        <div className="flex gap-6 pt-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ordre d'affichage
            </label>
            <input
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bannière active
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
