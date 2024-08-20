const guns = require("./gun-list.json");

function randomNumber(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function gunSelecterViewer(player, gunType = 1, gunModel = 1) {
  const gunTypeIndex =
    Object.keys(guns).indexOf(Object.keys(guns)[gunType - 1]) + 1;
  const gunTypeLength = Object.keys(guns).length;
  const gunTypeName = Object.keys(guns)[gunType - 1];
  player.setOwnVariable(
    "gunType",
    `[${gunTypeIndex}/${gunTypeLength}] ${gunTypeName}`
  );
  const gunModelIndex =
    Object.keys(guns[gunTypeName]).indexOf(
      Object.keys(guns[gunTypeName])[gunModel - 1]
    ) + 1;
  const gunModelLength = Object.keys(guns[gunTypeName]).length;
  const gunModelName = Object.keys(guns[gunTypeName])[gunModel - 1];
  player.setOwnVariable(
    "gunModel",
    `[${gunModelIndex}/${gunModelLength}] ${gunModelName}`
  );
  player.setOwnVariable("gunViewHash", guns[gunTypeName][gunModelName].hash);
  player.setOwnVariable("gunViewId", guns[gunTypeName][gunModelName].id);
  player.setOwnVariable("gunModelName", gunModelName);
}

mp.events.add({
  playerCommand: (player, command) => {
    const parameters = command.split(/[ ]+/);
    console.log(
      `Игроком ${player.name} введена команда "${parameters[0]}" ${
        parameters.length === 1
          ? "без параметров"
          : "со следующими параметрами: [" +
            parameters
              .filter((item, index) => {
                return index !== 0;
              })
              .join("] [") +
            "]"
      }`
    );
    const commandName = parameters[0];
    if (commandName === "gun") {
      switch (parameters.length) {
        case 1:
          const gunTypeName =
            Object.keys(guns)[randomNumber(0, Object.keys(guns).length - 2)];
          const gunModelName = Object.keys(guns[gunTypeName])[
            randomNumber(0, Object.keys(guns[gunTypeName]).length - 1)
          ];
          player.removeAllWeapons();
          player.giveWeapon(Number(guns[gunTypeName][gunModelName].hash), 1000);
          player.setOwnVariable(
            "gunViewHash",
            guns[gunTypeName][gunModelName].hash
          );
          player.setOwnVariable(
            "gunViewId",
            guns[gunTypeName][gunModelName].id
          );
          const playerName = player.name;
          const allPlayersWithoutYou = mp.players
            .toArray()
            .filter((player) => player.name !== playerName);
          mp.players.call(
            allPlayersWithoutYou,
            "allPlayersWithoutYouBroadcastInChat:client",
            [player.name, gunModelName]
          );
          player.outputChatBox(`Вы получили - ${gunModelName}`);
          player.call("consoleMessageAboutWeapon:client", [gunModelName]);
          break;
        case 2:
          if (parameters[1] === "viewer") {
            gunSelecterViewer(player);
            player.getOwnVariable("gunViewerOn")
              ? player.setOwnVariable("gunViewerOn", false)
              : player.setOwnVariable("gunViewerOn", true);
            break;
          }
        default:
          player.outputChatBox(
            `Введите [/gun] чтобы получить случайное оружие`
          );
          player.outputChatBox(
            `Введите [/gun viewer] чтобы запустить просмотрщик оружия`
          );
      }
    } else {
      player.outputChatBox(`Команды [/${commandName}] не существует`);
    }
  },
});

mp.events.addProc("nextGunType", (player, gunType) => {
  if (gunType > Object.keys(guns).length) {
    gunSelecterViewer(player);
    return 0;
  } else {
    gunSelecterViewer(player, gunType);
    return gunType;
  }
});

mp.events.addProc("previousGunType", (player, gunType) => {
  if (gunType <= 0) {
    gunSelecterViewer(player, Object.keys(guns).length);
    return Object.keys(guns).length;
  } else {
    gunSelecterViewer(player, gunType);
    return gunType;
  }
});

mp.events.addProc("nextGunModel", (player, gunType, gunModel) => {
  if (gunModel > Object.keys(guns[Object.keys(guns)[gunType - 1]]).length) {
    gunSelecterViewer(player, gunType);
    return 0;
  } else {
    gunSelecterViewer(player, gunType, gunModel);
    return gunModel;
  }
});

mp.events.addProc("previousGunModel", (player, gunType, gunModel) => {
  if (gunModel < 1) {
    gunSelecterViewer(
      player,
      gunType,
      Object.keys(guns[Object.keys(guns)[gunType - 1]]).length
    );
    return Object.keys(guns[Object.keys(guns)[gunType - 1]]).length;
  } else {
    gunSelecterViewer(player, gunType, gunModel);
    return gunModel;
  }
});

mp.events.addProc("giveGun", (player) => {
  const gunHash = Number(player.getOwnVariable("gunViewHash"));
  const gunModelName = player.getOwnVariable("gunModelName");
  if (player.weapon !== gunHash) {
    player.removeAllWeapons();
    player.giveWeapon(gunHash, 1000);
    const playerName = player.name;
    const allPlayersWithoutYou = mp.players
      .toArray()
      .filter((player) => player.name !== playerName);
    mp.players.call(
      allPlayersWithoutYou,
      "allPlayersWithoutYouBroadcastInChat:client",
      [playerName, gunModelName]
    );
    player.outputChatBox(`Вы получили - ${gunModelName}`);
    return true;
  } else {
    player.giveWeapon(player.weapon, 1000);
    player.outputChatBox(`Вы получили еще 1000 патронов!`);
    return false;
  }
});
