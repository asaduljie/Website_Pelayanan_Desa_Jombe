import fs from 'fs';

export const validateMagicBytes = (filePath: string): boolean => {
  try {
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    const hex = buffer.toString('hex').toUpperCase();

    // PDF Magic Byte: %PDF- (25504446)
    const isPDF = hex.startsWith('25504446');
    // PNG Magic Byte: 89504E47
    const isPNG = hex.startsWith('89504E47');
    // JPG/JPEG Magic Byte: FFD8FF
    const isJPG = hex.startsWith('FFD8FF');

    return isPDF || isPNG || isJPG;
  } catch (error) {
    return false;
  }
};
