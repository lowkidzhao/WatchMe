import { useComputersStore } from "@/stores/mycomputers";

export default function initialize() {
	// 初始化函数
	getdata();
}

function getdata() {
	// 获取数据函数
	const store = useComputersStore();
	const getComputers = JSON.parse(localStorage.getItem("computers"));
	if (getComputers) {
		store.computers = getComputers;
	}
}
