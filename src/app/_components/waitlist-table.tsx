"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type WaitlistEntry = {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function WaitlistTable() {
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data, isLoading } = api.waitlist.getAll.useQuery({
    page,
    limit: 100,
  });
  const { data: count } = api.waitlist.getCount.useQuery();
  
  const columns: ColumnDef<WaitlistEntry, any>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">ID</span>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium text-white/90">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Name</span>
          </div>
        );
      },
      cell: ({ row }) => {
        const name = row.getValue("name") as string | null;
        return (
          <div className="text-white/80">
            {name || <span className="text-white/40 italic">N/A</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Email</span>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-white/80 lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Created At</span>
          </div>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-white/80">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data?.entries ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="h-8 w-48 bg-white/10 animate-pulse rounded" />
          <div className="h-8 w-32 bg-white/10 animate-pulse rounded" />
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          <div className="text-center py-8 text-white/60">
            Loading waitlist entries...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white">Waitlist Entries</h2>
          <p className="text-sm text-white/60 mt-1">
            Manage and view all waitlist registrations
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">
            {count?.count ?? 0}
          </div>
          <p className="text-sm text-white/60">Total Entries</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-white/10 hover:bg-white/5"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-white/90 font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-white/10 hover:bg-white/10 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-white/60"
                >
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-sm text-white/70">
          Showing{" "}
          <span className="font-medium text-white">{page * 100 + 1}</span> to{" "}
          <span className="font-medium text-white">
            {page * 100 + (data?.entries.length ?? 0)}
          </span>{" "}
          of <span className="font-medium text-white">{data?.total ?? 0}</span>{" "}
          entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            Previous
          </Button>
          <div className="text-sm text-white/70 px-2">
            Page <span className="font-medium text-white">{page + 1}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data?.hasMore}
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
