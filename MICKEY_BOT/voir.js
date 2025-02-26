const { zokou } = require("../framework/zokou");

zokou({ nomCom: "vv16", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { repondre, msgRepondu, superUser, auteurMessage, msg } = commandeOptions;

  if (superUser) {
    
    if (msgRepondu) {
      console.log(msgRepondu);

      let sendMessageData;

      // Handling Image Message
      if (msgRepondu.imageMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        
        // Resize image if needed
        sendMessageData = {
          image: { url: media },
          caption: `> Here is your image opened by Hans-Md ${msgRepondu.imageMessage.caption || ''}`,
        };

      // Handling Video Message
      } else if (msgRepondu.videoMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        
        // Resize video if needed
        sendMessageData = {
          video: { url: media },
          caption: `> Here is your video opened by Hans-Md ${msgRepondu.videoMessage.caption || ''}`,
        };

      // Handling Audio Message
      } else if (msgRepondu.audioMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        
        // Send audio with caption
        sendMessageData = {
          audio: { url: media },
          mimetype: 'audio/mp4',
          caption: `> Here is your audio opened by Hans-Md`,
        };

      // Handling Sticker Message
      } else if (msgRepondu.stickerMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
        let stickerMess = new Sticker(media, {
          pack: 'HANS-MD-TAG',
          type: StickerTypes.CROPPED,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent",
        });
        const stickerBuffer2 = await stickerMess.toBuffer();
        sendMessageData = { sticker: stickerBuffer2 };

      } else {
        sendMessageData = {
          text: msgRepondu.conversation || 'No text found.',
        };
      }

      // Send the media back with the quoted message and resized media (if applicable)
      await zk.sendMessage(dest, sendMessageData, { quoted: msg });

    } else {
      repondre('Please reply to a message a View once massage.');
    }

  } else {
    repondre('Only mods can use this command.');
  }

});
