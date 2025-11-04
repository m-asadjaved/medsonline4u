import { Resend } from "resend";
import { EmailTemplate } from "@/app/(home)/_components/EmailTemplate";
const resend = new Resend(process.env.RESEND_KEY);

export async function SendEmail(formData) {

    const { data, error } = await resend.emails.send({
        from: 'Medsonline4U <orders@medsonline4u.com>',
        // to: ['flyquill.pk@gmail.com'],
        to: ['flyquill.pk@gmail.com', 'rockharoon8200@gmail.com'],
        subject: 'New Order',
        react: EmailTemplate({
            orderId: formData.orderId,
            email: formData.email,
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            shippingMethod: formData.shippingMethod,
            total: formData.total,
            items: formData.items
        }),
    });

    if (error) {
        return JSON.stringify(error);
    }

    return JSON.stringify(data);
}
