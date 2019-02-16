/**
 * Copyright 2018 OPEN-EYES S.r.l.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/

var PosixMQ = require('posix-mq');

module.exports = function (RED) {
	"use strict";

	function GuiScreen(config) {
		RED.nodes.createNode(this,config);

		this.fontsize = 30;//Number(config.fontsize);
		this.fontcol = "000000";//config.fontcol;
		this.maincol = config.maincol;
		this.gradcol = config.gradcol;
		this.bid = 0;//Number(config.bid);

		var posixmq = new PosixMQ();
		var node = this;
		var msg;
		var n;
		var send = false;

		posixmq.open({ name: '/gui_cmd',create: true,mode: '0777',maxmsgs: 10, msgsize: 256 });
		node.status({fill: "green", shape: "dot", text: 'link'});

		node.on('input', function(msg) {
			var str;
			var payload=msg.payload;
			var n;

			str = "SCREEN," + node.bid.toString() +
 						"," + node.fontsize +
 						"," + node.fontcol +
 						"," + node.maincol +
 						"," + node.gradcol +
						",END";

			n = posixmq.push(str);
		});

		node.on('close', function() {
			posixmq.unlink();
			posixmq.close();
			node.status({fill: "red", shape: "dot", text: 'link'});
		});
	}

	RED.nodes.registerType("screen", GuiScreen);
}
