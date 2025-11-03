"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

export default function LoginPage() {
	const pathname = usePathname();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/auth`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) throw new Error(`API ${res.status}`);
			const data = await res.json();

			Cookies.set("token", data.token, { expires: 7 });

			if (pathname !== "/login") {
				router.push(pathname);
				return;
			}

			router.push("/admin");
			return;
		} catch (err) {
			console.error("Failed to fetch products", err);
		}
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
				{/* <CardAction>
            <Button variant="link">Sign Up</Button>
            </CardAction> */}
			</CardHeader>
			<CardContent>
				<form>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								placeholder="mail@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
								{/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                    Forgot your password?
                    </a> */}
							</div>
							<Input
								id="password"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								placeholder="password"
								type="password"
								required
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex-col gap-2">
				<Button onClick={handleLogin} {...(loading && { disabled: true })} className="w-full cursor-pointer">
					{loading ? (
						<>
							<Spinner />
							Signing in...
						</>
					) : (
						'Sign in'
					)}
				</Button>
				<Link href="/" className="text-sm underline">
					Back to home
				</Link>
			</CardFooter>
		</Card>
	);
}
