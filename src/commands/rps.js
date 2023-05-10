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
            vs = `(나)  ${player}  **승리!**  ${ai}  (봇)`;
            if (user.stack + 1 >= 2) {
                vs += `\n${user.stack + 1}연승 중!`;
            }
            vs += `\n+ ${2 ** (user.stack)}포인트`;
            vs += `\n현재 포인트 : ${user.point + 2 ** user.stack}`
            await DB.updateOne({ username: user.username }, { stack: user.stack + 1, point: user.point + 2 ** (user.stack) });
        } else if (ai === player) {
            user = await DB.findOne({ username });
            vs = `(나)  ${player}  **비김!**  ${ai}  (봇)`;
            if (user.stack >= 2) {
                vs += "\n연승 깨짐!";
            }
            vs += `\n현재 포인트 : ${user.point}`
            await DB.updateOne({ username: user.username }, { stack: 0 });
        } else {
            user = await DB.findOne({ username });
            vs = `(나)  ${player}  **패배!**  ${ai}  (봇)`;
            console.log(user);
            if (user.point !== 0) {
                vs += `\n- ${user.stack === 0 ? 1 : user.stack}포인트`;
                vs += `\n현재 포인트 : ${user.point - user.stack === 0 ? 1 : user.stack}`
                await DB.updateOne({ username: user.username }, { stack: 0, point: (user.point - user.stack === 0) || (user.stack === 0) ? 1 : user.stack });
            } else {
                vs += `\n현재 포인트 : ${user.point}`
                await DB.updateOne({ username: user.username }, { stack: 0 });
            }

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