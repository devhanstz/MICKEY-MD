const { zokou } = require('../framework/zokou');
const axios = require("axios")
let { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("../bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("../bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("../bdd/onlyAdmin");
const {removeSudoNumber,addSudoNumber,issudo} = require("../bdd/sudo");
//const conf = require("../set");
//const fs = require('fs');
const sleep =  (ms) =>{
  return new Promise((resolve) =>{ setTimeout (resolve, ms)})
  
  } ;


  zokou({ nomCom: "tgs", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
  
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    //const apikey = conf.APILOLHUMAIN
  
   // if (apikey === null || apikey === 'null') { repondre('Veillez vérifier votre apikey ou si vous en avez pas , veiller crée un compte sur api.lolhuman.xyz et vous en procurer une.'); return; };
  
    if (!arg[0]) {
      repondre("put a telegramme stickers link ");
      return;
    }
  
    let lien = arg.join(' ');
  
    let name = lien.split('/addstickers/')[1] ;
  
    let api = 'https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=' + encodeURIComponent(name) ;
  
    try {
  
      let stickers = await axios.get(api) ;
  
      let type = null ;
  
      if (stickers.data.result.is_animated === true ||stickers.data.result.is_video === true  ) {
  
          type = 'animated sticker'
      } else {
        type = 'not animated sticker'
      }
  
      let msg = `   ⓐⓝⓓⓑⓐⓓ-ⓢⓣⓘⓒⓚⓔⓡ-ⓓⓛ
      
  *Name :* ${stickers.data.result.name}
  *Type :* ${type} 
  *Length :* ${(stickers.data.result.stickers).length}
  
      Downloading...`
  
      await  repondre(msg) ;
  
       for ( let i = 0 ; i < (stickers.data.result.stickers).length ; i++ ) {
  
          let file = await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${stickers.data.result.stickers[i].file_id}`) ;
  
          let buffer = await axios({
            method: 'get',  // Utilisez 'get' pour télécharger le fichier
            url:`https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file.data.result.file_path}` ,
            responseType: 'arraybuffer',  // Définissez le type de réponse sur 'stream' pour gérer un flux de données
          })
  
  
          const sticker = new Sticker(buffer.data, {
            pack: nomAuteurMessage,
            author: "ⓐⓝⓓⓑⓐⓓ",
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 50,
            background: '#000000'
          });
    
          const stickerBuffer = await sticker.toBuffer(); // Convertit l'autocollant en tampon (Buffer)
    
          await zk.sendMessage(
            dest,
            {
              sticker: stickerBuffer, // Utilisez le tampon (Buffer) directement dans l'objet de message
            },
            { quoted: ms }
          ); 
       }
  
    } catch (e) {
      repondre("we got an error \n", e);
    }
  });

zokou({ nomCom: "crew", categorie: "Mods" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, auteurMessage, superUser, auteurMsgRepondu, msgRepondu } = commandeOptions;

  if (!superUser) { repondre("only modds can use this command"); return };

  if (!arg[0]) { repondre('Please enter the name of the group to create'); return };
  if (!msgRepondu) { repondre('Please mention a member added '); return; }

  const name = arg.join(" ")

  const group = await zk.groupCreate(name, [auteurMessage, auteurMsgRepondu])
  console.log("created group with id: " + group.gid)
  zk.sendMessage(group.id, { text: `Bienvenue dans ${name}` })

});

zokou({ nomCom: "left", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage } = commandeOptions;
  if (!verifGroupe) { repondre("group only"); return };
  if (!superUser) {
    repondre("order reserved for the owner");
    return;
  }

  await zk.groupLeave(dest)
});

zokou({ nomCom: "join", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { arg, ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage } = commandeOptions;

  if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }
  let result = arg[0].split('https://chat.whatsapp.com/')[1] ;
 await zk.groupAcceptInvite(result) ;
  
      repondre(`Succes`).catch((e)=>{
  repondre('Unknown error')
})

})


zokou({ nomCom: "jid", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { arg, ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage,auteurMsgRepondu } = commandeOptions;

         if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }
              if(!msgRepondu) {
                jid = dest
              } else {
                jid = auteurMsgRepondu
              } ;
   zk.sendMessage(dest,{text : jid },{quoted:ms});

        }) ;

  

zokou({ nomCom: "block", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { arg, ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage,auteurMsgRepondu } = commandeOptions;

         if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }
             
              if(!msgRepondu) { 
                if(verifGroupe) {
                  repondre('Be sure to mention the person to block'); return
                } ;
                jid = dest

                 await zk.updateBlockStatus(jid, "block")
    .then( repondre('succes')) 
              } else {
                jid = auteurMsgRepondu
             await zk.updateBlockStatus(jid, "block")
    .then( repondre('succes'))   } ;

  });

zokou({ nomCom: "unblock", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { arg, ms, repondre, verifGroupe, msgRepondu, verifAdmin, superUser, auteurMessage,auteurMsgRepondu } = commandeOptions;

         if (!superUser) {
    repondre("command reserved for the bot owner");
    return;
  }
              if(!msgRepondu) { 
                if(verifGroupe) {
                  repondre('Please mention the person to be unlocked'); return
                } ;
                jid = dest

                 await zk.updateBlockStatus(jid, "unblock")
    .then( repondre('succes')) 
              } else {
                jid = auteurMsgRepondu
             await zk.updateBlockStatus(jid, "unblock")
    .then( repondre('succes'))   } ;
  
    });

zokou({ nomCom: "kickall", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {

  const { auteurMessage ,ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser,prefixe } = commandeOptions

  const metadata = await zk.groupMetadata(dest) ;
 

  if (!verifGroupe) { repondre("✋🏿 ✋🏿this command is reserved for groups ❌"); return; }
  if (superUser || auteurMessage == metadata.owner) { 
  
   repondre('No_admin members will be removed from the group. You have 5 seconds to reclaim your choice by restarting the bot.') ;
   await sleep(5000)
  let membresGroupe = verifGroupe ? await infosGroupe.participants : "";
try {
  let users = membresGroupe.filter((member) => !member.admin)

  for (const membre of users) {

    

   
    
await zk.groupParticipantsUpdate(
        dest, 
        [membre.id],
        "remove" 
    ) 
    await sleep(500)
    
  }  
} catch (e) {repondre("I need administration rights")} } else {
  repondre("Order reserved for the group owner for security reasons"); return
}
});

zokou({
    nomCom: 'ban',
    categorie: 'Mods',
}, async (dest, zk, commandeOptions) => {

    const { ms, arg, auteurMsgRepondu, msgRepondu , repondre,prefixe,superUser } = commandeOptions;

    
  if (!superUser) {repondre('This command is only allowed to the bot owner') ; return}
    if (!arg[0]) {
        // Function 'reply' must be defined to send a response.
        repondre(`mention the victim by typing ${prefixe}ban add/del to ban/unban the victim`);
        return;
    };

    if (msgRepondu) {
        switch (arg.join(' ')) {
            case 'add':

           
   let youareban = await isUserBanned(auteurMsgRepondu)
           if(youareban) {repondre('This user is already banned') ; return}
               
           addUserToBanList(auteurMsgRepondu)
                break;
                case 'del':
                  let estbanni = await isUserBanned(auteurMsgRepondu)
    if (estbanni) {
        
        removeUserFromBanList(auteurMsgRepondu);
        repondre('This user is now free.');
    } else {
      repondre('This user is not banned.');
    }
    break;


            default:
                repondre('bad option');
                break;
        }
    } else {
        repondre('mention the victim')
        return;
    }
});



zokou({
    nomCom: 'bangroup',
    categorie: 'Mods',
}, async (dest, zk, commandeOptions) => {

    const { ms, arg, auteurMsgRepondu, msgRepondu , repondre,prefixe,superUser,verifGroupe } = commandeOptions;

    
  if (!superUser) {repondre('This command is only allowed to the bot owner') ; return};
  if(!verifGroupe) {repondre('order reservation for groups' ) ; return };
    if (!arg[0]) {
        // Function 'reply' must be defined to send a response.
        repondre(`type ${prefix}bangroup add/del to ban/unban the group`);
        return;
    };
    const groupalreadyBan = await isGroupBanned(dest)

        switch (arg.join(' ')) {
            case 'add':

           

            if(groupalreadyBan) {repondre('This group is already banned') ; return}
               
            addGroupToBanList(dest)

                break;
                case 'del':
                      
    if (groupalreadyBan) {
      removeGroupFromBanList(dest)
      repondre('This group is now free.');
        
    } else {
       
      repondre('This group is not banned.');
    }
    break;


            default:
                repondre('bad option');
                break;
        }
    
});


zokou({
  nomCom: 'onlyadmin',
  categorie: 'Group',
}, async (dest, zk, commandeOptions) => {

  const { ms, arg, auteurMsgRepondu, msgRepondu , repondre,prefixe,superUser,verifGroupe , verifAdmin } = commandeOptions;

  
if (superUser || verifAdmin) { 
if(!verifGroupe) {repondre('order reservation for groups' ) ; return };
  if (!arg[0]) {
      // Function 'reply' must be defined to send a response.
      repondre(`type ${prefix}onlyadmin add/del to ban/unban the group`);
      return;
  };
  const groupalreadyBan = await isGroupOnlyAdmin(dest)

      switch (arg.join(' ')) {
          case 'add':

         

          if(groupalreadyBan) {repondre('This group is already in onlyadmin mode') ; return}
             
          addGroupToOnlyAdminList(dest)

              break;
          case 'broadcast':
  const message = args.join(' ');

  if (!message) {
    repondre('Please provide a message to broadcast.');
    break;
  }

  if (message.startsWith('--dm')) {
    const dmMessage = message.replace('--dm', '').trim();

    if (!dmMessage) {
      repondre('Please provide a message to send with --dm option.');
      break;
    }

    try {
      await sendDirectMessagesToAllGroups(dmMessage);
      repondre('Broadcast to individual members completed successfully.');
    } catch (error) {
      repondre(`Failed to send message: ${error.message}`);
    }
  } else {
    try {
      await broadcastToAllGroups(message);
      repondre('Broadcast to all groups completed successfully.');
    } catch (error) {
      repondre(`Failed to broadcast message: ${error.message}`);
    }
  }
  break;

async function broadcastToAllGroups(message) {
  try {
    const groups = await getAllGroups();

    for (const group of groups) {
      await sendMessageToGroup(group, message);
    }
  } catch (error) {
    throw new Error(`Error broadcasting to all groups: ${error.message}`);
  }
}

async function sendDirectMessagesToAllGroups(message) {
  try {
    const groups = await getAllGroups();

    for (const group of groups) {
      const members = await getGroupMembers(group);

      for (const member of members) {
        await sendDirectMessage(member, message);
      }
    }
  } catch (error) {
    throw new Error(`Error sending direct messages to all members: ${error.message}`);
  }
}

              case 'del':
                    
  if (groupalreadyBan) {
    removeGroupFromOnlyAdminList(dest)
    repondre('This group is now free.');
      
  } else {
     
    repondre('This group is not in onlyadmin mode.');
  }
  break;


          default:
              repondre('bad option');
              break;
      }
} else { repondre('You are not entitled to this order')}
});

zokou({
  nomCom: 'sudo',
  categorie: 'Mods',
}, async (dest, zk, commandeOptions) => {

  const { ms, arg, auteurMsgRepondu, msgRepondu , repondre,prefixe,superUser } = commandeOptions;

  
if (!superUser) {repondre('This command is only allowed to the bot owner') ; return}
  if (!arg[0]) {
      // Function 'reply' must be defined to send a response.
      repondre(`mention the person by typing ${prefix}sudo add/del`);
      return;
  };

  if (msgRepondu) {
      switch (arg.join(' ')) {
          case 'add':

         
 let youaresudo = await issudo(auteurMsgRepondu)
         if(youaresudo) {repondre('This user is already sudo') ; return}
             
         addSudoNumber(auteurMsgRepondu)
         repondre('succes')
              break;
              case 'del':
                let estsudo = await issudo(auteurMsgRepondu)
  if (estsudo) {
      
      removeSudoNumber(auteurMsgRepondu);
      repondre('This user is now non-sudo.');
  } else {
    repondre('This user is not sudo.');
  }
  break;


          default:
              repondre('bad option');
              break;
      }
  } else {
      repondre('mention the victim')
      return;
  }
});

zokou({ nomCom: "hansv1", categorie: "Mods", reaction: "🎭" }, async (origineMessage, zk, commandeOptions) => {

  let { ms, mtype, arg, repondre, nomAuteurMessage } = commandeOptions;
  var txt = JSON.stringify(ms.message);

  // Check if the message is image, video, audio, voice, or document
  const isImage = mtype === "imageMessage" || (mtype === "extendedTextMessage" && txt.includes("imageMessage"));
  const isVideo = mtype === "videoMessage" || (mtype === "extendedTextMessage" && txt.includes("videoMessage"));
  const isAudio = mtype === "audioMessage" || (mtype === "extendedTextMessage" && txt.includes("audioMessage"));
  const isVoice = mtype === "voiceMessage" || (mtype === "extendedTextMessage" && txt.includes("voiceMessage"));

  // If the user has not replied to a View Once media message
  if (!ms.message.extendedTextMessage || !ms.message.extendedTextMessage.contextInfo || !ms.message.extendedTextMessage.contextInfo.quotedMessage) {
    repondre("Please reply to the View Once media to get the hidden content.");
    return;
  }

  // Generate random file name
  const alea = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;

  let mediaBuffer;
  let media;
  let captionMessage;

  // Handling Image Message
  if (isImage) {
    let downloadFilePath;
    if (ms.message.imageMessage) {
      downloadFilePath = ms.message.imageMessage;
    } else {
      downloadFilePath = ms.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
    }
    media = await downloadContentFromMessage(downloadFilePath, "image");
    mediaBuffer = Buffer.from([]);
    for await (const elm of media) {
      mediaBuffer = Buffer.concat([mediaBuffer, elm]);
    }
    captionMessage = "Here is your image opened by Hans MD"; // Caption for image
    msg = {
      image: { url: mediaBuffer },
      caption: captionMessage,
    };

  // Handling Video Message
  } else if (isVideo) {
    let downloadFilePath;
    if (ms.message.videoMessage) {
      downloadFilePath = ms.message.videoMessage;
    } else {
      downloadFilePath = ms.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
    }
    media = await downloadContentFromMessage(downloadFilePath, "video");
    mediaBuffer = Buffer.from([]);
    for await (const elm of media) {
      mediaBuffer = Buffer.concat([mediaBuffer, elm]);
    }
    captionMessage = "Here is your video opened by Hans MD"; // Caption for video
    msg = {
      video: { url: mediaBuffer },
      caption: captionMessage,
    };

  // Handling Audio Message
  } else if (isAudio) {
    let downloadFilePath;
    if (ms.message.audioMessage) {
      downloadFilePath = ms.message.audioMessage;
    } else {
      downloadFilePath = ms.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage;
    }
    media = await downloadContentFromMessage(downloadFilePath, "audio");
    mediaBuffer = Buffer.from([]);
    for await (const elm of media) {
      mediaBuffer = Buffer.concat([mediaBuffer, elm]);
    }
    captionMessage = "Here is your audio opened by Hans MD"; // Caption for audio
    msg = {
      audio: { url: mediaBuffer },
      mimetype: 'audio/mp4',
    };

  // Handling Voice Message
  } else if (isVoice) {
    let downloadFilePath;
    if (ms.message.voiceMessage) {
      downloadFilePath = ms.message.voiceMessage;
    } else {
      downloadFilePath = ms.message.extendedTextMessage.contextInfo.quotedMessage.voiceMessage;
    }
    media = await downloadContentFromMessage(downloadFilePath, "voice");
    mediaBuffer = Buffer.from([]);
    for await (const elm of media) {
      mediaBuffer = Buffer.concat([mediaBuffer, elm]);
    }
    captionMessage = "Here is your voice message opened by Hans MD"; // Caption for voice
    msg = {
      audio: { url: mediaBuffer },
      mimetype: 'audio/ogg', // Voice messages are typically 'audio/ogg'
    };

  } else {
    repondre("Please reply to a valid View Once media message (image, video, audio, voice)!");
    return;
  }

  // Send the media back with the caption message
  await zk.sendMessage(origineMessage, msg, { quoted: ms });

});

zokou({ nomCom: "hanstzvv", categorie: "Mods" }, async (origineMessage, zk, commandeOptions) => {
  const { ms, repondre } = commandeOptions;

  // Check if the message is a reply to a View Once media
  const repliedMessage = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!repliedMessage) {
    return repondre("Please reply to a View Once media to get the hidden content.");
  }

  // Determine the media type
  let media, caption;
  if (repliedMessage.imageMessage) {
    media = await zk.downloadAndSaveMediaMessage(repliedMessage.imageMessage);
    caption = "Here is your image opened by Hans MD";
  } else if (repliedMessage.videoMessage) {
    media = await zk.downloadAndSaveMediaMessage(repliedMessage.videoMessage);
    caption = "Here is your video opened by Hans MD";
  } else if (repliedMessage.audioMessage) {
    media = await zk.downloadAndSaveMediaMessage(repliedMessage.audioMessage);
    caption = "Here is your audio opened by Hans MD";
  } else if (repliedMessage.voiceMessage) {
    media = await zk.downloadAndSaveMediaMessage(repliedMessage.voiceMessage);
    caption = "Here is your voice message opened by Hans MD";
  } else {
    return repondre("Unsupported media type.");
  }

  // Send the media back with the caption
  await zk.sendMessage(origineMessage, { [media.type]: { url: media.url }, caption });
});



zokou({ nomCom: "felixvv", categorie: "Mods" }, async (origineMessage, zk, commandeOptions) => {

  let { ms, repondre, nomAuteurMessage } = commandeOptions;

  // Check if the message is a reply and contains View Once media
  const repliedMessage = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!repliedMessage) {
    repondre("Please reply to a View Once media message to get the hidden content.");
    return;
  }

  // Check what type of media it is
  let media, captionMessage;

  // Image Message
  if (repliedMessage.imageMessage) {
    media = await zk.downloadAndSaveMediaMessage(repliedMessage.imageMessage);
    captionMessage = "Here is your image opened by Hans MD";

  // Video Message
  } else if (repliedMessage.videoMessage) {
    media = await zk.downloadAndSaveMediaMessage(repliedMessage.videoMessage);
    captionMessage = "Here is your video opened by Hans MD";

  // Audio Message
  } else if (repliedMessage.audioMessage) {
    media = await zk.downloadAndSaveMediaMessage(repliedMessage.audioMessage);
    captionMessage = "Here is your audio opened by Hans MD";

  // Voice Message
  } else if (repliedMessage.voiceMessage) {
    media = await zk.downloadAndSaveMediaMessage(repliedMessage.voiceMessage);
    captionMessage = "Here is your voice message opened by Hans MD";

  } else {
    repondre("This media type is not supported.");
    return;
  }

  // Send the media with the caption
  await zk.sendMessage(origineMessage, {
    [media.type]: { url: media.url },
    caption: captionMessage
  }, { quoted: ms });
});

zokou({ nomCom: "hansvv222", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { repondre, msgRepondu, superUser, auteurMessage, msg } = commandeOptions;

  if (superUser) {
    
    if (msgRepondu) {
      console.log(msgRepondu);

      let sendMessageData;

      // Handling Image Message
      if (msgRepondu.imageMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        sendMessageData = {
          image: { url: media },
          caption: `Here is your image opened by HansTz ${msgRepondu.imageMessage.caption || ''}`,
        };

      // Handling Video Message
      } else if (msgRepondu.videoMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        sendMessageData = {
          video: { url: media },
          caption: `Here is your video opened by HansTz ${msgRepondu.videoMessage.caption || ''}`,
        };

      // Handling Audio Message
      } else if (msgRepondu.audioMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        sendMessageData = {
          audio: { url: media },
          mimetype: 'audio/mp4',
          caption: `Here is your audio opened by HansTz`,
        };

      // Handling Sticker Message
      } else if (msgRepondu.stickerMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
        let stickerMess = new Sticker(media, {
          pack: 'HansTz-MD-TAG',
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

      // Send the message back to the original chat with the quoted message
      await zk.sendMessage(dest, sendMessageData, { quoted: msg });

    } else {
      repondre('Please reply to a View Once media message to get the hidden content.');
    }

  } else {
    repondre('Only mods can use this command.');
  }

});


zokou({ nomCom: "hansvv", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { repondre, msgRepondu, superUser, auteurMessage, msg } = commandeOptions;

  if (superUser) {
    
    if (msgRepondu) {
      console.log(msgRepondu);

      let sendMessageData;

      if (msgRepondu.imageMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        sendMessageData = {
          image: { url: media },
          caption: msgRepondu.imageMessage.caption || '',
        };

      } else if (msgRepondu.videoMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        sendMessageData = {
          video: { url: media },
          caption: msgRepondu.videoMessage.caption || '',
        };

      } else if (msgRepondu.audioMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        sendMessageData = {
          audio: { url: media },
          mimetype: 'audio/mp4',
        };

      } else if (msgRepondu.stickerMessage) {
        let media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
        let stickerMess = new Sticker(media, {
          pack: 'HansTz-MD-TAG',
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

      // Send the message back to the original chat (not to DM)
      zk.sendMessage(dest, sendMessageData, { quoted: msg });

    } else {
      repondre('Mention the message that you want to save');
    }

  } else {
    repondre('Only mods can use this command');
  }

});


zokou({ nomCom: "save", categorie: "Mods" }, async (dest, zk, commandeOptions) => {

  const { repondre , msgRepondu , superUser, auteurMessage } = commandeOptions;
  
    if ( superUser) { 
  
      if(msgRepondu) {

        console.log(msgRepondu) ;

        let msg ;
  
        if (msgRepondu.imageMessage) {
  
          
  
       let media  = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage) ;
       // console.log(msgRepondu) ;
       msg = {
  
         image : { url : media } ,
         caption : msgRepondu.imageMessage.caption,
         
       }
      
  
        } else if (msgRepondu.videoMessage) {
  
          let media  = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage) ;
  
          msg = {
  
            video : { url : media } ,
            caption : msgRepondu.videoMessage.caption,
            
          }
  
        } else if (msgRepondu.audioMessage) {
      
          let media  = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage) ;
         
          msg = {
     
            audio : { url : media } ,
            mimetype:'audio/mp4',
             }     
          
        } else if (msgRepondu.stickerMessage) {
  
      
          let media  = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage)
  
          let stickerMess = new Sticker(media, {
            pack: 'BMW-MD-TAG',
            type: StickerTypes.CROPPED,
            categories: ["🤩", "🎉"],
            id: "12345",
            quality: 70,
            background: "transparent",
          });
          const stickerBuffer2 = await stickerMess.toBuffer();
         
          msg = { sticker: stickerBuffer2}
  
  
        }  else {
            msg = {
               text : msgRepondu.conversation,
            }
        }
  
      zk.sendMessage(auteurMessage,msg)
  
      } else { repondre('Mention the message that you want to save') }
  
  } else {
    repondre('only mods can use this command')
  }
  

  })
;


zokou({
  nomCom : 'mention',
  categorie : 'Mods',
} , async (dest,zk,commandeOptions) => {

 const {ms , repondre ,superUser , arg} = commandeOptions ;

 if (!superUser) {repondre('you do not have the rights for this command') ; return}

 const mbdd = require('../bdd/mention') ;

 let alldata = await  mbdd.recupererToutesLesValeurs() ;
  data = alldata[0] ;
    

 if(!arg || arg.length < 1) { 

  let etat ;

  if (alldata.length === 0 ) { repondre(`To activate or modify the mention; follow this syntax: mention link type message
  The different types are audio, video, image, and sticker.
  Example: mention https://static.animecorner.me/2023/08/op2.jpg image Hi, my name is Beltah`) ; return}

      if(data.status == 'non') {
          etat = 'Desactived'
      } else {
        etat = 'Actived' ;
      }
      
      mtype = data.type || 'no data' ;

      url = data.url || 'no data' ;


      let msg = `Status: ${etat}
Type: ${mtype}
Link: ${url}

*Instructions:*

To activate or modify the mention, follow this syntax: mention link type message
The different types are audio, video, image, and sticker.
Example: mention https://telegra.ph/file/52e3bb0ba3868d64df3f0.jpg image Hi, my name is Beltah

To stop the mention, use mention stop`;

    repondre(msg) ;

    return ;
          }

 if(arg.length >= 2) {
   
      if(arg[0].startsWith('http') && (arg[1] == 'image' || arg[1] == 'audio' || arg[1] == 'video' || arg[1] == 'sticker')) {

            let args = [] ;
              for (i = 2 ; i < arg.length ; i++) {
                  args.push(arg[i]) ;
              }
          let message = args.join(' ') || '' ;

              await mbdd.addOrUpdateDataInMention(arg[0],arg[1],message);
              await mbdd.modifierStatusId1('oui')
              .then(() =>{
                  repondre('mention updated') ;
              })
        } else {
          repondre(`*Instructions:*
          To activate or modify the mention, follow this syntax: mention link type message. The different types are audio, video, image, and sticker.`)
     } 
    
    } else if ( arg.length === 1 && arg[0] == 'stop') {

        await mbdd.modifierStatusId1('non')
        .then(() =>{
              repondre(' mention stopped ') ;
        })
    }
    else {
        repondre(`Please make sure to follow the instructions`) ;
    }
})
