"use client";

import React, { useState } from "react";
import Link from "next/link";
import SearchBox from "./SearchBox";
import { FaShoppingCart, FaBars } from "react-icons/fa"; // Example: Font Awesome shopping cart

const Navbar = () => {
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	return (
		<>
			{/* NAV */}
			<header className="bg-white shadow-sm sticky top-0 z-100">
				<div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
					<div className="flex items-center justify-between py-4">
						<div className="flex items-center gap-3">
							<div className="hidden md:flex h-10 w-10 items-center justify-center">
								<img
									src="/logo.png" // put your logo in /public/logo.png
									alt="Medsonline4U"
									width={40}
									height={40}
									className="rounded-md object-contain"
								/>
							</div>
							<button
								onClick={() => setShowMobileMenu(true)}
								className="md:hidden h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold"
							>
								<FaBars />
							</button>
							<div className="hidden sm:block">
								<h1 className="text-lg font-semibold">
									MedsOnline4u
								</h1>
								<p className="text-xs text-slate-500">
									Trusted online pharmacy
								</p>
							</div>
						</div>

						<nav className="hidden md:flex items-center gap-6">
							<Link
								href="/"
								className="text-sm text-slate-600 hover:text-slate-900"
							>
								Home
							</Link>
							<Link
								href="/shop"
								className="text-sm text-slate-600 hover:text-slate-900"
							>
								Shop
							</Link>
							<a
								href="/#categories"
								className="text-sm text-slate-600 hover:text-slate-900"
							>
								Categories
							</a>
							<Link
								href="/contact"
								className="text-sm text-slate-600 hover:text-slate-900"
							>
								Contact
							</Link>
						</nav>

						{showMobileMenu && (
							<div
								className="fixed inset-0 z-50 flex"
								role="dialog"
								aria-modal="true"
								onKeyDown={(e) => {
									if (e.key === "Escape")
										setShowMobileMenu(false);
								}}
							>
								{/* Backdrop */}
								<div
									className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
									onClick={() => setShowMobileMenu(false)}
									aria-hidden="true"
								/>

								{/* Drawer */}
								<aside
									className="relative z-10 w-11/12 max-w-xs bg-white shadow-2xl p-4 transform transition-transform duration-300 ease-in-out translate-x-0"
									style={{
										animation: "slideIn 240ms ease-out",
									}}
								>
									{/* Header */}
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-3">
											<div className="md:hidden h-10 w-10 items-center justify-center">
												<img
													src="/logo.png" // put your logo in /public/logo.png
													alt="Medsonline4U"
													width={40}
													height={40}
													className="rounded-md object-contain"
												/>
											</div>
											<div>
												<h4 className="text-base font-semibold">
													MedsOnline4u
												</h4>
												<p className="text-xs text-slate-400">
													Trusted online pharmacy
												</p>
											</div>
										</div>

										<button
											onClick={() =>
												setShowMobileMenu(false)
											}
											aria-label="Close menu"
											className="p-2 rounded-md hover:bg-slate-100"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-slate-700"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										</button>
									</div>

									{/* Search */}
									<div className="mt-4">
										<label
											htmlFor="mobile-search"
											className="sr-only"
										>
											Search
										</label>
										<div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 text-slate-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
												/>
											</svg>
											<input
												id="mobile-search"
												className="flex-1 bg-transparent outline-none text-sm"
												placeholder="Search medicines, brands..."
											/>
										</div>
									</div>

									{/* Nav */}
									<nav className="mt-6">
										<ul className="space-y-3">
											<li>
												<Link
													href="/"
													onClick={() =>
														setShowMobileMenu(false)
													}
													className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-emerald-50"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 text-emerald-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10.5z"
														/>
													</svg>
													<span className="text-sm text-slate-700">
														Home
													</span>
												</Link>
											</li>

											<li>
												<Link
													href="/shop"
													onClick={() =>
														setShowMobileMenu(false)
													}
													className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-emerald-50"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 text-emerald-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L20 13M9 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
														/>
													</svg>
													<span className="text-sm text-slate-700">
														Shop
													</span>
												</Link>
											</li>

											<li>
												<Link
													href="/#categories"
													onClick={(e) => {
														// smooth scroll and close
														e.preventDefault();
														const el =
															document.querySelector(
																"#categories"
															);
														if (el)
															el.scrollIntoView({
																behavior:
																	"smooth",
																block: "start",
															});
														setShowMobileMenu(
															false
														);
													}}
													className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-emerald-50"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 text-emerald-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M4 6h16M4 12h16M4 18h16"
														/>
													</svg>
													<span className="text-sm text-slate-700">
														Categories
													</span>
												</Link>
											</li>

											<li>
												<Link
													href="/contact"
													onClick={() =>
														setShowMobileMenu(false)
													}
													className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-emerald-50"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-5 w-5 text-emerald-500"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M21 8V7a2 2 0 00-2-2H5a2 2 0 00-2 2v1M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M7 12h10M7 16h6"
														/>
													</svg>
													<span className="text-sm text-slate-700">
														Contact
													</span>
												</Link>
											</li>
										</ul>
									</nav>

									{/* Footer CTAs */}
									<div className="mt-6 border-t pt-4">
										<div className="flex gap-3">
											<Link
												href="/cart"
												onClick={() =>
													setShowMobileMenu(false)
												}
												className="flex-1 text-center px-3 py-2 rounded-md bg-emerald-600 text-white text-sm"
											>
												Cart
											</Link>
											<Link
												href="/account"
												onClick={() =>
													setShowMobileMenu(false)
												}
												className="flex-1 text-center px-3 py-2 rounded-md border border-emerald-600 text-emerald-600 text-sm"
											>
												Account
											</Link>
										</div>
										<p className="mt-3 text-xs text-slate-400">
											Need help?{" "}
											<a
												href="/contact"
												onClick={() =>
													setShowMobileMenu(false)
												}
												className="underline"
											>
												Contact us
											</a>
										</p>
									</div>
								</aside>

								{/* Small style tweak: slide in animation (optional, Tailwind doesn't include this exact keyframe) */}
								<style jsx>{`
									@keyframes slideIn {
										from {
											transform: translateX(-16px);
											opacity: 0;
										}
										to {
											transform: translateX(0);
											opacity: 1;
										}
									}
									/* prevent body scroll while menu is open */
									body {
										overflow: hidden;
									}
								`}</style>
							</div>
						)}

						<Link href={"/"}>
							<h2 className="font-bold md:hidden text-2xl">
								MedsOnline4u
							</h2>
						</Link>

						<span className="hidden md:block">
							<SearchBox />
						</span>

						<div className="flex items-center gap-4">
							<Link
								href="/cart"
								className="px-3 py-1 rounded-md border border-emerald-600 text-white"
							>
								<FaShoppingCart className="w-6 h-6 text-emerald-600" />
							</Link>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Navbar;
