"use client";

import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

export type PaymentMethod = "mvola" | "orange_money" | "airtel_money" | "card";

interface PaymentMethodsProps {
  selected: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  mvolaPhone: string;
  onMvolaPhoneChange: (phone: string) => void;
  mvolaName: string;
  onMvolaNameChange: (name: string) => void;
  orangePhone: string;
  onOrangePhoneChange: (phone: string) => void;
  orangeName: string;
  onOrangeNameChange: (name: string) => void;
  airtelPhone: string;
  onAirtelPhoneChange: (phone: string) => void;
  airtelName: string;
  onAirtelNameChange: (name: string) => void;
}

// Logos SVG inline pour chaque opérateur
const MVolaLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
    <circle cx="20" cy="20" r="20" fill="#FFD200" />
    <text
      x="50%"
      y="55%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="#00A651"
      fontSize="22"
      fontWeight="900"
      fontFamily="Arial-Black, Arial, sans-serif"
    >
      M
    </text>
  </svg>
);

const OrangeLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
    <circle cx="20" cy="20" r="20" fill="#FF6600" />
    <text
      x="50%"
      y="55%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontSize="7"
      fontWeight="bold"
      fontFamily="Arial"
    >
      Orange
    </text>
  </svg>
);

const AirtelLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
    <circle cx="20" cy="20" r="20" fill="#ED1C24" />
    <text
      x="50%"
      y="55%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontSize="7"
      fontWeight="bold"
      fontFamily="Arial"
    >
      Airtel
    </text>
  </svg>
);

interface MobileFormProps {
  title: string;
  nameLabel: string;
  phoneLabel: string;
  phonePlaceholder: string;
  name: string;
  onNameChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  accentColor: string;
}

// Reusable mobile payment form
function MobilePaymentForm({
  title,
  nameLabel,
  phoneLabel,
  phonePlaceholder,
  name,
  onNameChange,
  phone,
  onPhoneChange,
  accentColor,
}: MobileFormProps) {
  return (
    <div className="animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-secondary/5 border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-4 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
            style={{ backgroundColor: accentColor }}
          >
            1
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">
              Après avoir cliqué sur &quot;Payer&quot;, vous recevrez une
              notification sur votre téléphone pour valider la transaction avec
              votre code secret.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            {nameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ex: RAKOTO Jean"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            {phoneLabel}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder={phonePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
          />
        </div>
      </div>
    </div>
  );
}

interface PaymentCardProps {
  id: PaymentMethod;
  selected: PaymentMethod | null;
  onClick: () => void;
  logo: React.ReactNode;
  name: string;
  subtitle: string;
  accentColor: string;
}

// Reusable payment card button
function PaymentCard({
  id,
  selected,
  onClick,
  logo,
  name,
  subtitle,
  accentColor,
}: PaymentCardProps) {
  const isSelected = selected === id;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-4",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/50",
      )}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: isSelected ? accentColor + "22" : "#f3f4f6" }}
      >
        {logo}
      </div>
      <div>
        <p className="font-bold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {isSelected && (
        <div
          className="absolute top-3 right-3 w-3 h-3 rounded-full ring-2 ring-background"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </button>
  );
}

export default function PaymentMethods({
  selected,
  onChange,
  mvolaPhone,
  onMvolaPhoneChange,
  mvolaName,
  onMvolaNameChange,
  orangePhone,
  onOrangePhoneChange,
  orangeName,
  onOrangeNameChange,
  airtelPhone,
  onAirtelPhoneChange,
  airtelName,
  onAirtelNameChange,
}: PaymentMethodsProps) {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-xl text-foreground">Moyen de paiement</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PaymentCard
          id="mvola"
          selected={selected}
          onClick={() => onChange("mvola")}
          logo={<MVolaLogo />}
          name="MVola"
          subtitle="Paiement mobile instantané"
          accentColor="#E31837"
        />

        <PaymentCard
          id="orange_money"
          selected={selected}
          onClick={() => onChange("orange_money")}
          logo={<OrangeLogo />}
          name="Orange Money"
          subtitle="Paiement mobile Orange"
          accentColor="#FF6600"
        />

        <PaymentCard
          id="airtel_money"
          selected={selected}
          onClick={() => onChange("airtel_money")}
          logo={<AirtelLogo />}
          name="Airtel Money"
          subtitle="Paiement mobile Airtel"
          accentColor="#ED1C24"
        />

        <PaymentCard
          id="card"
          selected={selected}
          onClick={() => onChange("card")}
          logo={<CreditCard className="w-5 h-5 text-muted-foreground" />}
          name="Carte Bancaire"
          subtitle="Visa, Mastercard"
          accentColor="#6366f1"
        />
      </div>

      {/* MVola form */}
      {selected === "mvola" && (
        <MobilePaymentForm
          title="Confirmation MVola"
          nameLabel="Nom complet du titulaire"
          phoneLabel="Numéro MVola à débiter"
          phonePlaceholder="Ex: 034 12 345 67"
          name={mvolaName}
          onNameChange={onMvolaNameChange}
          phone={mvolaPhone}
          onPhoneChange={onMvolaPhoneChange}
          accentColor="#E31837"
        />
      )}

      {/* Orange Money form */}
      {selected === "orange_money" && (
        <MobilePaymentForm
          title="Confirmation Orange Money"
          nameLabel="Nom complet du titulaire"
          phoneLabel="Numéro Orange Money à débiter"
          phonePlaceholder="Ex: 032 12 345 67"
          name={orangeName}
          onNameChange={onOrangeNameChange}
          phone={orangePhone}
          onPhoneChange={onOrangePhoneChange}
          accentColor="#FF6600"
        />
      )}

      {/* Airtel Money form */}
      {selected === "airtel_money" && (
        <MobilePaymentForm
          title="Confirmation Airtel Money"
          nameLabel="Nom complet du titulaire"
          phoneLabel="Numéro Airtel Money à débiter"
          phonePlaceholder="Ex: 033 12 345 67"
          name={airtelName}
          onNameChange={onAirtelNameChange}
          phone={airtelPhone}
          onPhoneChange={onAirtelPhoneChange}
          accentColor="#ED1C24"
        />
      )}

      {/* Card placeholder */}
      {selected === "card" && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-secondary/5 border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-sm border border-border">
              <CreditCard className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Le formulaire de carte bancaire sécurisé (Stripe/PCI-DSS) sera
              chargé ici.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
