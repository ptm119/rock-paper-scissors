const {
    SlashCommandBuilder,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout
import "../../db"
import "../models/rps";
import DB from "../models/rps";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("가위바위보")
        .setDescription("가위바위보를 합니다")
        .addStringOption((option) =>
            option
                .setName("선택")
                .setDescription("낼 것을 정합니다")
                .setRequired(true)
                .setChoices(
                    { name: "가위", value: ":v:" },
                    { name: "바위", value: ":fist:" },
                    { name: "보", value: ":raised_hand:" },
                )
        ),
    async execute(interaction) {
        const username = `${interaction.user.username}#${interaction.user.discriminator}`;
        let user = await DB.findOne({ username });
        if (!user) {
            user = await DB.create({
                username,
            });
        }
        const selectList = [":fist:", ":raised_hand:", ":v:"];
        const ai = selectList[Math.floor(Math.random() * selectList.length)];
        const player = interaction.options.getString("선택");
        let vs;
        if ((ai === ":fist:" && player === ":raised_hand:") || (ai === ":raised_hand:" && player === ":v:") || (ai === ":v:" && player === ":fist:")) {
            vs = `${player} **승리!** ${ai}`;
        } else if (ai === player) {
            vs = `${player} **비김!** ${ai}`;
        } else {
            vs = `${player} **패배!** ${ai}`;
        }
        await interaction.reply("가위");
        await wait(250);
        await interaction.editReply("가위 바위");
        await wait(250);
        await interaction.editReply("가위 바위 보!");
        await wait(250);
        await interaction.editReply(vs);
    }
}