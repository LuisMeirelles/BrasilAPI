/* eslint-disable no-bitwise */
export const calculateCrc = (payload) => {
  const INITIAL = 0xffff;
  const POLYNOMIAL = 0x1021;

  let crc = INITIAL;

  String(payload)
    .split('')
    .forEach((char) => {
      crc ^= char.charCodeAt(0) << 8;

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 8; i++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ POLYNOMIAL;
        } else {
          crc <<= 1;
        }
        crc &= 0xffff;
      }
    });

  return crc.toString(16).toUpperCase().padStart(4, '0');
};
