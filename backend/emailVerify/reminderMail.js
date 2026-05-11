import nodemailer from "nodemailer"

export const sendEventReminder = async (email, { username, eventTitle, date, location, bookingRef }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    })

    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Reminder: ${eventTitle} is tomorrow!`,
        html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f7f6f2;padding:30px;border-radius:12px;">
          <div style="background:#2C3E50;padding:30px;border-radius:10px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#FFA641;margin:0;">EventSphere</h1>
            <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;">Event Reminder</p>
          </div>
          <div style="background:#fff;padding:24px;border-radius:10px;">
            <h2 style="color:#2C3E50;">Hi ${username}, your event is tomorrow!</h2>
            <h3 style="color:#FFA641;">${eventTitle}</h3>
            <p style="color:#666;"><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
            <p style="color:#666;"><strong>Location:</strong> ${location}</p>
            <p style="color:#666;"><strong>Booking Ref:</strong> <span style="font-family:monospace;color:#2C3E50;">${bookingRef}</span></p>
            <p style="color:#999;font-size:13px;margin-top:16px;">Don't forget to bring your booking reference. See you there!</p>
          </div>
        </div>`
    })
}