import { useComputersStore } from "@/stores/mycomputers";

export default function initialize() {
	// 初始化函数
	getdata();
}

function getdata() {
	localStorage.setItem("computers", JSON.stringify(data));
	// 获取数据函数
	const store = useComputersStore();
	const getComputers = JSON.parse(localStorage.getItem("computers"));
	if (getComputers) {
		store.computers = getComputers;
		store.computerNow = getComputers[0];
	}
}

//模拟数据
const data = [
	{
		memory: {
			total: 32292,
			free: 26019,
			used: 6273,
		},
		cpu: {
			manufacturer: "Intel",
			brand: "Core™ i5-10200H",
			speed: 2.5,
			cores: 16,
			physicalCores: 8,
			usage: 8,
			temperature: null,
		},
		gpu: {
			models: ["NVIDIA GeForce RTX 3060"],
			temperature: [46],
		},
		network: {
			ip4: ["192.168.41.48", "127.0.0.1", "", ""],
			ip6: ["", "::1", "", ""],
			mac: [
				"c8:b2:9b:f0:71:c5",
				"00:00:00:00:00:00",
				"00:2b:67:d4:f3:47",
				"6c:5d:3a:1b:2c:a5",
			],
		},
		disk: {
			diskinfo: [
				{
					device: "\\\\.\\PHYSICALDRIVE2",
					type: "HD",
					name: "Microsoft Storage Space Device",
					vendor: "",
					size: 208548992000,
					bytesPerSector: 4096,
					totalCylinders: 15175,
					totalHeads: 255,
					totalSectors: 243786375,
					totalTracks: 3869625,
					tracksPerCylinder: 255,
					sectorsPerTrack: 63,
					firmwareRevision: "0.1",
					serialNum: "{7fe6e9cc-a30b-461f-9cf7-3bfba6c2e61c}",
					interfaceType: "SCSI",
					smartStatus: "Ok",
					temperature: null,
				},
				{
					device: "\\\\.\\PHYSICALDRIVE1",
					type: "SSD",
					name: "SAMSUNG MZVLB512HBJQ-000L2",
					vendor: "Samsung",
					size: 302105932800,
					bytesPerSector: 512,
					totalCylinders: 62260,
					totalHeads: 255,
					totalSectors: 1000206900,
					totalTracks: 15876300,
					tracksPerCylinder: 255,
					sectorsPerTrack: 63,
					firmwareRevision: "3L1QEXF7",
					serialNum: "0025_3886_01D3_9668.",
					interfaceType: "NVMe",
					smartStatus: "Ok",
					temperature: null,
				},
			],
		},
		system: {
			systemInfo: {
				manufacturer: "aaaa",
				model: "81Y7",
				version: "Lenovo Legion Y700",
				serial: "PF2DLZER",
				uuid: "beb85a58-c4ab-11ea-80de-002b67d4f3sw",
				sku: "LENOVO_MT_81Y7_BU_idea_FM_IDEAPAD",
				virtual: false,
			},
		},
	},
	{
		memory: {
			total: 8292,
			free: 2299,
			used: 5993,
		},
		cpu: {
			manufacturer: "AMD",
			brand: "Core™ i5-10300H",
			speed: 2.5,
			cores: 8,
			physicalCores: 4,
			usage: 9,
			temperature: null,
		},
		gpu: {
			models: ["NVIDIA GeForce RTX 4060"],
			temperature: [45],
		},
		network: {
			ip4: ["192.168.31.48", "127.0.0.1", "", ""],
			ip6: ["", "::1", "", ""],
			mac: [
				"c8:b2:9b:f0:71:c5",
				"00:00:00:00:00:00",
				"00:2b:67:d4:f3:47",
				"6c:5d:3a:1b:2c:a5",
			],
		},
		disk: {
			diskinfo: [
				{
					device: "\\\\.\\PHYSICALDRIVE2",
					type: "HD",
					name: "Microsoft Storage Space Device",
					vendor: "",
					size: 998548992000,
					bytesPerSector: 4096,
					totalCylinders: 15175,
					totalHeads: 255,
					totalSectors: 243786375,
					totalTracks: 3869625,
					tracksPerCylinder: 255,
					sectorsPerTrack: 63,
					firmwareRevision: "0.1",
					serialNum: "{7fe6e9cc-a30b-461f-9cf7-3bfba6c2e61c}",
					interfaceType: "SCSI",
					smartStatus: "Ok",
					temperature: null,
				},
				{
					device: "\\\\.\\PHYSICALDRIVE1",
					type: "SSD",
					name: "SAMSUNG MZVLB512HBJQ-000L2",
					vendor: "Samsung",
					size: 512105932800,
					bytesPerSector: 512,
					totalCylinders: 62260,
					totalHeads: 255,
					totalSectors: 1000206900,
					totalTracks: 15876300,
					tracksPerCylinder: 255,
					sectorsPerTrack: 63,
					firmwareRevision: "3L1QEXF7",
					serialNum: "0025_3886_01D3_9668.",
					interfaceType: "NVMe",
					smartStatus: "Ok",
					temperature: null,
				},
			],
		},
		system: {
			systemInfo: {
				manufacturer: "LENOVO",
				model: "81Y7",
				version: "Leno",
				serial: "PF2DLZER",
				uuid: "beb85a58-c4ab-11ea-80de-002b67d4f3ww",
				sku: "LENOVO_MT_81Y7_BU_idea_FM_IDEAPAD",
				virtual: false,
			},
		},
	},
	{
		memory: {
			total: 16292,
			free: 10761,
			used: 5531,
		},
		cpu: {
			manufacturer: "Intel",
			brand: "Core™ i5-10300H",
			speed: 2.5,
			cores: 8,
			physicalCores: 4,
			usage: 3,
		},
		gpu: {
			models: ["NVIDIA GeForce RTX 2060"],
		},
		network: {
			ip4: ["198.18.0.1", "192.168.31.48", "127.0.0.1", "", "", ""],
			ip6: ["fe80::764d:c73:77b:b47a", "", "::1", "", "", ""],
			mac: [
				"00:00:00:00:00:00",
				"c8:b2:9b:f0:71:c5",
				"00:00:00:00:00:00",
				"00:2b:67:d4:f3:47",
				"6c:5d:3a:1b:2c:a5",
				"",
			],
		},
		disk: {
			diskinfo: [
				{
					device: "\\\\.\\PHYSICALDRIVE2",
					type: "HD",
					name: "Microsoft Storage Space Device",
					vendor: "",
					size: 998548992000,
					bytesPerSector: 4096,
					totalCylinders: 15175,
					totalHeads: 255,
					totalSectors: 243786375,
					totalTracks: 3869625,
					tracksPerCylinder: 255,
					sectorsPerTrack: 63,
					firmwareRevision: "0.1",
					serialNum: "{7fe6e9cc-a30b-461f-9cf7-3bfba6c2e61c}",
					interfaceType: "SCSI",
					smartStatus: "Ok",
					temperature: null,
				},
				{
					device: "\\\\.\\PHYSICALDRIVE1",
					type: "SSD",
					name: "SAMSUNG MZVLB512HBJQ-000L2",
					vendor: "Samsung",
					size: 512105932800,
					bytesPerSector: 512,
					totalCylinders: 62260,
					totalHeads: 255,
					totalSectors: 1000206900,
					totalTracks: 15876300,
					tracksPerCylinder: 255,
					sectorsPerTrack: 63,
					firmwareRevision: "3L1QEXF7",
					serialNum: "0025_3886_01D3_9668.",
					interfaceType: "NVMe",
					smartStatus: "Ok",
					temperature: null,
				},
			],
			diskusage: [
				{
					fs: "C:",
					type: "NTFS",
					size: 107374178304,
					used: 80044953600,
					available: 27329224704,
					use: 74.55,
					mount: "C:",
					rw: true,
				},
				{
					fs: "D:",
					type: "NTFS",
					size: 403396620288,
					used: 212821499904,
					available: 190575120384,
					use: 52.76,
					mount: "D:",
					rw: true,
				},
				{
					fs: "E:",
					type: "NTFS",
					size: 998444605440,
					used: 685003341824,
					available: 313441263616,
					use: 68.61,
					mount: "E:",
					rw: true,
				},
			],
		},
		system: {
			systemInfo: {
				manufacturer: "LENOVO",
				model: "81Y7",
				version: "Lenovo Legion Y7000 2020H",
				serial: "PF2DLZER",
				uuid: "beb85a58-c4ab-11ea-80de-002b67d4f347",
				sku: "LENOVO_MT_81Y7_BU_idea_FM_IDEAPAD",
				virtual: false,
			},
		},
	},
];
