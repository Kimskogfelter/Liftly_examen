import { Resend } from 'resend';

// Initialisera Resend med din API-nyckel från .env
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactMessage = async (req, res) => {
    const { name, email, category, message } = req.body;

    // Kontrollera att alla fält finns med
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: "Please fill in all required fields." 
        });
    }

    try {
        await resend.emails.send({
            from: 'Liftly Contact <onboarding@resend.dev>', // Byt till din verifierade domän i Resend om du har en
            to: 'kimskogfelter@outlook.com', // Din e-post där du vill ha meddelandena
            subject: `Liftly Contact: [${category}] from ${name}`,
            text: `New message from the Liftly app:\n\nName: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}`,
        });

        return res.status(200).json({ 
            success: true, 
            message: "Email sent successfully!" 
        });
    } catch (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to send email." 
        });
    }
};