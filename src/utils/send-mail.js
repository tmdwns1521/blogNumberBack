import { createTransport } from 'nodemailer';

// nodemailer 설정
const smtpTransport = createTransport({
	service: 'Naver',
	auth: {
		user: process.env.NAVER_EMAIL_ID,
		pass: process.env.NAVER_EMAIL_PW,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

function sendMail(from, to, subject, text, html) {
	new Promise((resolve, reject) => {
		const mailOptions = {
			...(from && { from }),
			...(to && { to }),
			...(subject && { subject }),
			...(text && { text }),
			...(html && { html }),
		};
		smtpTransport.sendMail(mailOptions, (err, info) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(info);
			smtpTransport.close();
		});
	});
}

export { sendMail };
