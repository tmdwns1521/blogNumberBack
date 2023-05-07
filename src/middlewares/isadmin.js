import { userService } from '../services';

async function isAdmin(req, res, next) {
	// loign되었다면 id를 가져옴
	const userId = req.currentUserId;
	const user = await userService.getUserInfo(userId);
	const role = user.role;

	if (role !== 'admin') {
		throw new Error(`관리자가 아니어서 상품추가를 할 수 없습니다.`);
	}

	next();
}

export { isAdmin };
