import Axios from "axios";
// import { getToken } from "@/utils/auth";

const axios = Axios.create({
	baseURL: import.meta.env.VITE_API_ENDPOINT,
	timeout: 60000,
});

// エラーハンドル
axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		throw error;
	}
);

export default axios;