import { elements } from "./ui/elements.js";
import { GameManager } from "./game/gameManager.js";

const gameManager = new GameManager(elements);
gameManager.init();
