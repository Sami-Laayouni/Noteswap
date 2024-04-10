// QR code
import React from "react";
import QRCode from "qrcode.react";

const QRCodeComponent = ({ url }) => {
  return <QRCode fgColor="#3a3a3a" size={135} value={url} />;
};

export default QRCodeComponent;
