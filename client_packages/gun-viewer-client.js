let gunType = 1;
let gunModel = 1;
let textIntoViewerGunType;
let textIntoViewerGunModel;

mp.events.addDataHandler("gunViewerOn", function (entity, value) {
  if (entity.type === "player" && value === true) {
    textIntoViewerGunType = entity.getVariable("gunType");
    textIntoViewerGunModel = entity.getVariable("gunModel");
    mp.events.add("render", renderOnGunViewer);
    mp.events.call("render", renderOnGunViewer);
    mp.events.add("gunViewerKeyBinder", binderOnGunViewer);
    mp.events.call("gunViewerKeyBinder", binderOnGunViewer);
  } else {
    mp.events.remove("render", renderOnGunViewer);
    mp.events.remove("gunViewerKeyBinder");
    mp.keys.unbind(0x27, true);
    mp.keys.unbind(0x25, true);
    mp.keys.unbind(0x26, true);
    mp.keys.unbind(0x28, true);
    mp.keys.unbind(0x20, true);
    gunType = 1;
    gunModel = 1;
  }
});

let rightArrowScale = [0.7, 0.7];
let upArrowScale = [0.7, 0.7];
let downArrowScale = [0.7, 0.7];
let leftArrowScale = [0.7, 0.7];
let rightArrowColor = [255, 255, 255, 180];
let upArrowColor = [255, 255, 255, 180];
let downArrowColor = [255, 255, 255, 180];
let leftArrowColor = [255, 255, 255, 180];

function renderOnGunViewer() {
  function changeArrows(key, keyIsDown) {
    let color;
    let scale;
    if (keyIsDown) {
      color = [255, 255, 255, 255];
      scale = [0.8, 0.8];
    } else {
      color = [255, 255, 255, 180];
      scale = [0.7, 0.7];
    }
    switch (key) {
      case "left":
        leftArrowScale = scale;
        leftArrowColor = color;
        break;
      case "right":
        rightArrowScale = scale;
        rightArrowColor = color;
        break;
      case "up":
        upArrowScale = scale;
        upArrowColor = color;
        break;
      case "down":
        downArrowScale = scale;
        downArrowColor = color;
        break;
    }
  }
  mp.keys.isDown(38) === true &&
  !mp.players.local.isTypingInTextChat &&
  !mp.game.ui.isPauseMenuActive()
    ? changeArrows("up", true)
    : changeArrows("up", false);
  mp.keys.isDown(40) === true &&
  !mp.players.local.isTypingInTextChat &&
  !mp.game.ui.isPauseMenuActive()
    ? changeArrows("down", true)
    : changeArrows("down", false);
  mp.keys.isDown(37) === true &&
  !mp.players.local.isTypingInTextChat &&
  !mp.game.ui.isPauseMenuActive()
    ? changeArrows("left", true)
    : changeArrows("left", false);
  mp.keys.isDown(39) === true &&
  !mp.players.local.isTypingInTextChat &&
  !mp.game.ui.isPauseMenuActive()
    ? changeArrows("right", true)
    : changeArrows("right", false);
  mp.game.graphics.drawText(textIntoViewerGunType, [0.5, 0.8638], {
    font: 0,
    color: [255, 255, 255, 255],
    scale: [0.37, 0.37],
    outline: false,
  });
  mp.game.graphics.drawText(textIntoViewerGunModel, [0.5, 0.9262], {
    font: 0,
    color: [255, 255, 255, 255],
    scale: [0.37, 0.37],
    outline: false,
  });
  mp.game.graphics.drawText(`→`, [0.66, 0.85], {
    font: 0,
    color: rightArrowColor,
    scale: rightArrowScale,
    outline: false,
  });
  mp.game.graphics.drawText(`←`, [0.34, 0.85], {
    font: 0,
    color: leftArrowColor,
    scale: leftArrowScale,
    outline: false,
  });
  mp.game.graphics.drawText(`↑`, [0.5, 0.89], {
    font: 0,
    color: upArrowColor,
    scale: upArrowScale,
    outline: false,
  });
  mp.game.graphics.drawText(`↓`, [0.5, 0.945], {
    font: 0,
    color: downArrowColor,
    scale: downArrowScale,
    outline: false,
  });
  if (mp.keys.isDown(72) === false || mp.players.local.isTypingInTextChat) {
    mp.game.graphics.drawText(
      `Для подсказки удерживай кнопку [H]`,
      [0.5, 0.82],
      {
        font: 0,
        color: [255, 255, 255, 100],
        scale: [0.37, 0.37],
        outline: false,
      }
    );
  } else {
    const options = {
      font: 0,
      color: [255, 255, 255, 255],
      scale: [0.37, 0.37],
      outline: false,
    };
    if (
      mp.keys.isDown(72) === true &&
      !mp.players.local.isTypingInTextChat &&
      !mp.game.ui.isPauseMenuActive()
    ) {
      mp.game.graphics.drawText(
        `[стрелки влево/вправо] - выбор типа оружия`,
        [0.5, 0.695],
        options
      );
      mp.game.graphics.drawText(
        `[стрелки вверх/вниз] - выбор модели оружия`,
        [0.5, 0.72],
        options
      );
      mp.game.graphics.drawText(
        `[пробел] - получить оружие`,
        [0.5, 0.745],
        options
      );
      mp.game.graphics.drawText(
        `[пробел] повторно - получить еще 1000 патронов`,
        [0.5, 0.77],
        options
      );
      mp.game.graphics.drawText(
        `/gun viewer - включить/отключить режим просмотра оружия`,
        [0.5, 0.795],
        options
      );
      mp.game.graphics.drawText(
        `/gun - получить рандомное оружие`,
        [0.5, 0.82],
        options
      );
    }
  }
}

function binderOnGunViewer() {
  // Кнопка "Right Arrow"
  mp.keys.bind(0x27, true, async function () {
    if (
      !mp.players.local.isTypingInTextChat &&
      !mp.game.ui.isPauseMenuActive()
    ) {
      gunType += 1;
      gunModel = 1;
      await mp.events.callRemoteProc("nextGunType", gunType).then((result) => {
        if (!result) {
          gunType = 1;
        }
        textIntoViewerGunType = mp.players.local.getVariable("gunType");
        textIntoViewerGunModel = mp.players.local.getVariable("gunModel");
      });
    }
  });

  // "Left Arrow"
  mp.keys.bind(0x25, true, async function () {
    if (
      !mp.players.local.isTypingInTextChat &&
      !mp.game.ui.isPauseMenuActive()
    ) {
      gunType -= 1;
      gunModel = 1;
      await mp.events
        .callRemoteProc("previousGunType", gunType)
        .then((result) => {
          textIntoViewerGunType = mp.players.local.getVariable("gunType");
          textIntoViewerGunModel = mp.players.local.getVariable("gunModel");
          if (result !== gunType) {
            gunType = result;
          }
        });
    }
  });

  // "Down Arrow"
  mp.keys.bind(0x28, true, async function () {
    if (
      !mp.players.local.isTypingInTextChat &&
      !mp.game.ui.isPauseMenuActive()
    ) {
      gunModel += 1;
      await mp.events
        .callRemoteProc("nextGunModel", gunType, gunModel)
        .then((result) => {
          textIntoViewerGunModel = mp.players.local.getVariable("gunModel");
          if (!result) {
            gunModel = 1;
          }
        });
    }
  });

  // "Up Arrow"
  mp.keys.bind(0x26, true, async function () {
    if (
      !mp.players.local.isTypingInTextChat &&
      !mp.game.ui.isPauseMenuActive()
    ) {
      gunModel -= 1;
      await mp.events
        .callRemoteProc("previousGunModel", gunType, gunModel)
        .then((result) => {
          textIntoViewerGunModel = mp.players.local.getVariable("gunModel");
          if (result !== gunModel) {
            gunModel = result;
          }
        });
    }
  });

  // "Space"
  mp.keys.bind(0x20, true, async function () {
    if (
      !mp.players.local.isTypingInTextChat &&
      !mp.game.ui.isPauseMenuActive() &&
      mp.keys.isDown(87) === false &&
      mp.keys.isDown(68) === false &&
      mp.keys.isDown(83) === false &&
      mp.keys.isDown(65) === false
    ) {
      await mp.events.callRemoteProc("giveGun").then((result) => {
        if (result) {
          mp.events.call(
            "consoleMessageAboutWeapon:client",
            mp.players.local.getVariable("gunModelName")
          );
        }
      });
    }
  });
}

mp.events.add(
  "allPlayersWithoutYouBroadcastInChat:client",
  (playerName, playerWeapon) => {
    mp.gui.chat.push(`Игрок ${playerName} получил оружие - ${playerWeapon}`);
  }
);

mp.events.add("consoleMessageAboutWeapon:client", (gunModel) => {
  mp.console.clear();
  mp.console.logInfo(
    `---------------------------------------------------------------\nInfo about weapon - ${gunModel}`,
    true,
    true
  );
  mp.console.logInfo(
    `- ID: ${mp.players.local.getVariable("gunViewId")}`,
    true,
    true
  );
  let weaponHash = mp.game.invoke(
    `0x0A6DB4965674D243`,
    mp.players.local.handle
  );
  mp.console.logInfo(
    `- hash: ${weaponHash} or ${mp.players.local.getVariable("gunViewHash")}`,
    true,
    true
  );
  mp.console.logInfo(
    `- group hash: ${mp.game.weapon.getWeapontypeGroup(weaponHash)}`,
    true,
    true
  );
  mp.console.logInfo(
    `- model hash: ${mp.game.weapon.getWeapontypeModel(weaponHash)}`,
    true,
    true
  );
  mp.console.logInfo(
    `- is valid: ${mp.game.weapon.isValid(weaponHash)}`,
    true,
    true
  );
  let groupHash;
  switch (mp.game.weapon.getWeapontypeGroup(weaponHash)) {
    case 690389602:
    case 1175761940:
    case 416676503:
    case 3759491383:
      groupHash = "on top";
      break;
    case 3337201093:
    case 1159398588:
      groupHash = "top right";
      break;
    case 970310034:
      groupHash = "on right";
      break;
    case 3082541095:
      weaponHash !== -1466123874
        ? (groupHash = "bottom right")
        : (groupHash = "bottom left");
      break;
    case 3566412244:
    case 2685387236:
      groupHash = "below";
      break;
    case 860033945:
      groupHash = "bottom left";
      break;
    case 2725924767:
    case 3539449195:
      groupHash = "on the left";
      break;
    case 1548507267:
    case 4257178988:
    case 1595662460:
      groupHash = "top left";
      break;
    case 75159441:
    case 0:
    case 3493187224:
      groupHash = "none";
      break;
    default:
      groupHash = `unknown group - ${mp.game.weapon.getWeapontypeGroup(
        weaponHash
      )}`;
  }
  mp.console.logInfo(`- slot: ${groupHash}`, true, true);
});
