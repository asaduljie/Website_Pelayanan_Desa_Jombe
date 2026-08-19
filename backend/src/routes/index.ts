import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { getServices, getServiceBySlug, createService } from '../controllers/serviceController';
import { createApplication, getMyApplications, getApplicationDetail, trackApplication } from '../controllers/applicationController';
import {
  getOperatorDashboardStats,
  getOperatorApplications,
  updateApplicationStatus,
  approveAndSendLetter,
  createApplicationForCitizen,
  deleteOperatorApplication,
  clearAllOperatorApplications,
} from '../controllers/operatorController';
import { getDocumentAccessToken, streamPrivateDocument } from '../controllers/documentController';
import { generateLetterPdf, downloadApplicationPdf } from '../controllers/pdfController';
import { createComplaint, getComplaints, updateComplaintStatus, deleteComplaint } from '../controllers/complaintController';
import { getMyNotifications, markNotificationAsRead } from '../controllers/notificationController';
import {
  getVillageProfile,
  getNewsList,
  getNewsBySlug,
  createNews,
  deleteNews,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAgendas,
} from '../controllers/contentController';
import { handleAiQuery } from '../controllers/aiController';
import {
  handleIncomingWhatsAppMessage,
  getChatHistory,
  getBaileysStatus,
  startBaileysConnection,
  disconnectBaileys,
} from '../controllers/whatsappBotController';
import { verifyTteDocument } from '../controllers/verifyTteController';

import { authenticateToken, authorizeRoles, verifyApplicationOwnership } from '../middleware/auth';
import { authLimiter, waBotLimiter, sanitizeInputMiddleware } from '../middleware/security';
import { uploadMiddleware, verifyUploadedFileSignature } from '../middleware/upload';
import { logAuditTrail } from '../middleware/audit';

const router = Router();

// ==================== PUBLIC TTE VERIFICATION ROUTE ====================
router.get('/public/verify-tte/:idOrNumber', verifyTteDocument);

// Global sanitization on all incoming requests
router.use(sanitizeInputMiddleware);

// ==================== AUTH ROUTES ====================
router.post('/auth/register', authLimiter, register);
router.post('/auth/login', authLimiter, login);
router.get('/auth/profile', authenticateToken, getProfile);
router.patch('/auth/profile', authenticateToken, updateProfile);

// ==================== PUBLIC & OPERATOR CONTENT ROUTES ====================
router.get('/content/profile', getVillageProfile);
router.get('/content/news', getNewsList);
router.get('/content/news/:slug', getNewsBySlug);
router.post('/content/news', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), createNews);
router.delete('/content/news/:id', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), deleteNews);

router.get('/content/announcements', getAnnouncements);
router.post('/content/announcements', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), createAnnouncement);
router.delete('/content/announcements/:id', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), deleteAnnouncement);
router.get('/content/agendas', getAgendas);

// ==================== SERVICES & DYNAMIC FORM ROUTES ====================
router.get('/services', getServices);
router.get('/services/:slug', getServiceBySlug);
router.post('/admin/services', authenticateToken, authorizeRoles('ADMIN'), createService);

// ==================== APPLICATION ROUTES (CITIZEN) ====================
router.post(
  '/applications',
  authenticateToken,
  uploadMiddleware.array('documents', 5),
  verifyUploadedFileSignature,
  logAuditTrail('CREATE_APPLICATION'),
  createApplication
);
router.get('/applications/my', authenticateToken, getMyApplications);
router.get('/applications/track', trackApplication);
router.get('/applications/:id', authenticateToken, verifyApplicationOwnership, getApplicationDetail);

// ==================== OPERATOR & ADMIN ROUTES ====================
router.get('/operator/stats', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), getOperatorDashboardStats);
router.get('/operator/applications', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), getOperatorApplications);
router.patch('/operator/applications/:id/status', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), logAuditTrail('UPDATE_APP_STATUS'), updateApplicationStatus);
router.post('/operator/applications/:id/approve-and-send', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), logAuditTrail('APPROVE_SEND_LETTER'), approveAndSendLetter);

// Operator assisted creation
router.post('/operator/applications/assisted', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), logAuditTrail('ASSISTED_APP_CREATE'), createApplicationForCitizen);
router.delete('/operator/applications/:id', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), deleteOperatorApplication);
router.post('/operator/applications/clear-all', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), clearAllOperatorApplications);

// PDF Generation & Direct Streaming
router.post('/operator/applications/generate-letter', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), logAuditTrail('GENERATE_LETTER_PDF'), generateLetterPdf);
router.get('/operator/pdf/:id', downloadApplicationPdf);

// ==================== PRIVATE DOCUMENT ACCESS ROUTES ====================
router.post('/documents/token', authenticateToken, logAuditTrail('REQUEST_DOC_TOKEN'), getDocumentAccessToken);
router.get('/documents/stream', streamPrivateDocument);

// ==================== COMPLAINT ROUTES ====================
router.post(
  '/complaints',
  authenticateToken,
  uploadMiddleware.single('photo'),
  verifyUploadedFileSignature,
  createComplaint
);
router.get('/complaints', authenticateToken, getComplaints);
router.patch('/operator/complaints/:id', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), updateComplaintStatus);
router.delete('/operator/complaints/:id', authenticateToken, authorizeRoles('OPERATOR', 'ADMIN'), deleteComplaint);

// ==================== NOTIFICATION ROUTES ====================
router.get('/notifications', authenticateToken, getMyNotifications);
router.patch('/notifications/:id/read', authenticateToken, markNotificationAsRead);

// ==================== AI ASSISTANT ROUTE ====================
router.post('/ai/chat', handleAiQuery);

// ==================== WHATSAPP CONVERSATIONAL BOT ROUTES ====================
router.post('/whatsapp/bot', waBotLimiter, handleIncomingWhatsAppMessage);
router.get('/whatsapp/history', waBotLimiter, getChatHistory);

// Real Baileys WhatsApp Engine Endpoints
router.get('/whatsapp/status', getBaileysStatus);
router.post('/whatsapp/connect', startBaileysConnection);
router.post('/whatsapp/disconnect', disconnectBaileys);

export default router;
