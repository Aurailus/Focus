// let SAAgent: any = null;
// let SASocket: any = null;
// let CHANNELID = 110;
// function onreceive(channelId: string, data: string) {
// 	alert('recv ' + channelId + ' ' + data);
// }

// function disconnect() {
// 	try {
// 		if (SASocket !== null) {
// 			SASocket.close();
// 			SASocket = null;
// 			alert('closed connection');
// 		}
// 	}
// 	catch(err: any) {
// 		console.log('exception [' + err.name + '] msg[' + err.message + ']');
// 	}
// }

// let agentCallback = {
// 	onconnect : function(socket: any) {
// 		SASocket = socket;
// 		alert('Successfully connected to remote peer.');
// 		SASocket.setSocketStatusListener(function(reason: string){
// 			alert('connection lost, Reason: [' + reason + ']');
// 			disconnect();
// 		});
// 		SASocket.setDataReceiveListener(onreceive);
// 	},
// 	onerror: alert
// };

// function connect() {
// 	alert('Goin');
// 	if (SASocket) {
// 		alert('already connected');
// 		return false;
// 	}
// 	try {
// 		// @ts-ignore
// 		webapis.sa.requestSAAgent(onsuccess, function (err: any) {
// 			alert('err [' + err.name + '] msg[' + err.message + ']');
// 		});
// 	}
// 	catch(err: any) {
// 		alert('exception [' + err.name + '] msg[' + err.message + ']');
// 	}
// 	return true;
// }

// function fetch() {
// 	try {
// 		SASocket.sendData(CHANNELID, 'Hello Accessory!');
// 	}
// 	catch(err: any) {
// 		alert('exception [' + err.name + '] msg[' + err.message + ']');
// 	}
// }

export default async function init() {
	try {
		// @ts-ignore - webapis is not defined.
		const agents: any[] = await new Promise((resolve, reject) => webapis.sa.requestSAAgent(resolve,
			(err: Error) => reject(new Error(`[1] ${err.name}: ${err.message}`))));

		if (agents.length !== 1) throw new Error('Expected a single SAAgent, got ' + agents.length);
		const agent = agents[0];

		const peer = await new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject(new Error('Finding peers timed out.')), 1000);
			agent.setPeerAgentFindListener({
				onpeeragentfound: function(peer: any) {
					if (peer.appName === 'SyncAP') {
						clearTimeout(timeout);
						resolve(peer);
					}
					else reject(new Error(`Unexpected peer found: ${peer.appName}.`));
				},
				onerror: function(err: string) {
					reject(new Error(`[2] ${err}`));
				}
			});
			agent.findPeerAgents();
		});

		alert('gotcha ' + JSON.stringify(peer));

		// SAAgent.setServiceConnectionListener(agentCallback);
		// SAAgent.requestServiceConnection(peerAgent);
	}
	catch (e) {
		if (e instanceof Error) alert('ERROR: ' + e.message);
		else alert('UNHANDLED ERROR: ' + (e as any));
	}
}
