import nodemailer from "nodemailer"

export const sendTicketConfirmation = async (email, { username, eventTitle, tierName, quantity, price, bookingRef, date, location }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    })

    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Booking Confirmed — ${eventTitle}`,
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f7f6f2;padding:30px;border-radius:12px;">
          <div style="background:#2C3E50;padding:30px;border-radius:10px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#FFA641;margin:0;font-size:28px;">EventSphere</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;">Booking Confirmation</p>
          </div>

          <div style="background:#fff;padding:24px;border-radius:10px;margin-bottom:16px;">
            <h2 style="color:#2C3E50;margin-top:0;">Hi ${username}!</h2>
            <p style="color:#666;">Your booking is confirmed. Here are your details:</p>

            <div style="background:#f7f6f2;border-radius:8px;padding:16px;margin:16px 0;">
              <h3 style="color:#2C3E50;margin:0 0 12px;">${eventTitle}</h3>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="color:#999;padding:4px 0;font-size:14px;">Date</td><td style="color:#2C3E50;font-weight:600;font-size:14px;">${new Date(date).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</td></tr>
                <tr><td style="color:#999;padding:4px 0;font-size:14px;">Location</td><td style="color:#2C3E50;font-weight:600;font-size:14px;">${location}</td></tr>
                <tr><td style="color:#999;padding:4px 0;font-size:14px;">Ticket Tier</td><td style="color:#2C3E50;font-weight:600;font-size:14px;">${tierName}</td></tr>
                <tr><td style="color:#999;padding:4px 0;font-size:14px;">Quantity</td><td style="color:#2C3E50;font-weight:600;font-size:14px;">${quantity}</td></tr>
                <tr><td style="color:#999;padding:4px 0;font-size:14px;">Total Paid</td><td style="color:#FFA641;font-weight:700;font-size:16px;">$${price}</td></tr>
              </table>
            </div>

            <div style="background:#2C3E50;border-radius:8px;padding:12px 16px;text-align:center;">
              <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">Booking Reference</p>
              <p style="color:#FFA641;font-weight:700;font-size:18px;font-family:monospace;margin:4px 0 0;">${bookingRef}</p>
            </div>
          </div>

          <p style="color:#999;font-size:12px;text-align:center;">Keep this email as your booking confirmation. See you at the event!</p>
        </div>`
    })
}