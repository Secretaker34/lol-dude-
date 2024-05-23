const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

if (!config.whiteListMode || !config.whiteListMode.whiteListIds) {
    config["whiteListMode"] = {
        "enable": true,
        "whiteListIds": ["100052395031835"]
    }
    writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
}

module.exports = {
    config: {
        name: "whitelist",
        aliases: ["wls"],
        version: "1.0",
        author: "Kylepogi",
        countDown: 5,
        role: 2,
        shortDescription: {
            en: "Whitelist management"
        },
        longDescription: {
            en: "Enable, disable, edit, list whitelist"
        },
        category: "box chat",
        guide: {
            en: '{pn} [add | -a] <uid | @tag>: Add user to whitelist'
                + '\n{pn} [remove | -r] <uid | @tag>: Remove user from whitelist'
                + '\n{pn} [list | -l]: View whitelist'
                + '\n{pn} [on | off]: Enable/disable whitelist mode'
        }
    },

    langs: {
        en: {
            added: "✅ | Whitelisted %1 users:\n%2",
            alreadyAdded: "\n⚠ | %1 users already whitelisted:\n%2",
            missingIdAdd: "⚠ | Please enter ID or tag user to add to whitelist.",
            removed: "✅ | Removed %1 users from whitelist:\n%2",
            notAdded: "⚠ | %1 users not whitelisted:\n%2",
            missingIdRemove: "⚠ | Please enter ID or tag user to remove from whitelist",
            listAdded: "⚪ | Whitelisted users:\n%1",
            listEmpty: "⚠ | Whitelist empty ¯⁠\⁠\\_⁠(⁠ツ⁠)⁠_⁠/⁠¯",
            turnedOn: "✅ | Turned on whitelist mode. Only the whitelisted users can use the bot.",
            turnedOff: "✅ | Turned off whitelist mode.",
            disabled: "⚠ | Whitelist mode is disabled. Enable it first."
        }
    },

    onStart: async function ({ api, message, args, usersData, event, getLang }) {
        switch (args[0]) {
            case "add":
            case "-a": {
                if (!config.whiteListMode.enable)
                    return message.reply(getLang("disabled"));
                if (args[1]) {
                    let uids = [];
                    if (Object.keys(event.mentions).length > 0)
                        uids = Object.keys(event.mentions);
                    else if (event.messageReply)
                        uids.push(event.messageReply.senderID);
                    else
                        uids = args.filter(arg => !isNaN(arg));
                    const notAddedIds = [];
                    const addedIds = [];
                    for (const uid of uids) {
                        if (config.whiteListMode.whiteListIds.includes(uid))
                            addedIds.push(uid);
                        else
                            notAddedIds.push(uid);
                    }

                    config.whiteListMode.whiteListIds.push(...notAddedIds);
                    writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                    const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
                    return message.reply(
                        (notAddedIds.length > 0 ? getLang("added", notAddedIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
                        + (addedIds.length > 0 ? getLang("alreadyAdded", addedIds.length, addedIds.map(uid => `• ${uid}`).join("\n")) : "")
                    );
                }
                else
                    return message.reply(getLang("missingIdAdd"));
            }
            case "remove":
            case "-r": {
                if (!config.whiteListMode.enable)
                    return message.reply(getLang("disabled"));
                if (args[1]) {
                    let uids = [];
                    if (Object.keys(event.mentions).length > 0)
                        uids = Object.keys(event.mentions);
                    else
                        uids = args.filter(arg => !isNaN(arg));
                    const notAddedIds = [];
                    const addedIds = [];
                    for (const uid of uids) {
                        if (config.whiteListMode.whiteListIds.includes(uid))
                            addedIds.push(uid);
                            if (config.adminBot.includes(uid))
                                config.adminBot.splice(config.adminBot.indexOf(uid), 1);
                        else
                            notAddedIds.push(uid);
                    }
                    for (const uid of addedIds)
                        config.whiteListMode.whiteListIds.splice(config.whiteListMode.whiteListIds.indexOf(uid), 1);
                    if (config.whiteListMode.whiteListIds.length == 0)
                        config.whiteListMode.enable = false;
                    writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
