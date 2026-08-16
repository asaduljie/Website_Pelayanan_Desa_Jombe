import axios from 'axios';

export interface WhatsAppNotificationPayload {
  recipientPhone: string;
  message: string;
}

export class WhatsAppService {
  private static operatorNumber = process.env.OPERATOR_WHATSAPP_NUMBER || '6281234567890';
  private static apiUrl = process.env.WHATSAPP_API_URL || '';
  private static apiKey = process.env.WHATSAPP_API_KEY || '';

  /**
   * Generates a pre-formatted deep link WhatsApp message for direct citizen chat
   */
  public static generateDeepLink(params: {
    applicationNumber?: string;
    serviceName?: string;
    status?: string;
    customMessage?: string;
  }): string {
    let text = `Halo Operator Desa Jombe,\n`;
    if (params.applicationNumber) {
      text += `Saya ingin menanyakan permohonan:\nNomor: ${params.applicationNumber}\n`;
      if (params.serviceName) text += `Layanan: ${params.serviceName}\n`;
      if (params.status) text += `Status: ${params.status}\n`;
    } else if (params.customMessage) {
      text += `${params.customMessage}\n`;
    } else {
      text += `Saya ingin menanyakan informasi pelayanan Desa Jombe.`;
    }

    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${this.operatorNumber}?text=${encodedText}`;
  }

  /**
   * Abstraction method for sending automated WhatsApp messages via Gateway (Fonnte/Wablas/Official WA Business)
   */
  public static async sendNotification(payload: WhatsAppNotificationPayload): Promise<boolean> {
    try {
      // Normalizing Indonesian Phone Number (08xxx -> 628xxx)
      let formattedPhone = payload.recipientPhone.replace(/[^0-9]/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.slice(1);
      }

      if (!this.apiUrl || !this.apiKey) {
        console.log(`[WhatsApp Gateway Sim] Sent to ${formattedPhone}:\n"${payload.message}"`);
        return true;
      }

      // Official Gateway POST Request
      await axios.post(
        this.apiUrl,
        {
          target: formattedPhone,
          message: payload.message,
        },
        {
          headers: {
            Authorization: this.apiKey,
          },
        }
      );
      return true;
    } catch (error) {
      console.error('[WhatsApp Service Error]:', error);
      return false;
    }
  }

  /**
   * Helper to format status update message for citizen
   */
  public static buildStatusMessage(params: {
    userName: string;
    applicationNumber: string;
    serviceName: string;
    status: string;
    notes?: string;
  }): string {
    let statusText = '';
    switch (params.status) {
      case 'VERIFIED':
        statusText = 'DIVERIFIKASI dan memenuhi kelengkapan berkas.';
        break;
      case 'PROCESSING':
        statusText = 'SEDANG DIPROSES oleh Operator Desa.';
        break;
      case 'NEED_REVISION':
        statusText = `MEMBUTUHKAN PERBAIKAN BERKAS.\nCatatan Operator: "${params.notes || 'Mohon periksa kembali dokumen Anda.'}"`;
        break;
      case 'COMPLETED':
        statusText = 'TELAH SELESAI DIPROSES. Surat resmi siap diunduh atau diambil di Kantor Desa Jombe.';
        break;
      case 'REJECTED':
        statusText = `DITOLAK.\nAlasan: "${params.notes || '-'}"`;
        break;
      default:
        statusText = 'telah diperbarui.';
    }

    return `*PEMERINTAH DESA JOMBE*\n*SISTEM PELAYANAN DIGITAL*\n\nYth. Bapak/Ibu ${params.userName},\nPermohonan Anda:\n- Nomor: *${params.applicationNumber}*\n- Layanan: ${params.serviceName}\nStatus saat ini: *${statusText}*\n\nTerima kasih.`;
  }
}
