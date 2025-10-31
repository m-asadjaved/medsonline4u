import { CheckCircle2Icon, } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function AlertDemo({ link = "/products" }) {
	return (
		<div className="grid w-md max-w-xl right-0 items-end gap-4">
			<Alert>
				<CheckCircle2Icon />
				<AlertTitle>Success! Your changes have been saved</AlertTitle>
				<AlertDescription>
					<Link className="underline text-blue-400" href={`/products/${link}`} target="_blank">Use this link to view your product</Link>
				</AlertDescription>
			</Alert>
		</div>
	);
}
