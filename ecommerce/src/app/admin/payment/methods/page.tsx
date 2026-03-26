"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Settings,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  description: string;
  logoUrl: string | null;
  isActive: boolean;
  isDefault: boolean;
  config: any;
}

import { PageHeader } from "@/components/admin/PageHeader";

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [configuringMethod, setConfiguringMethod] =
    useState<PaymentMethod | null>(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments/methods");
      if (!res.ok) throw new Error("Failed to fetch methods");
      const data = await res.json();
      setMethods(data);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des modes de paiement");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (
    method: PaymentMethod,
    checked: boolean,
  ) => {
    try {
      setMethods(prev =>
        prev.map(m => (m.id === method.id ? { ...m, isActive: checked } : m)),
      );

      const res = await fetch("/api/admin/payments/methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: method.id, isActive: checked }),
      });

      if (!res.ok) throw new Error("Failed to update");
      toast.success(`${method.name} ${checked ? "activé" : "désactivé"}`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour");
      fetchMethods();
    }
  };

  const handleSetDefault = async (method: PaymentMethod) => {
    if (method.isDefault) return;
    try {
      setMethods(prev =>
        prev.map(m => ({ ...m, isDefault: m.id === method.id })),
      );

      const res = await fetch("/api/admin/payments/methods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: method.id,
          isDefault: true,
          isActive: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to set default");
      toast.success(`${method.name} défini par défaut`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la définition par défaut");
      fetchMethods();
    }
  };

  const getIcon = (code: string) => {
    switch (code) {
      case "mvola":
        return <Smartphone className="w-8 h-8 text-yellow-500" />;
      case "orange_money":
        return <Smartphone className="w-8 h-8 text-orange-500" />;
      case "airtel_money":
        return <Smartphone className="w-8 h-8 text-red-500" />;
      case "cash":
        return <Banknote className="w-8 h-8 text-green-500" />;
      default:
        return <CreditCard className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Modes de Paiement"
        description="Gérez les méthodes de paiement disponibles sur votre boutique."
        backHref="/admin/payment"
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {methods.map(method => (
            <Card
              key={method.id}
              className={cn(
                "border-none shadow-sm transition-all duration-300 overflow-hidden group",
                method.isActive
                  ? "bg-white dark:bg-gray-900 ring-1 ring-emerald-500/20 shadow-emerald-500/5"
                  : "bg-gray-50/50 dark:bg-gray-900/50 opacity-75 grayscale-[0.5]",
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300",
                      method.isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/20 shadow-sm"
                        : "bg-gray-200 dark:bg-gray-800",
                    )}
                  >
                    {getIcon(method.code)}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      {method.name}
                      {method.isDefault && (
                        <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-none rounded-lg text-[10px] uppercase font-bold tracking-wider">
                          Par défaut
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm mt-0.5 line-clamp-1">
                      {method.description}
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={method.isActive}
                  onCheckedChange={checked =>
                    handleToggleActive(method, checked)
                  }
                  className="data-[state=checked]:bg-emerald-500"
                />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {method.isActive ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Disponible au checkout
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      Désactivé pour les clients
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 py-4 flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetDefault(method)}
                  disabled={method.isDefault || !method.isActive}
                  className="rounded-xl h-9 font-medium hover:bg-white dark:hover:bg-gray-800"
                >
                  {method.isDefault ? <Check className="w-4 h-4 mr-2" /> : null}
                  {method.isDefault ? "Principal" : "Définir principal"}
                </Button>

                <Dialog
                  open={configuringMethod?.id === method.id}
                  onOpenChange={open => !open && setConfiguringMethod(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfiguringMethod(method)}
                      className="rounded-xl h-9 font-medium border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configurer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        Configuration {method.name}
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        Paramétrez vos identifiants API pour sécuriser vos
                        transactions.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                      {method.code === "mvola" && (
                        <>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="merchantId"
                              className="text-sm font-bold uppercase tracking-wider text-gray-500"
                            >
                              ID Marchand
                            </Label>
                            <Input
                              id="merchantId"
                              defaultValue={method.config?.merchantId || ""}
                              placeholder="ex: 123456"
                              className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus-visible:ring-indigo-500"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="apiKey"
                              className="text-sm font-bold uppercase tracking-wider text-gray-500"
                            >
                              Clé API (Consumer Key)
                            </Label>
                            <Input
                              id="apiKey"
                              type="password"
                              defaultValue={method.config?.apiKey || ""}
                              className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus-visible:ring-indigo-500"
                            />
                          </div>
                        </>
                      )}

                      {method.code === "stripe" && (
                        <>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="publicKey"
                              className="text-sm font-bold uppercase tracking-wider text-gray-500"
                            >
                              Clé Publique
                            </Label>
                            <Input
                              id="publicKey"
                              defaultValue={method.config?.publicKey || ""}
                              placeholder="pk_test_..."
                              className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus-visible:ring-indigo-500"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label
                              htmlFor="secretKey"
                              className="text-sm font-bold uppercase tracking-wider text-gray-500"
                            >
                              Clé Secrète
                            </Label>
                            <Input
                              id="secretKey"
                              type="password"
                              defaultValue={method.config?.secretKey || ""}
                              placeholder="sk_test_..."
                              className="h-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus-visible:ring-indigo-500"
                            />
                          </div>
                        </>
                      )}

                      {(method.code === "orange_money" ||
                        method.code === "airtel_money" ||
                        method.code === "cash") && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm flex items-center gap-3">
                          <Settings className="w-5 h-5 shrink-0" />
                          Aucune configuration supplémentaire requise pour ce
                          mode de paiement.
                        </div>
                      )}
                    </div>

                    <DialogFooter className="gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setConfiguringMethod(null)}
                        className="rounded-xl h-12 px-6"
                      >
                        Annuler
                      </Button>
                      <Button
                        className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                        onClick={async () => {
                          const config: any = {};
                          if (method.code === "mvola") {
                            config.merchantId = (
                              document.getElementById(
                                "merchantId",
                              ) as HTMLInputElement
                            ).value;
                            config.apiKey = (
                              document.getElementById(
                                "apiKey",
                              ) as HTMLInputElement
                            ).value;
                          } else if (method.code === "stripe") {
                            config.publicKey = (
                              document.getElementById(
                                "publicKey",
                              ) as HTMLInputElement
                            ).value;
                            config.secretKey = (
                              document.getElementById(
                                "secretKey",
                              ) as HTMLInputElement
                            ).value;
                          }

                          try {
                            const res = await fetch(
                              "/api/admin/payments/methods",
                              {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  id: method.id,
                                  config,
                                }),
                              },
                            );

                            if (!res.ok) throw new Error("Update failed");
                            toast.success("Configuration mise à jour");
                            setConfiguringMethod(null);
                            fetchMethods();
                          } catch (error) {
                            toast.error(
                              "Erreur lors de la sauvegarde de la configuration",
                            );
                          }
                        }}
                      >
                        Enregistrer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
