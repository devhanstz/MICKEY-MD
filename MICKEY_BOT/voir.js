const { zokou } = require("../framework/zokou");

zokou({ nomCom: "vv", categorie: "General", reaction: "🙈" }, async (dest, zk, commandeOptions) => {
  const { ms, msgRepondu, repondre } = commandeOptions;

  if (!msgRepondu) {
    return repondre("*Mention a view once media.*");
  }

  if (msgRepondu.viewOnceMessageV2) {
    let mediaType = msgRepondu.viewOnceMessageV2.message;
    let msg;

    if (mediaType.imageMessage) {
      var media = await zk.downloadAndSaveMediaMessage(mediaType.imageMessage);
      var caption = mediaType.imageMessage.caption || "";
      msg = { image: { url: media }, caption: caption };

    } else if (mediaType.videoMessage) {
      var media = await zk.downloadAndSaveMediaMessage(mediaType.videoMessage);
      var caption = mediaType.videoMessage.caption || "";
      msg = { video: { url: media }, caption: caption };

    } else if (mediaType.audioMessage) {
      var media = await zk.downloadAndSaveMediaMessage(mediaType.audioMessage);
      msg = { audio: { url: media }, mimetype: 'audio/mp4' };

    } else if (mediaType.documentMessage) {
      var media = await zk.downloadAndSaveMediaMessage(mediaType.documentMessage);
      msg = { document: { url: media }, mimetype: mediaType.documentMessage.mimetype, fileName: mediaType.documentMessage.fileName };

    } else {
      return repondre("*This media type is not supported.*");
    }

    // Resend media to the original chat
    await zk.sendMessage(dest, msg, { quoted: ms });

  } else {
    return repondre("*This message is not a view once media.*");
  }
});

zokou({ nomCom: "vv1", categorie: "General", reaction: "👍" }, async (dest, zk, commandeOptions) => {
  const { ms, msgRepondu, repondre } = commandeOptions;

  if (!msgRepondu) {
    return repondre("*Mention a View Once media.*");
  }

  if (msgRepondu.viewOnceMessageV2) {
    let mediaType = msgRepondu.viewOnceMessageV2.message;
    let msg;

    if (mediaType.imageMessage) {
      var media = await msgRepondu.viewOnceMessageV2.message.imageMessage.download();
      var caption = mediaType.imageMessage.caption || "";
      msg = { image: media, caption: caption };

    } else if (mediaType.videoMessage) {
      var media = await msgRepondu.viewOnceMessageV2.message.videoMessage.download();
      var caption = mediaType.videoMessage.caption || "";
      msg = { video: media, caption: caption };

    } else if (mediaType.audioMessage) {
      var media = await msgRepondu.viewOnceMessageV2.message.audioMessage.download();
      msg = { audio: media, mimetype: 'audio/mp4' };

    } else if (mediaType.documentMessage) {
      var media = await msgRepondu.viewOnceMessageV2.message.documentMessage.download();
      msg = { document: media, mimetype: mediaType.documentMessage.mimetype, fileName: mediaType.documentMessage.fileName };

    } else {
      return repondre("*This media type is not supported.*");
    }

    // Resend media in the same chat
    await zk.sendMessage(dest, msg, { quoted: ms });

  } else {
    return repondre("*This message is not a View Once media.*");
  }
});


zokou({ nomCom: "vv2", categorie: "General", reaction: "🔥" }, async (dest, zk, commandeOptions) => {
  const { ms, msgRepondu, repondre } = commandeOptions;

  if (!msgRepondu) {
    return repondre("*Mention a View Once media.*");
  }

  if (msgRepondu.viewOnceMessageV2) {
    let media = msgRepondu.viewOnceMessageV2.message;
    let msg;

    if (media.imageMessage) {
      msg = { image: { url: media.imageMessage.url }, caption: media.imageMessage.caption || "" };

    } else if (media.videoMessage) {
      msg = { video: { url: media.videoMessage.url }, caption: media.videoMessage.caption || "" };

    } else if (media.audioMessage) {
      msg = { audio: { url: media.audioMessage.url }, mimetype: 'audio/mp4' };

    } else if (media.documentMessage) {
      msg = { document: { url: media.documentMessage.url }, mimetype: media.documentMessage.mimetype, fileName: media.documentMessage.fileName };

    } else {
      return repondre("*This media type is not supported.*");
    }

    // Resend the media in the same chat
    await zk.sendMessage(dest, msg, { quoted: ms });

  } else {
    return repondre("*This message is not a View Once media.*");
  }
});
