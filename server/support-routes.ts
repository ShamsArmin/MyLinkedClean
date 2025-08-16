import { Router } from 'express';
import { storage } from './storage';
import { insertSupportMessageSchema } from '../shared/support-schema';
import sgMail from '@sendgrid/mail';

const router = Router();

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Support contact form endpoint
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message, priority } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Support contact request received:', { name, email, subject, priority });

    // Validate data
    const validatedData = insertSupportMessageSchema.parse({
      name,
      email,
      subject,
      message,
      priority: priority || 'medium',
      status: 'open',
      isRead: false
    });

    // Save to database
    const savedMessage = await storage.createSupportMessage(validatedData);
    console.log('Support message saved:', savedMessage.id);

    // Send email notification to admin if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
      try {
        // Try multiple recipient addresses to ensure delivery
        const emailContent = {
          to: ['support@mylinked.app', 'armin.shams@mylinked.app'], // Multiple recipients
          from: 'info@mylinked.app', // Use verified sender domain
          replyTo: email, // User can reply directly to the requester
          subject: `[MyLinked Support] New Request: ${subject}`,
          html: `
            <h2>New Support Request</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Priority:</strong> ${priority || 'medium'}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p><strong>Request ID:</strong> ${savedMessage.id}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              This message was sent from the MyLinked contact form. 
              You can respond directly to ${email}
            </p>
          `,
          text: `New Support Request from ${name} (${email})\n\nSubject: ${subject}\nPriority: ${priority || 'medium'}\n\nMessage:\n${message}\n\nRequest ID: ${savedMessage.id}\nSubmitted: ${new Date().toLocaleString()}`
        };

        await sgMail.send(emailContent);
        console.log('Support notification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send support notification email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ 
      success: true, 
      message: 'Support request sent successfully. We\'ll get back to you within 24 hours.',
      id: savedMessage.id
    });

  } catch (error) {
    console.error('Support contact error:', error);
    res.status(500).json({ 
      error: 'Failed to send support request. Please try again later.' 
    });
  }
});

// Get all support messages for admin
router.get('/messages', async (req, res) => {
  try {
    const messages = await storage.getAllSupportMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching support messages:', error);
    res.status(500).json({ error: 'Failed to fetch support messages' });
  }
});

// Update support message status
router.patch('/messages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const updatedMessage = await storage.updateSupportMessage(id, updates);
    res.json(updatedMessage);
  } catch (error) {
    console.error('Error updating support message:', error);
    res.status(500).json({ error: 'Failed to update support message' });
  }
});

// Delete support message
router.delete('/messages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteSupportMessage(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting support message:', error);
    res.status(500).json({ error: 'Failed to delete support message' });
  }
});

export default router;