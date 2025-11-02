import { Resend } from "resend";
import { NextResponse } from "next/server";
const resend = new Resend(process.env.RESEND_KEY);

export async function POST(req) {
	const formData = await req.json();

	const { data, error } = await resend.emails.send({
		from: "Medsonline4U <contact@medsonline4u.com>",
		to: ["flyquill.pk@gmail.com", "rockharoon8200@gmail.com"],
		subject: "New Lead on Medsonline4U",
		html: `
          <div style="font-family: sans-serif; line-height: 1.6;">
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            <p><strong>Message:</strong> ${formData.message}</p>
          </div>
        `,
	});

	if (error) {
		return NextResponse.json(error);
	}

	return NextResponse.json(data);
}
