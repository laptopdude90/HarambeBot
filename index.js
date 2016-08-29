"use strict";

const Discord = require("discord.js");
const client = new Discord.Client();
const promptly = require("promptly");

var players = {};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// TODO: Modularize into functions/objects.
client.on("message", (message) => {
	let server = message.server;
	let author = message.author;
	let content = message.cleanContent;
	let args = content.split(" ");

	if(message.channel.isPrivate) { 
		author.sendMessage("**About**\nDigital Harambe reincarnation.\n\nDeveloper: N3rdFall\nVersion: 0.1.1\n\n**Commands (WIP)**\n• !info - *Details about the ape himself.*\n• !dicksout - *Get 'em ready.*\n• !baby - *It's more than a three year old now.*");
		return; 
	}

	function processCommands() {
		switch(args[0].toLowerCase()) {
			case "!info":
				author.sendMessage("**About**\nDigital Harambe reincarnation.\n\nDeveloper: N3rdFall\nVersion: 0.1.1\n\n**Commands (WIP)**\n• !info - *Details about the ape himself.*\n• !dicksout - *Get 'em ready.*\n• !baby - *It's more than a three year old now.*");
				break;
			case "!dicksout":
				client.sendFile(message, "http://i2.mirror.co.uk/incoming/article8075004.ece/ALTERNATES/s615b/Harambe.jpg", "", ":monkey::point_down::point_down: ***DICKS OUT FOR*** :point_down::point_down::monkey:", (err, response) => setTimeout(() => response.delete(), 10000));
				break;
			case "!baby":
				let members = server.members.getAll("status", "online");
				let baby = members.random();
				while(baby.username === "HarambeBot") {
					baby = members.random();
				}
				let babyTime = getRandomInt(5, 31);
				client.sendMessage(message, `:monkey::baby: **${baby.username} is in my enclosure for ${babyTime}s!** :baby::monkey:`, (err, response) => {
					let timer = setInterval(() => {
						if(babyTime) {
							babyTime -= 1;
							server.setNickname(`Baby (${babyTime}s)`, baby);
							response.update(`:monkey::baby: **${baby.username} is in my enclosure for ${babyTime}s!** :baby::monkey:`);
						} else { 
							response.delete();
							server.setNickname(null, baby);
							clearInterval(timer);
						}
					}, 1000);
				});
				break;
		}
	}

	// TODO: Write and read data from local file in JSON.
	if(players[author.username]) {
		let player = players[author.username];
		let previousMessage = player.previousMessage;
		let timesBlocked = players[author.username].timesBlocked;

		if(player.isSilenced) {
			message.delete((err) => author.sendMessage("You are currently silenced due to spam."));
		} else if(content === previousMessage) {
			if(timesBlocked >= 10) {
				author.sendMessage("You have been silenced for 3 minutes due to spam.");
				player.previousMessage = "";
				player.timesBlocked = 0;
				player.isSilenced = true;
				message.delete();
				setTimeout(() => {
					player.isSilenced = false;
					author.sendMessage("You are no longer silenced.");
				}, 180000);
			} else {
				author.sendMessage("Your message was deleted as you have sent it before.");
				player.timesBlocked += 1;
				message.delete();
			}
		} else {
			player.previousMessage = content;
			player.timesBlocked = 0;

			processCommands();
		}
	} else {
		players[author.username] = {
			previousMessage: content,
			timesBlocked: 0,
			isSilenced: false
		};

		processCommands();
	}
});

client.on("serverNewMember", (server, user) => {
	client.sendMessage(server.channels[0], `${user.username} has entered the zoo!`);
});

client.on("ready", () => {
	console.log("HarambeBot has logged in successfully.\n");
	console.log("Active Servers\n-------");
	for(let server of client.servers) {
		console.log(server.name);
	}
});

// TODO: Convert to use promises.
promptly.prompt("Email: ", (err, result) => {
	let email = result;
	promptly.prompt("Password: ", (err, result) => {
		let password = result;
		client.login(email, password);
	});
});