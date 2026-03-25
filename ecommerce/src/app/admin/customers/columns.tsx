"use client";

import { ColumnDef, Column } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer, Role } from "@/types/customer";
import { Badge } from "@/components/ui/badge";

const useCurrentUser = (): { role: Role } => {
  return { role: "SuperAdmin" };
};

const DataTableColumnHeader = ({
  column,
  title,
}: {
  column: Column<Customer, unknown>;
  title: string;
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

const ActionsCell = ({ customer }: { customer: Customer }) => {
  const { role: currentUserRole } = useCurrentUser();

  const canDelete =
    (currentUserRole === "SuperAdmin" &&
      (customer.role === "Admin" || customer.role === "User")) ||
    (currentUserRole === "Admin" && customer.role === "User");

  const canEdit = canDelete;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {canEdit && <DropdownMenuItem>Modifier</DropdownMenuItem>}
        {canDelete && (
          <DropdownMenuItem className="text-red-500">
            Supprimer
          </DropdownMenuItem>
        )}
        {!canEdit && !canDelete && (
          <DropdownMenuItem disabled>Aucune action disponible</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom d'utilisateur" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rôle" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          variant={
            role === "SuperAdmin"
              ? "destructive"
              : role === "Admin"
                ? "default"
                : "secondary"
          }
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date d'inscription" />
    ),
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell customer={row.original} />,
  },
];
