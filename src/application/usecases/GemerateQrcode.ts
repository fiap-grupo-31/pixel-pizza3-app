import { QRCodeGenerator } from '../../infrastructure/external/qrcode/qrcode';

export class GenerateQRCodeUseCase {
  constructor(private readonly qrCodeGenerator: QRCodeGenerator) {}

  async execute(qrData: string): Promise<string> {
    try {
      const qrCodeUrl = await this.qrCodeGenerator.generateQRCode(qrData);
      return qrCodeUrl;
    } catch (error) {
      throw new Error('Failed to generate QR Code');
    }
  }
}
