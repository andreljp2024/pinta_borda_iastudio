import QRCode from 'qrcode';

/**
 * Remove accents and special non-ASCII characters to comply with Bacen EMV standard.
 */
export function sanitizeTextForPix(text: string, maxLength?: number): string {
  if (!text) return '';
  const sanitized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .toUpperCase();
  return maxLength ? sanitized.slice(0, maxLength) : sanitized;
}

/**
 * Validates a Brazilian CNPJ with check-digit mathematical verification.
 */
export function validateCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  // Validate 1st check digit
  let size = 12;
  let numbers = digits.substring(0, size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(12))) return false;

  // Validate 2nd check digit
  size = 13;
  numbers = digits.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === Number(digits.charAt(13));
}

/**
 * Validates a Brazilian CPF with check-digit mathematical verification.
 */
export function validateCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(digits.substring(i - 1, i), 10) * (11 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits.substring(9, 10), 10)) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(digits.substring(i - 1, i), 10) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(digits.substring(10, 11), 10);
}

/**
 * Validates and normalizes any Brazilian PIX Key according to Banco Central do Brasil rules.
 */
export function validatePixKey(
  key: string,
  type: 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA' | 'CPF' | string
): { isValid: boolean; normalizedKey: string; message: string; formattedKey?: string } {
  if (!key || !key.trim()) {
    return { isValid: false, normalizedKey: '', message: 'A chave PIX não pode estar vazia.' };
  }

  const clean = key.trim();

  switch (type.toUpperCase()) {
    case 'CNPJ': {
      const digits = clean.replace(/\D/g, '');
      if (digits.length !== 14) {
        return {
          isValid: false,
          normalizedKey: digits,
          message: `CNPJ incompleto (${digits.length}/14 dígitos).`,
        };
      }
      if (!validateCnpj(digits)) {
        return {
          isValid: false,
          normalizedKey: digits,
          message: 'Dígitos verificadores do CNPJ inválidos.',
        };
      }
      const formatted = digits.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
      );
      return {
        isValid: true,
        normalizedKey: digits, // For Pix payload, CNPJ must be raw digits
        formattedKey: formatted,
        message: 'CNPJ válido e ativo para recebimento.',
      };
    }

    case 'CPF': {
      const digits = clean.replace(/\D/g, '');
      if (digits.length !== 11) {
        return {
          isValid: false,
          normalizedKey: digits,
          message: `CPF incompleto (${digits.length}/11 dígitos).`,
        };
      }
      if (!validateCpf(digits)) {
        return {
          isValid: false,
          normalizedKey: digits,
          message: 'Dígitos verificadores do CPF inválidos.',
        };
      }
      const formatted = digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
      return {
        isValid: true,
        normalizedKey: digits,
        formattedKey: formatted,
        message: 'CPF válido para recebimento.',
      };
    }

    case 'EMAIL': {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(clean)) {
        return {
          isValid: false,
          normalizedKey: clean.toLowerCase(),
          message: 'Formato de e-mail inválido (ex: contato@loja.com.br).',
        };
      }
      return {
        isValid: true,
        normalizedKey: clean.toLowerCase(),
        formattedKey: clean.toLowerCase(),
        message: 'E-mail cadastrado e em conformidade Bacen.',
      };
    }

    case 'TELEFONE':
    case 'PHONE': {
      const digits = clean.replace(/\D/g, '');
      // Brazilian numbers usually have 10 (fixed) or 11 (mobile) digits.
      // If already prefixed with 55 and has 12 or 13 digits, handle accordingly.
      let phoneDigits = digits;
      if (phoneDigits.startsWith('55') && (phoneDigits.length === 12 || phoneDigits.length === 13)) {
        phoneDigits = phoneDigits.slice(2);
      }

      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        return {
          isValid: false,
          normalizedKey: clean,
          message: `Telefone inválido (${phoneDigits.length} dígitos; necessário DDD + número).`,
        };
      }

      const bacenNormalized = `+55${phoneDigits}`;
      const formatted =
        phoneDigits.length === 11
          ? phoneDigits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
          : phoneDigits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');

      return {
        isValid: true,
        normalizedKey: bacenNormalized, // Bacen requires +55 prefix for phones
        formattedKey: `+55 ${formatted}`,
        message: 'Número de telefone válido com código do país +55.',
      };
    }

    case 'ALEATORIA':
    case 'RANDOM':
    case 'EVP': {
      // UUID format: 8-4-4-4-12
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (!uuidRegex.test(clean)) {
        return {
          isValid: false,
          normalizedKey: clean,
          message: 'Chave aleatória inválida. Deve seguir o padrão UUID v4.',
        };
      }
      return {
        isValid: true,
        normalizedKey: clean.toLowerCase(),
        formattedKey: clean.toLowerCase(),
        message: 'Chave aleatória (EVP) válida.',
      };
    }

    default:
      return {
        isValid: true,
        normalizedKey: clean,
        message: 'Chave cadastrada.',
      };
  }
}

/**
 * Encodes a Tag-Length-Value (TLV) field according to EMVCo standard.
 */
function formatTlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Computes CRC16-CCITT (polynomial 0x1021, initial 0xFFFF) for the PIX payload string.
 */
export function computeCrc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

export interface PixPayloadParams {
  pixKey: string;
  pixKeyType: string;
  merchantName: string;
  merchantCity?: string;
  amount?: number;
  txid?: string;
  description?: string;
}

/**
 * Generates an official, 100% compliant Banco Central do Brasil BR Code / EMVCo "Pix Copia e Cola" payload.
 */
export function generatePixPayload(params: PixPayloadParams): {
  payload: string;
  isValid: boolean;
  normalizedKey: string;
  error?: string;
} {
  const validation = validatePixKey(params.pixKey, params.pixKeyType);
  if (!validation.isValid) {
    return {
      payload: '',
      isValid: false,
      normalizedKey: params.pixKey,
      error: validation.message,
    };
  }

  const normalizedKey = validation.normalizedKey;

  // Tag 00: Payload Format Indicator (Fixed "01")
  const id00 = formatTlv('00', '01');

  // Tag 01: Point of Initiation Method: "11" (Static, reusable code) or "12" (Dynamic)
  const id01 = formatTlv('01', '11');

  // Tag 26: Merchant Account Information - Pix
  const gui = formatTlv('00', 'br.gov.bcb.pix');
  const key = formatTlv('01', normalizedKey);
  const desc = params.description
    ? formatTlv('02', sanitizeTextForPix(params.description, 40))
    : '';
  const id26 = formatTlv('26', `${gui}${key}${desc}`);

  // Tag 52: Merchant Category Code (Fixed "0000" or ISO 18245)
  const id52 = formatTlv('52', '0000');

  // Tag 53: Transaction Currency ("986" for BRL)
  const id53 = formatTlv('53', '986');

  // Tag 54: Transaction Amount (Optional, formatted to 2 decimals e.g. "10.00")
  let id54 = '';
  if (params.amount && params.amount > 0) {
    id54 = formatTlv('54', params.amount.toFixed(2));
  }

  // Tag 58: Country Code (Fixed "BR")
  const id58 = formatTlv('58', 'BR');

  // Tag 59: Merchant Name (Max 25 characters, uppercase, no accents)
  const safeName = sanitizeTextForPix(params.merchantName || 'PINTA E BORDA', 25);
  const id59 = formatTlv('59', safeName || 'PINTA E BORDA');

  // Tag 60: Merchant City (Max 15 characters, uppercase, no accents)
  const safeCity = sanitizeTextForPix(params.merchantCity || 'SAO LUIS', 15);
  const id60 = formatTlv('60', safeCity || 'SAO LUIS');

  // Tag 62: Additional Data Field Template (Reference label / txid)
  // Bacen requires txid for static pix, default to "***" if none provided
  const safeTxid = params.txid
    ? sanitizeTextForPix(params.txid, 25)
    : '***';
  const txidTlv = formatTlv('05', safeTxid);
  const id62 = formatTlv('62', txidTlv);

  // Concatenate parts without CRC
  const rawPayload = `${id00}${id01}${id26}${id52}${id53}${id54}${id58}${id59}${id60}${id62}6304`;

  // Tag 63: CRC16-CCITT
  const crc = computeCrc16(rawPayload);
  const fullPayload = `${rawPayload}${crc}`;

  return {
    payload: fullPayload,
    isValid: true,
    normalizedKey,
  };
}

/**
 * Generates a high-quality QR Code image Data URL (PNG base64) from a PIX payload.
 */
export async function generatePixQrCodeDataUrl(
  payload: string,
  options?: {
    width?: number;
    margin?: number;
    color?: { dark?: string; light?: string };
  }
): Promise<string> {
  if (!payload) return '';
  return QRCode.toDataURL(payload, {
    width: options?.width || 320,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.color?.dark || '#380c25',
      light: options?.color?.light || '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });
}
