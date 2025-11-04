"use client";

import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "@/app/(admin)/_components/Spinner";

/**
 * Column factory — returns the columns array and accepts handlers like handleDeleteProduct.
 * Keeping this above the component so it's easy to test/inspect.
 */
const getColumns = (handleDeleteProduct) => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "id",
		header: () => <div>ID</div>,
		cell: ({ row }) => <div className="w-10 h-10">{row.getValue("id")}</div>,
	},
	{
		accessorKey: "created_at",
		header: () => <div>Order Date</div>,
		cell: ({ row }) => {
			const date = new Date(row.getValue("created_at"));
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
			const day = date.getDate().toString().padStart(2, '0');

			const formattedDate = `${day}-${month}-${year}`; // Example: "2025-11-03"
			return (<div className="">{formattedDate}</div>)
		}
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Customer Name
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<Link href={`/admin/orders/view/${row.getValue("id")}`} className="underline">
					{row.getValue("name")}
				</Link>
			);
		},
	},
	{
		accessorKey: "city",
		header: () => <div>Address</div>,
		cell: ({ row }) => <div className="">{row.getValue("city")} - {row.getValue("country")}</div>,
	},
	{
		accessorKey: "country",
		header: "Country",
		cell: ({ row }) => <div className="capitalize">{row.getValue("short_description")}</div>,
	},
	{
		accessorKey: "shipping_method",
		header: "Shipping Method",
		cell: ({ row }) => <div className="capitalize">{row.getValue("shipping_method")}</div>,
	},
	{
		accessorKey: "total_value",
		header: ({ column }) => {
			return (
				<>Total Value</>
			);
		},
		cell: ({ row }) => <div className="flex items-center space-x-2"><div className="">${row.getValue("total_value")}</div></div>,
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const product = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)} className={`cursor-pointer`}>
							Copy ID
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleDeleteProduct(product.id)}
							className={`cursor-pointer text-red-400 hover:text-red-600`}
						>
							Delete
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className={`cursor-pointer`}>
							<Link href={`/admin/products/edit/${product.slug}`}>Edit Product</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className={`cursor-pointer`}>
							<Link href={`/products/${product.slug}`} target="_blank">View in Store</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export default function OrdersTable() {
	const [ordersData, setOrdersData] = React.useState([]);
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({
		id: false,
		country: false,
	});
	const [rowSelection, setRowSelection] = React.useState({});
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		fetchOrders();
	}, []);

	async function fetchOrders() {
		setLoading(true);
		const res = await fetch(`/api/admin/orders`, { cache: "no-store" });
		const data = await res.json();
		setOrdersData(data.orders);
		setLoading(false);
	}

	// define delete handler here so it can call fetchOrders()
	async function handleDeleteOrder(id) {
		if (!confirm("Are you sure you want to delete this order?")) return;
		try {
			setLoading(true);
			const res = await fetch(`/api/admin/orders/delete/${id}`, { method: "DELETE" });
			const data = await res.json();
			if (!data.ok) {
				setLoading(false);
				alert("Error deleting product");
				console.error("Error deleting product", data);
				return;
			}
			// refresh products after successful delete
			await fetchOrders();
		} catch (err) {
			console.error("Delete request failed", err);
			alert("Failed to delete product");
		}
	}

	// create columns with the handler — memoize so table doesn't re-render unnecessarily
	const columns = React.useMemo(() => getColumns(handleDeleteOrder), [handleDeleteOrder]);

	const table = useReactTable({
		data: ordersData,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<>
			{!loading ? (
				<div className="w-full">
					{/* ... rest of your render markup unchanged ... */}
					<div className="flex items-center py-4">
						<Input
							placeholder="Filter product name..."
							value={table.getColumn("name")?.getFilterValue() ?? ""}
							onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
							className="max-w-sm"
						/>
						<Button asChild className={`ml-2`}>
							<Link href="products/new">New Product</Link>
						</Button>
						{/* Columns dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Columns <ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Table render - unchanged */}
					<div className="overflow-hidden rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columns.length} className="h-24 text-center">
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-end space-x-2 py-4">
						<div className="text-muted-foreground flex-1 text-sm">
							{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
						<div className="space-x-2">
							<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className={`cursor-pointer`}>
								Previous
							</Button>
							<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className={`cursor-pointer`}>
								Next
							</Button>
						</div>
					</div>
				</div>
			) : (
				<Spinner />
			)}
		</>
	);
}
