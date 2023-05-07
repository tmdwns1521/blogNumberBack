const generateRandomPassword = () => {
	let a = 10 ** 8;
	return Math.floor(Math.random() * a)
		.toString()
		.padStart(8, '0');
};

export { generateRandomPassword };
