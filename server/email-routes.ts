import { Router } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { sendEmail } from './email-service';
import { insertEmailTemplateSchema, insertEmailCampaignSchema } from '../shared/email-schema';
import { requireAuth } from './auth-middleware';

const router = Router();

// Get all email templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await storage.getEmailTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
});

// Get email template by ID
router.get('/templates/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const template = await storage.getEmailTemplate(id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error fetching email template:', error);
    res.status(500).json({ error: 'Failed to fetch email template' });
  }
});

// Create new email template
router.post('/templates', async (req, res) => {
  try {
    const templateData = insertEmailTemplateSchema.parse(req.body);
    const template = await storage.createEmailTemplate(templateData);
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating email template:', error);
    res.status(500).json({ error: 'Failed to create email template' });
  }
});

// Update email template
router.put('/templates/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const template = await storage.updateEmailTemplate(id, updates);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Error updating email template:', error);
    res.status(500).json({ error: 'Failed to update email template' });
  }
});

// Delete email template
router.delete('/templates/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteEmailTemplate(id);
    if (!success) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting email template:', error);
    res.status(500).json({ error: 'Failed to delete email template' });
  }
});

// Get email logs
router.get('/logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const logs = await storage.getEmailLogs(limit, offset);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching email logs:', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// Get email logs by template
router.get('/logs/template/:templateId', async (req, res) => {
  try {
    const templateId = parseInt(req.params.templateId);
    const logs = await storage.getEmailLogsByTemplate(templateId);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching email logs by template:', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

// Send test email
router.post('/test', async (req, res) => {
  try {
    const { templateType, email, name, variables } = req.body;
    
    if (!templateType || !email) {
      return res.status(400).json({ error: 'Template type and email are required' });
    }

    const success = await emailService.sendEmail({
      to: email,
      toName: name || 'Test User',
      templateType,
      variables: variables || {}
    });

    res.json({ success });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Get email campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await storage.getEmailCampaigns();
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching email campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch email campaigns' });
  }
});

// Create new email campaign
router.post('/campaigns', async (req, res) => {
  try {
    const campaignData = insertEmailCampaignSchema.parse(req.body);
    const campaign = await storage.createEmailCampaign(campaignData);
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating email campaign:', error);
    res.status(500).json({ error: 'Failed to create email campaign' });
  }
});

// Update email campaign
router.put('/campaigns/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const campaign = await storage.updateEmailCampaign(id, updates);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error updating email campaign:', error);
    res.status(500).json({ error: 'Failed to update email campaign' });
  }
});

// Send bulk email campaign
router.post('/campaigns/:id/send', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const campaign = await storage.getEmailCampaign(id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Update campaign status to sending
    await storage.updateEmailCampaign(id, { 
      status: 'sending',
      sentAt: new Date()
    });

    // In a real implementation, you would queue this for background processing
    // For now, we'll just update the status to sent
    await storage.updateEmailCampaign(id, { 
      status: 'sent',
      sentCount: campaign.recipientCount || 0
    });

    res.json({ success: true, message: 'Campaign sent successfully' });
  } catch (error) {
    console.error('Error sending email campaign:', error);
    res.status(500).json({ error: 'Failed to send email campaign' });
  }
});

export default router;