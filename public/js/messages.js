import state from './state.js';
import { deleteMail } from './service.js';

var InboxRow = {
	view: function(vnode){
		function openMail(){
			m.route.set("/message/:id", { id: vnode.attrs.row.index });
		}

		var timeStr = "";

		if (vnode.attrs.row.time){
			var time_m = moment(vnode.attrs.row.time * 1000);
			var durationStr = moment.duration(time_m - moment()).humanize(true);

			timeStr = time_m.format("YYYY-MM-DD HH:mm:ss") + " (" + durationStr + ")";
		}

		var rowClass = vnode.attrs.row.unread ? "table-primary" : "";

		return m("tr", {class: rowClass}, [
			m("td", vnode.attrs.row.sender),
			m("td", vnode.attrs.row.subject),
			m("td", timeStr),
			m("td", [
				m("div", { class: "btn-group" }, [
					m("button[type=button]", { class: "btn btn-primary", onclick: openMail },[
						m("i", {class:"fa fa-envelope-open"}),
						"Open"
					]),
					m("button[type=button]", {
						class: "btn btn-danger",
						onclick: () => deleteMail(vnode.attrs.row.index)
					},[
						m("i", {class:"fa fa-trash"}),
						"Remove"
					])
				])
			])
		]);
	}
};

var InboxTable = {
	view: function(){
		if (!state.mails){
			return m("div", "Loading...");
		}

		var head = m("thead", m("tr", [
			m("th", "Sender"),
			m("th", "Subject"),
			m("th", "Sent"),
			m("th", "Action")
		]));

		var body = m("tbody", state.mails.map(function(row){
			return m(InboxRow, {row: row});
		}));

		return m("table",
			{class:"table table-condensed table-striped table-sm"},
			[head, body]
		);
	}
};

export default {
	view: function(){
		if (state.loginState.loggedIn)
			return m(InboxTable);
		else
			return null;
	}
};
