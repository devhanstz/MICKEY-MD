const { zokou } = require("../framework/zokou");

zokou({ nomCom: "save2", categorie: "General" }, async (dest, zk, commandeOptions) => {
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

zokou({ nomCom: "vv", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { repondre, msgRepondu, superUser, auteurMessage } = commandeOptions;

  if (superUser) {

    if (msgRepondu) {

      let msg;

      // Handling Image Message
      if (msgRepondu.imageMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        msg = {
          image: { url: media },
          caption: msgRepondu.imageMessage.caption || "",
        };

      // Handling Video Message
      } else if (msgRepondu.videoMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        msg = {
          video: { url: media },
          caption: msgRepondu.videoMessage.caption || "",
        };

      // Handling Audio Message
      } else if (msgRepondu.audioMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        msg = {
          audio: { url: media },
          mimetype: 'audio/mp4',
        };

      // Handling Sticker Message
      } else if (msgRepondu.stickerMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
        let stickerMess = new Sticker(media, {
          pack: 'Hans-MD-TAG',
          type: StickerTypes.CROPPED,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent",
        });
        const stickerBuffer = await stickerMess.toBuffer();
        msg = { sticker: stickerBuffer };

      } else {
        // Handling other text messages
        msg = { text: msgRepondu.conversation };
      }

      // Resend the media to the same chat (no redirection to another chat)
      await zk.sendMessage(auteurMessage, msg);  // This sends back to the same chat

    } else {
      repondre('Mention the message that you want to save');
    }

  } else {
    repondre('Only mods can use this command');
  }
});

zokou({ nomCom: "vv5", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, superUser, auteurMessage } = commandeOptions;

  if (superUser) {

    if (msgRepondu) {

      let msg;

      // Check if the message contains media
      const media = msgRepondu.message;

      // Handling Image Message
      if (media.imageMessage) {
        // Download and save the image
        let image = await zk.downloadAndSaveMediaMessage(media.imageMessage);
        msg = {
          image: { url: image },  // Send the downloaded image
          caption: media.imageMessage.caption || "", // Include the caption if available
        };

        // Resend the downloaded media to the same chat where it was opened
        await zk.sendMessage(auteurMessage, msg);

      } else {
        return repondre("This type of media is not supported.");
      }

    } else {
      repondre("Please reply to a View Once media message to download and resend it.");
    }

  } else {
    repondre("Only mods can use this command.");
  }
});

        
