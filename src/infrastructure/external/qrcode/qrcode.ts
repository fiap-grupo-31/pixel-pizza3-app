import qrcode from 'qrcode';

export interface QRCodeGenerator {
  generateQRCode(qrData: string): Promise<string>;
}

export class QRCodeGeneratorAdapter implements QRCodeGenerator {
  async generateQRCode(qrData: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      qrcode.toDataURL(qrData, (err: any, url: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
}