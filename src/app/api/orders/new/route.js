import { NextResponse } from "next/server";
import { getPool } from "@/lib/mysql"; // adjust path if needed
import { SendEmail } from "./SendEmail";

export async function POST(req) {
    const pool = getPool();
    let conn;

    try {
        const formData = await req.json();

        const insertProductSql = `
            INSERT INTO orders (
                user_id,
                shipping_method,
                payment_method,
                shipping_cost,
                total_value
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
            );
            `;

        // const emailSent = await SendEmail(formData);

        return NextResponse.json(formData, { status: 200 });
        
    } catch (err) {
        return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
    }


}
