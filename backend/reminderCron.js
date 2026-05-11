import cron from "node-cron"
import { Ticket } from "./models/ticketModel.js"
import { User }   from "./models/userModels.js"
import { sendEventReminder } from "./emailVerify/reminderMail.js"

export const startReminderCron = () => {
    // runs every day at 9am
    cron.schedule('0 9 * * *', async () => {
        console.log('Running reminder cron...')
        try {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            const start = new Date(tomorrow.setHours(0,0,0,0))
            const end   = new Date(tomorrow.setHours(23,59,59,999))

            const tickets = await Ticket.find({ status: 'confirmed' })
                .populate({ path: 'expoId', match: { date: { $gte: start, $lte: end } } })
                .populate('userId', 'username email')

            for (const ticket of tickets) {
                if (!ticket.expoId) continue  // expo not tomorrow
                await sendEventReminder(ticket.userId.email, {
                    username:   ticket.userId.username,
                    eventTitle: ticket.expoId.title,
                    date:       ticket.expoId.date,
                    location:   ticket.expoId.location,
                    bookingRef: ticket.bookingRef,
                })
                console.log(`Reminder sent to ${ticket.userId.email}`)
            }
        } catch (e) { console.log('Cron error:', e.message) }
    })
}