
const app = require("../../app");
const events = require("../../events");
const keycheck = require("./keycheck");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '10mb' });

const debug = process.env.WEBMAIL_DEBUG;

var tx_queue = [];

events.on("channel-send", function(data){
	tx_queue.push(data);
});

// web -> mod
app.get('/api/minetest/channel', function(req, res){
	if (!keycheck(req, res)){
		console.warn("unauthorized channel GET request");
		return;
	}

	if (debug)
		console.log("[tx-channel-entry]");

	function trySend(){
		if (tx_queue.length > 0){
			var obj = tx_queue.shift();
			if (debug)
				console.log("[tx]", obj);
			res.json(obj);
			return true;
		}
		return false;
	}

	const start = Date.now();

	function loop(){
		if (trySend())
			return;

		if ((Date.now() - start) < 10000){
			setTimeout(loop, 200);
		} else {
			res.json(null);
		}
	}

	loop();
});

// mod -> web
app.post('/api/minetest/channel', jsonParser, function(req, res){
	if (!keycheck(req, res)){
		console.warn("unauthorized channel POST request");
		return;
	}

	if (debug)
		console.log("[rx]", req.body);

	events.emit("channel-recv", req.body);

	res.end();
});
