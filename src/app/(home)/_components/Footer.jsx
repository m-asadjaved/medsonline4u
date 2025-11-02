import React from "react";
import Link from "next/link";

const Footer = () => {
	return (
		<>
			{/* FOOTER */}
			<footer className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 mt-12 pb-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
					<div>
						<h5 className="font-semibold text-slate-900">
							MediKart
						</h5>
						<p className="mt-2">
							Choose Medsonline4u for affordable, high-quality
							medicines delivered discreetly to your door. We
							provide trusted products, secure payments, fast
							delivery, and excellent customer support for your
							health and convenience.
						</p>
					</div>
					<div>
						<h5 className="font-semibold text-slate-900">
							Company
						</h5>
						<ul className="mt-2 space-y-2">
							<li>
								<Link href="/about">About</Link>
							</li>
							<li>
								<Link href="/contact">Contact</Link>
							</li>
						</ul>
					</div>
					<div>
						<h5 className="font-semibold text-slate-900">
							Support
						</h5>
						<ul className="mt-2 space-y-2">
							<li>
								<Link href="/delivery-and-returns">
									Delivery & Returns
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 border-t pt-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between">
					<div>© 2025 MediKart — All rights reserved</div>
					<div className="mt-3 sm:mt-0">
						Made with care · Secure payments
					</div>
				</div>
			</footer>
		</>
	);
};

export default Footer;
