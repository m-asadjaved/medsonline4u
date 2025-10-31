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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Target } from "lucide-react";

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

export const columns = [
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
		cell: ({ row }) => (
			<div className="w-10 h-10">
				{row.getValue("id")}
			</div>
		),
	},
	{
		accessorKey: "image_url",
		header: () => <div>Image</div>,
		cell: ({ row }) => (
			<div className="w-10 h-10">
				<Image
					src={`${row.getValue("image_url")}`}
					alt={`Product Image`}
					width={50}
					height={50}
				/>
			</div>
		),
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Product Name
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="flex items-center space-x-2">
					<div className="w-10 h-10 rounded overflow-hidden items-center justify-center">
						<Image
							src={`${row.getValue("image_url")}`}
							alt={`Product Image`}
							width={50}
							height={50}
						/>
					</div>
					<Link
						href={`/admin/products/edit/${row.getValue("slug")}`}
						className="underline"
					>
						{row.getValue("name")}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: "slug",
		header: () => <div>Slug</div>,
		cell: ({ row }) => <div className="">{row.getValue("slug")}</div>,
	},
	{
		accessorKey: "short_description",
		header: "Short Description",
		cell: ({ row }) => (
			<div className="capitalize">
				{row.getValue("short_description").slice(0, 50)}
			</div>
		),
	},
	{
		accessorKey: "category_name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Category
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="flex items-center space-x-2">
				<div className="">{row.getValue("category_name")}</div>
			</div>
		),
	},
	{
		accessorKey: "max_price",
		header: () => <div className="text-right">Price</div>,
		cell: ({ row }) => {
			const price = parseFloat(row.getValue("max_price"));

			// Format the amount as a dollar amount
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(price);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const product = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 cursor-pointer"
						>
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(product.id)
							}
							className={`cursor-pointer`}
						>
							Copy ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className={`cursor-pointer`}>
							<Link href={`/admin/products/edit/${product.slug}`}>
								Edit Product
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className={`cursor-pointer`}>
							<Link
								href={`/products/${product.slug}`}
								target="_blank"
							>
								View in Store
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export default function DataTableDemo() {
	const [productsData, setProductsData] = React.useState([]);
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({
		id: false,
		image_url: false,
		slug: false,
	});
	const [rowSelection, setRowSelection] = React.useState({});
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		fetchProducts();
	}, []);

	async function fetchProducts() {
		setLoading(true);
		const res = await fetch(`/api/admin/products`, { cache: "no-store" });
		const data = await res.json();
		setProductsData(data.products);
		setLoading(false);
	}

	const table = useReactTable({
		data: productsData,
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
					<div className="flex items-center py-4">
						<Input
							placeholder="Filter product name..."
							value={
								table.getColumn("name")?.getFilterValue() ?? ""
							}
							onChange={(event) =>
								table
									.getColumn("name")
									?.setFilterValue(event.target.value)
							}
							className="max-w-sm"
						/>
						<Button asChild className={`ml-2`}>
							<Link href="products/new">New Product</Link>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Columns <ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) =>
													column.toggleVisibility(
														!!value
													)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="overflow-hidden rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column
																	.columnDef
																	.header,
																header.getContext()
															)}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={
												row.getIsSelected() &&
												"selected"
											}
										>
											{row
												.getVisibleCells()
												.map((cell) => (
													<TableCell key={cell.id}>
														{flexRender(
															cell.column
																.columnDef.cell,
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
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<div className="flex items-center justify-end space-x-2 py-4">
						<div className="text-muted-foreground flex-1 text-sm">
							{table.getFilteredSelectedRowModel().rows.length} of{" "}
							{table.getFilteredRowModel().rows.length} row(s)
							selected.
						</div>
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className={`cursor-pointer`}
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className={`cursor-pointer`}
							>
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
