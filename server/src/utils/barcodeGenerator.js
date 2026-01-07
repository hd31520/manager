const bwipjs = require('bwip-js')

const generateBarcode = async (text, options = {}) => {
  try {
    const {
      width = 2,
      height = 50,
      format = 'png'
    } = options

    const barcode = await bwipjs.toBuffer({
      bcid: 'code128',
      text: text,
      scale: width,
      height: height,
      includetext: true,
      textxalign: 'center'
    })

    return barcode
  } catch (error) {
    throw new Error(`Barcode generation error: ${error.message}`)
  }
}

const generateQRCode = async (text, options = {}) => {
  try {
    const {
      width = 200,
      height = 200
    } = options

    const qrcode = await bwipjs.toBuffer({
      bcid: 'qrcode',
      text: text,
      width: width,
      height: height
    })

    return qrcode
  } catch (error) {
    throw new Error(`QR code generation error: ${error.message}`)
  }
}

module.exports = {
  generateBarcode,
  generateQRCode
}

