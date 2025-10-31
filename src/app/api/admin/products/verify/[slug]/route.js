import { NextResponse } from "next/server";
import { getPool } from "@/lib/mysql"; // adjust path if needed
const crypto = require('crypto');

export async function GET(req, {params}){
    const pool = getPool();
    const { slug } = await params;

    const randomBytes = Math.random().toString(36).substring(2, 2 + 4);
    const newSlug = slug.concat('-', randomBytes);

    const [rows] = await pool.query(`SELECT id FROM products WHERE slug = ?`, [slug])

    if(rows.length === 0){
        return NextResponse.json({availability: true}, {status: 200})
    }

    return NextResponse.json({availability: false, available: newSlug}, {status: 200})
}