const { zokou } = require("../framework/zokou");

zokou({ nomCom: "vv6", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, superUser, auteurMessage } = commandeOptions;

  if (superUser) {

    if (msgRepondu) {

      let msg;

      // Get the media content from the replied message
      const media = msgRepondu.message;

      // Create a caption message for the resending media
      const captionMessage = "Here is your View Once opened by Hans MD";

      // Handling Image Message
      if (media.imageMessage) {
        try {
          // Download and save the image
          let image = await zk.downloadAndSaveMediaMessage(media.imageMessage);
          msg = {
            image: { url: image },  // Send the downloaded image
            caption: captionMessage + "\n" + (media.imageMessage.caption || ""), // Add the caption
          };
        } catch (error) {
          return repondre("Error downloading image.");
        }

      // Handling Video Message
      } else if (media.videoMessage) {
        try {
          // Download and save the video
          let video = await zk.downloadAndSaveMediaMessage(media.videoMessage);
          msg = {
            video: { url: video },
            caption: captionMessage + "\n" + (media.videoMessage.caption || ""),  // Add the caption
          };
        } catch (error) {
          return repondre("Error downloading video.");
        }

      // Handling Audio Message
      } else if (media.audioMessage) {
        try {
          // Download and save the audio
          let audio = await zk.downloadAndSaveMediaMessage(media.audioMessage);
          msg = {
            audio: { url: audio },
            mimetype: 'audio/mp4',
          };
        } catch (error) {
          return repondre("Error downloading audio.");
        }

      // Handling Voice Message
      } else if (media.voiceMessage) {
        try {
          // Download and save the voice message
          let voice = await zk.downloadAndSaveMediaMessage(media.voiceMessage);
          msg = {
            audio: { url: voice },
            mimetype: 'audio/ogg', // Voice messages are typically 'audio/ogg'
          };
        } catch (error) {
          return repondre("Error downloading voice message.");
        }

      // Handling Sticker Message
      } else if (media.stickerMessage) {
        try {
          // Download and save the sticker
          let sticker = await zk.downloadAndSaveMediaMessage(media.stickerMessage);
          msg = { sticker: sticker };
        } catch (error) {
          return repondre("Error downloading sticker.");
        }

      // Handling Document Message (Any other type of media that may be shared)
      } else if (media.documentMessage) {
        try {
          // Download and save the document
          let document = await zk.downloadAndSaveMediaMessage(media.documentMessage);
          msg = {
            document: { url: document },
            caption: captionMessage + "\n" + (media.documentMessage.caption || ""),
          };
        } catch (error) {
          return repondre("Error downloading document.");
        }

      } else {
        return repondre("This type of media is not supported.");
      }

      // Resend the downloaded media to the same chat where it was opened
      await zk.sendMessage(auteurMessage, msg);

    } else {
      repondre("Please reply to a media message to download and resend it.");
    }

  } else {
    repondre("Only mods can use this command.");
  }
});
