"use client";

import React, { useEffect, useRef, useState } from "react";
import {
	ImageKitAbortError,
	ImageKitInvalidRequestError,
	ImageKitServerError,
	ImageKitUploadNetworkError,
	upload,
} from "@imagekit/next";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Trash,
	ArrowLeft,
	ArrowRight,
	UploadCloud,
	X,
	RefreshCcw,
} from "lucide-react";
import { Spinner } from "@/app/(admin)/_components/Spinner";

export default function ImageManagerClient() {
	const fileInputRef = useRef(null);
	const [progress, setProgress] = useState(0);
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [limit] = useState(20);
	const [total, setTotal] = useState(0);
	const abortControllerRef = useRef(null);
	const [isUploadOpen, setIsUploadOpen] = useState(false);

	// fetch list from server
	const fetchFiles = async (p = 0) => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/admin/images/list?page=${p}&limit=${limit}`,
				{ cache: "no-store" }
			);
			if (!res.ok) throw new Error("Failed to fetch files");
			const data = await res.json();
			console.log(data);
			setFiles(data || []);
			setTotal(data.length || 0);
			setPage(p);
		} catch (err) {
			console.error("fetchFiles", err);
			// keep UI friendly but direct
			alert("Could not load files — check console for details.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFiles(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const authenticator = async () => {
		const res = await fetch("/api/admin/images/upload");
		if (!res.ok) throw new Error("Auth failed");
		return res.json();
	};

	const handleUpload = async () => {
		const fileInput = fileInputRef.current;
		if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
			alert("Select a file first");
			return;
		}
		const file = fileInput.files[0];

		let auth;
		try {
			auth = await authenticator();
		} catch (err) {
			console.error("auth err", err);
			alert("Could not get upload credentials");
			return;
		}

		abortControllerRef.current = new AbortController();
		setProgress(0);
		try {
			const result = await upload({
				expire: auth.expire,
				token: auth.token,
				signature: auth.signature,
				publicKey: auth.publicKey,
				file,
				fileName: file.name,
				onProgress: (e) => {
					setProgress((e.loaded / e.total) * 100);
				},
				abortSignal: abortControllerRef.current.signal,
			});
			console.log("uploaded", result);
			await fetchFiles(0);
			setProgress(0);
			setIsUploadOpen(false);
		} catch (err) {
			console.error("upload error", err);
			if (err instanceof ImageKitAbortError) {
				alert("Upload aborted");
			} else if (err instanceof ImageKitInvalidRequestError) {
				alert("Invalid request");
			} else if (err instanceof ImageKitUploadNetworkError) {
				alert("Network error");
			} else if (err instanceof ImageKitServerError) {
				alert("Server error");
			} else {
				alert("Upload failed — see console.");
			}
		}
	};

	const handleAbort = () => {
		if (abortControllerRef.current) abortControllerRef.current.abort();
	};

	const handleDelete = async (fileId) => {
		if (!confirm("Delete this file?")) return;
		try {
			const res = await fetch(`/api/admin/images/delete`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fileId }),
			});
			if (!res.ok) throw new Error("Delete failed");
			await fetchFiles(0);
		} catch (err) {
			console.error("delete err", err);
			alert("Delete failed — see console.");
		}
	};

	const prevPage = () => {
		if (page > 0) fetchFiles(page - 1);
	};
	const nextPage = () => {
		const maxPage = Math.floor((total - 1) / limit);
		if (page < maxPage) fetchFiles(page + 1);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Image Manager</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col sm:flex-row sm:items-center gap-3">
							<Dialog
								open={isUploadOpen}
								onOpenChange={setIsUploadOpen}
							>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										className="flex items-center gap-2"
									>
										<UploadCloud className="h-4 w-4" />
										Upload
									</Button>
								</DialogTrigger>
								<Button
									variant="outline"
									className="flex items-center gap-2"
									onClick={() => {
										fetchFiles(page);
										setLoading(true);
									}}
								>
									<RefreshCcw className="h-4 w-4" />
								</Button>
								<DialogContent className="sm:max-w-lg">
									<DialogTitle className="sr-only">
										Upload file
									</DialogTitle>
									<DialogHeader>
										<CardTitle>Upload file</CardTitle>
									</DialogHeader>

									<div className="grid gap-4 py-2">
										<Input type="file" ref={fileInputRef} />
										<div className="flex items-center gap-2">
											<Button onClick={handleUpload}>
												Start Upload
											</Button>
											<Button
												variant="ghost"
												onClick={handleAbort}
											>
												Abort
											</Button>
											<div className="flex-1">
												<Progress
													value={Math.round(progress)}
													className="h-2.5"
												/>
												{progress > 0 && (
													<div className="text-xs mt-1">
														{Math.round(progress)}%
													</div>
												)}
											</div>
										</div>
									</div>

									<DialogFooter>
										<Button
											variant="link"
											onClick={() =>
												setIsUploadOpen(false)
											}
										>
											Close
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<div className="ml-auto flex items-center gap-2">
								<Button
									variant="ghost"
									disabled={page === 0}
									onClick={prevPage}
									className="flex items-center gap-2"
								>
									<ArrowLeft className="h-4 w-4" /> Prev
								</Button>
								<Button
									variant="ghost"
									onClick={nextPage}
									className="flex items-center gap-2"
									disabled={(page + 1) * limit >= total}
								>
									Next <ArrowRight className="h-4 w-4" />
								</Button>
							</div>
						</div>

						<Separator className="my-4" />

						<div className="text-sm text-muted-foreground">
							{loading ? "" : `${total} files — page ${page + 1}`}
						</div>

						<ScrollArea className="h-[70vh] mt-2">
							{loading && (
								<div className="min-h-[70vh] items-center justify-center flex">
									<Spinner />
								</div>
							)}
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{files && files.length > 0
									? files.map((f) => (
											<div
												key={f.fileId}
												className="border rounded-md p-3 bg-slate-800 shadow-sm"
											>
												<div
													onClick={() =>
														window.open(
															f.url,
															"_blank"
														)
													}
													className="aspect-video bg-dark rounded-md overflow-hidden mb-2 flex items-center justify-center"
												>
													<img
														src={
															f.thumbnail ||
															`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${f.filePath}`
														}
														alt={f.name}
														className="object-cover w-full h-full cursor-pointer"
													/>
												</div>
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0">
														<div className="font-medium text-sm truncate">
															{f.name}
														</div>
														<div className="text-xs text-muted-foreground mt-1">
															{new Date(
																f.updatedAt ||
																	f.createdAt ||
																	Date.now()
															).toLocaleString()}
														</div>
													</div>

													<div className="flex flex-col items-end gap-2">
														<Button
															className={`cursor-pointer`}
															size="sm"
															variant="destructive"
															onClick={() =>
																handleDelete(
																	f.fileId
																)
															}
														>
															<Trash className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</div>
										))
									: ""}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
