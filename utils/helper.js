const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      tls: {
        rejectUnauthorized: false // Menonaktifkan verifikasi sertifikat
      },
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail(
      {
        from: process.env.USER,
        to: email,
        subject: subject,
        html: text,
      }
      // (error, info) => {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log(info.response);
      //   }
      // }
    );
    console.log("email sent succesfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
