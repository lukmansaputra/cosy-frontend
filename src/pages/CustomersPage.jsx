import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, MoreVertical, Pencil, Phone, Plus, Search, Trash2, User } from "lucide-react";

import CustomerSheet from "@/components/customers/CustomerSheet";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/services/customer.service";

const EMPTY_ARRAY = [];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionCustomer, setActionCustomer] = useState(null);
  const [actionError, setActionError] = useState("");
  const queryClient = useQueryClient();
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
  const customers = customersQuery.data || EMPTY_ARRAY;
  const loading = customersQuery.isPending;
  const error = actionError || customersQuery.error?.message || "";

  async function refreshCustomers() {
    await customersQuery.refetch();
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  }

  async function handleSubmitCustomer(payload) {
    try {
      setActionError("");

      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, payload);
      } else {
        await createCustomer(payload);
      }

      setSheetOpen(false);
      setSelectedCustomer(null);
      await refreshCustomers();
    } catch (submitError) {
      setActionError(submitError.message);
    }
  }

  async function handleDeleteCustomer() {
    if (!actionCustomer) return;

    try {
      setActionError("");
      await deleteCustomer(actionCustomer.id);
      setDeleteDialogOpen(false);
      setActionCustomer(null);
      await refreshCustomers();
    } catch (deleteError) {
      setActionError(deleteError.message);
    }
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const keyword = search.toLowerCase();

      return (
        (customer.full_name || "").toLowerCase().includes(keyword) ||
        (customer.phone || "").toLowerCase().includes(keyword) ||
        (customer.address || "").toLowerCase().includes(keyword)
      );
    });
  }, [customers, search]);

  return (
    <div className="space-y-5">
      <CustomerSheet
        open={sheetOpen}
        customer={selectedCustomer}
        onClose={() => {
          setSheetOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleSubmitCustomer}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Hapus customer?"
        description="Customer akan dihapus dari daftar. Pastikan customer ini tidak lagi dipakai pada proyek aktif."
        confirmText="Hapus Customer"
        onCancel={() => {
          setDeleteDialogOpen(false);
          setActionCustomer(null);
        }}
        onConfirm={handleDeleteCustomer}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[#8B9388]">Data Pelanggan</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Customers</h1>
        </div>

        <button
          onClick={() => {
            setSelectedCustomer(null);
            setSheetOpen(true);
          }}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#4A5B45] px-3 py-2 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Customer
        </button>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B9388]"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari customer..."
          className="w-full rounded-2xl border border-[#252A27] bg-[#161917] py-3 pl-11 pr-4 text-white outline-none"
        />
      </div>

      <div className="space-y-3">
        {loading && <StateCard text="Memuat customer..." />}
        {error && <StateCard text={error} danger />}

        {!loading && !error && filteredCustomers.length === 0 && (
          <StateCard text="Belum ada customer yang cocok." />
        )}

        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-2xl border border-[#252A27] bg-[#161917] p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#101311]">
                <User size={18} className="text-[#7C9A72]" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-white">
                  {customer.full_name || "-"}
                </h3>

                <InfoLine icon={Phone} value={customer.phone || "-"} />
                <InfoLine icon={MapPin} value={customer.address || "-"} />
              </div>

              <CustomerActions
                customer={customer}
                onEdit={(item) => {
                  setSelectedCustomer(item);
                  setSheetOpen(true);
                }}
                onDelete={(item) => {
                  setActionCustomer(item);
                  setDeleteDialogOpen(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerActions({ customer, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101311] text-[#8B9388]"
      >
        <MoreVertical size={17} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-[#252A27] bg-[#101311] shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              onEdit(customer);
            }}
            className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm text-white"
          >
            <Pencil size={15} />
            Edit Customer
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete(customer);
            }}
            className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm text-red-400"
          >
            <Trash2 size={15} />
            Hapus Customer
          </button>
        </div>
      )}
    </div>
  );
}

function InfoLine({ icon: Icon, value }) {
  return (
    <p className="mt-2 flex items-center gap-2 text-sm text-[#8B9388]">
      <Icon size={14} />
      <span className="truncate">{value}</span>
    </p>
  );
}

function StateCard({ text, danger = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-sm ${
        danger
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-[#252A27] bg-[#161917] text-[#8B9388]"
      }`}
    >
      {text}
    </div>
  );
}
