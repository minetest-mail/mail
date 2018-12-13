(function(){

	webmail.routes["/message/:id"] = {
		view: function(){
			if (!webmail.mails)
				return m("div", "Loading...");

			var id = m.route.param("id");
			var mail = webmail.service.readMail(id);

			console.log(mail);//XXX

			var timeStr = "";

			if (mail.time){
				var time_m = moment(mail.time * 1000);
				var durationStr = moment.duration(time_m - moment()).humanize(true);

				timeStr = time_m.format("YYYY-MM-DD HH:mm:ss") + " (" + durationStr + ")";
			}

			var body = [];

			mail.body.split("\n").forEach(function(line){
				body.push(line);
				body.push( m("br") );
			});

			return [
				m("h2", mail.subject),
				m("h5", [ "From: ", m("b", mail.sender) ]),
				m("h5", [ "Sent: ", m("b", timeStr) ]),
				m("div", body)
			]
		}
	};

})();