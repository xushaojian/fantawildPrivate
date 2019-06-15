 // 是否禁用代理
//const noProxy = process.env.NO_PROXY === 'true';
//  const noProxy=true;
// 代码中会兼容本地 service mock 以及部署站点的静态数据

// export default ( {"/*":"http://10.159.11.75:8083"} );

export default {
	"GET /api/*":"http://10.159.11.75:8083",
	"POST /api/*":"http://10.159.11.75:8083",
	"GET /4-1Api/*":"http://10.159.10.143:8888",
	"POST /4-1Api/*":"http://10.159.10.143:8888"
}
