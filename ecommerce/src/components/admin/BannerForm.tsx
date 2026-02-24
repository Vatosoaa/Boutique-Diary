"use client";

import React, { useState, useEffect } from "react";
import { Banner } from "@/types/banner";
import { X, Save } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";

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
    bgColor: "",
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
        bgColor: initialData.bgColor || "",
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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image de la bannière *
          </label>
          <div className="relative" style={{ width: "200px", height: "200px" }}>
            <ImageUploader
              value={formData.imageUrl || undefined}
              onChange={(url: string | null) =>
                setFormData({ ...formData, imageUrl: url || "" })
              }
              aspectRatio="square"
              maxSize={10}
              showUrlInput={false}
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
            Couleur de fond personnalisée
          </label>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <input
                type="color"
                value={formData.bgColor || "#ffffff"}
                onChange={(e) =>
                  setFormData({ ...formData, bgColor: e.target.value })
                }
                className="w-10 h-10 rounded-lg border-2 border-white dark:border-gray-700 shadow-sm cursor-pointer overflow-hidden p-0"
              />
              <div className="absolute inset-0 rounded-lg ring-1 ring-black/5 pointer-events-none"></div>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={formData.bgColor}
                onChange={(e) =>
                  setFormData({ ...formData, bgColor: e.target.value })
                }
                placeholder="Par défaut (Thème)"
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-mono text-xs"
              />
              {formData.bgColor && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bgColor: "" })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Réinitialiser"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
            Optionnel. Si vide, la couleur par défaut du thème (`--hero-bg`)
            sera utilisée.
          </p>
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
