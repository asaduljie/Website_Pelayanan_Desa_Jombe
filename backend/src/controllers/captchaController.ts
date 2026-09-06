import { Request, Response } from 'express';
import crypto from 'crypto';

const CAPTCHA_SECRET = process.env.JWT_SECRET || 'desa-jombe-digital-captcha-salt-2026';

export const generateCaptcha = (req: Request, res: Response) => {
  const num1 = Math.floor(Math.random() * 12) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const sum = num1 + num2;

  const payload = {
    answer: sum,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 menit
  };

  const payloadStr = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payloadStr).digest('hex');
  const token = Buffer.from(`${payloadStr}.${signature}`).toString('base64');

  return res.status(200).json({
    status: 'success',
    data: {
      question: `Berapa ${num1} + ${num2} = ?`,
      token: token,
    },
  });
};

export const verifyCaptchaToken = (token: string, userAnswer: string | number): boolean => {
  try {
    if (!token || userAnswer === undefined || userAnswer === null) return false;
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split('.');
    if (parts.length !== 2) return false;

    const [payloadStr, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', CAPTCHA_SECRET).update(payloadStr).digest('hex');
    if (signature !== expectedSig) return false;

    const payload = JSON.parse(payloadStr);
    if (Date.now() > payload.expiresAt) return false;

    return Number(userAnswer) === Number(payload.answer);
  } catch (e) {
    return false;
  }
};
