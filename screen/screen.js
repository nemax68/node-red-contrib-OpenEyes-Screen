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
        this.name = config.name;
        this.cmd = config.cmd;
        this.path = config.path;
		this.maincol = config.maincol;
		this.gradcol = config.gradcol;
        this.imgposx = config.imgposx;
        this.imgposy = config.imgposy;
        this.queue = '/gui_cmd';
		var posixmq = new PosixMQ();
		var node = this;
		var msg;

		node.on('input', function(msg) {
            var str;
            var payload=msg.payload;
            var n;

            try{
                switch (node.cmd) {
                case "1":
                    var type = "addimage";
                    var path=node.path;
                    var position = { "x" : node.imgposx, "y" : node.imgposy };
                    break;
                case "2":
                    var type = "delimage";
                    var color = {"main":node.maincol,"gradient":node.gradcol}
                    break;
                case "3":
                    var type = "clrscreen";
                    var color = {"main":node.maincol,"gradient":node.gradcol}
                    break;
                case "4":
                    break;    
                }

                var obj = {
                    type: type,
                    name: node.name,
                    path: path,
                    position: position,
                    color: color
                };

                var strJSON = JSON.stringify(obj);

                console.log(strJSON);

                posixmq.open({ name: node.queue, create: false });
                n = posixmq.push(strJSON);
                posixmq.close();
                node.status({fill: "green", shape: "dot", text: node.queue.toString()});
            }
            catch(err){
                console.error(err);
                node.status({fill: "red", shape: "dot", text: node.queue.toString()});
            }


        });

	}

	RED.nodes.registerType("screen", GuiScreen);
}
