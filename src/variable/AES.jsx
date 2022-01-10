const Decrypt = (ciphertext) => {
    // Encrypt
    var CryptoJS = require("crypto-js");
    var key = CryptoJS.enc.Utf8.parse('89075EF6029451BD804461802F99EB64')
    
    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(ciphertext, key,  { 
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return bytes.toString(CryptoJS.enc.Utf8);
    
}

export {
    Decrypt
}