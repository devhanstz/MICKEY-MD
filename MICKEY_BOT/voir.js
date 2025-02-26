const { zokou } = require("../framework/zokou");

zokou({ nomCom: "save", categorie: "General" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;

  if (!ms) {
    return repondre("*Please mention the media to download and resend.*");
  }

  let media = ms.message;

  if (media.imageMessage) {
    let image = await zk.downloadAndSaveMediaMessage(media.imageMessage);
    await zk.sendMessage(dest, { image: { url: image }, caption: media.imageMessage.caption || "" });

  } else if (media.videoMessage) {
    let video = await zk.downloadAndSaveMediaMessage(media.videoMessage);
    await zk.sendMessage(dest, { video: { url: video }, caption: media.videoMessage.caption || "" });

  } else if (media.audioMessage) {
    let audio = await zk.downloadAndSaveMediaMessage(media.audioMessage);
    await zk.sendMessage(dest, { audio: { url: audio }, mimetype: 'audio/mp4' });

  } else if (media.documentMessage) {
    let document = await zk.downloadAndSaveMediaMessage(media.documentMessage);
    await zk.sendMessage(dest, { document: { url: document }, mimetype: media.documentMessage.mimetype, fileName: media.documentMessage.fileName });

  } else {
    return repondre("*This media type is not supported.*");
  }
});
