(function(){
class SnakePart {
    static top = 1;
    static right = 2;
    static bottom = 3;
    static left = 4;
    static head = 10;
    static part = 11;
    static rear = 12;
    x = 0;
    y = 0;
    direction = undefined;
    part = undefined;
    tile = 1;
    constructor(x, y, direction = SnakePart.top, part = SnakePart.head) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.part = part;
    }
}
const caseSize = 30;
const nbCasesX = 15;
const nbCasesY = 15;

var images;
var imgLoad = 0;
var scrImages = ["apple.png", "snakeHead.png", "snakeAngle.png", "snakeAngle2.png", "snakeLine.png", "snakeLine2.png", "snakeLine3.png", "snakeRear.png"];

var firstStart = true;
var pause = true;

var nbTargetsHit = 0;
var targetCoordinates = [0, 0];
var arrayPart = new Array();

var lastImputexecuted = "ArrowUp";
var arrayInput = ["ArrowUp"];

loadingGame();

function loadingGame() {
    images = new Array();
    for (let i = 0; i < scrImages.length; i++) {
        images[i] = new Image();
        images[i].onload = function () {
            imgLoad++;
            if (imgLoad === scrImages.length) {
                init();
            }
        };
        images[i].src = "./img/" + scrImages[i];
    }
}

function init() {
    pause = true;
    nbTargetsHit = 0;
    arrayPart = new Array();
    lastImputexecuted = "ArrowUp";
    arrayInput = ["ArrowUp"];

    arrayPart.push(new SnakePart(7, 9, SnakePart.top, SnakePart.rear, 0));
    arrayPart.push(new SnakePart(7, 8, SnakePart.top, SnakePart.part, 1));
    arrayPart.push(new SnakePart(7, 7, SnakePart.top, SnakePart.head, 0));
    setNewTarget();

    if (firstStart) {
        let canvas = document.getElementById("gameWindows");
        canvas.setAttribute("height", nbCasesY * caseSize + "px");
        canvas.setAttribute("width", nbCasesX * caseSize + "px");
        displayParts();
        displayStartScreen();

        document.addEventListener("keydown", event);
        firstStart = false;
    }

    setTimeout(gameLoop, 500);
}


function gameLoop() {
    /*boucle principale*/
    let duration = 300 - Math.floor(nbTargetsHit / 7) * 20;
    if (duration < 100) duration = 100;

    if (!pause) {
        let inputDirection = lastImputexecuted;
        if (arrayInput.length > 0) {
            let nbImput = arrayInput.length;
            //si la direction mène en sens inverse, on la supprime et on passe à la suivante
            for (let i = 0; i < nbImput; i++) {
                if (goBackControl(arrayInput[0])) {
                    inputDirection = arrayInput[0];
                    break;
                } else arrayInput.shift();
            }
        }

        let Destination = collisionControl(inputDirection);
        if (Destination) {
            setTimeout(gameLoop, duration); //asynchrome, mis en avant pour ne pas être tributaire du temps de traitement

            positionRegistration(Destination);
            displayScore();
            displayParts();
        } else {
            displayParts();
            displayGameOver();
            init();
        }
    } else { // en pause
        if (document.getElementById("allScreen") === null) {
            displayPause();
        }
        setTimeout(gameLoop, 500);
    }
}

function displayParts() {
    /*gestion de l"affichage html*/
    if (document.getElementById("allScreen")) document.getElementById("allScreen").remove();

    const gameWindows = document.getElementById("gameWindows");
    let context = gameWindows.getContext("2d");
    context.clearRect(0, 0, gameWindows.width, gameWindows.height); //reset

    //le tableau est parcouru de la section la plus récente à la plus ancienne
    //cela permet de détecter les angles: ce sont les sections précédants les changements de direction
    for (let i = arrayPart.length - 1; i >= 0; i--) {
        displayPart(i);
    }
    displayApple();
}

function displayApple() {
    let canvas = document.getElementById("gameWindows");
    let context = canvas.getContext("2d");
    context.drawImage(images[0], targetCoordinates[0] * caseSize, targetCoordinates[1] * caseSize, caseSize, caseSize);
}

function displayPart(i) {
    /*affichage individuel des sections selon la partie du snake impliquée et sa direction*/
    const elt = document.createElement("div");
    let canvas = document.getElementById("gameWindows");
    let context = canvas.getContext("2d");

    if (arrayPart[i].part == SnakePart.head) {
        switch (arrayPart[i].direction) {
            case (SnakePart.top):
                context.drawImage(images[1], 0, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
                break;
            case (SnakePart.bottom):
                context.drawImage(images[1], 60, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
                break;
            case (SnakePart.left):
                context.drawImage(images[1], 90, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
                break;
            case (SnakePart.right):
                context.drawImage(images[1], 30, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
                break;
        }

    } else if (arrayPart[i].part == SnakePart.rear) {
        elt.classList.add("snakePart-rear");
        switch (arrayPart[i + 1].direction) {
            case (SnakePart.top):
                context.drawImage(images[7], 0, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
                break;
            case (SnakePart.bottom):
                context.drawImage(images[7], 60, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
                break;
            case (SnakePart.left):
                context.drawImage(images[7], 90, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
                break;
            case (SnakePart.right):
                context.drawImage(images[7], 30, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
                break;
        }
    } else if (arrayPart[i + 1].direction == arrayPart[i].direction) { //ligne droite
        let imageLine;
        if (arrayPart[i].tile == 1) imageLine = images[4];
        else if (arrayPart[i].tile == 2) imageLine = images[5];
        else imageLine = images[6];

        if (arrayPart[i].direction == SnakePart.top || arrayPart[i].direction == SnakePart.bottom) {
            context.drawImage(imageLine, 0, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
        } else {
            context.drawImage(imageLine, 30, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
        }
    } else { //angle
        let angle = 0;
        let imageAngle = images[2];
        if (arrayPart[i].tile == 2) imageAngle = images[3];
        switch (arrayPart[i + 1].direction) { //direction où je veux aller /if= direction que je suivais
            case (SnakePart.top):
                if (arrayPart[i].direction == SnakePart.left) angle = 30;
                else angle = 0; //right
                break;
            case (SnakePart.bottom):
                if (arrayPart[i].direction == SnakePart.left) angle = 60;
                else angle = 90;
                break;
            case (SnakePart.left):
                if (arrayPart[i].direction == SnakePart.top) angle = 90;
                else angle = 0; //bottom
                break;
            case (SnakePart.right):
                if (arrayPart[i].direction == SnakePart.top) angle = 60;
                else angle = 30;
                break;
        }
        context.drawImage(imageAngle, angle, 0, caseSize, caseSize, arrayPart[i].x * caseSize, arrayPart[i].y * caseSize, caseSize, caseSize);
    }
}

function displayStartScreen() {
    let elt = document.createElement("div");
    elt.id = "allScreen";
    document.getElementById("gameContainer").appendChild(elt); //ne fonctionne pas avec innerHTML directement (efface le cavenas)
    elt.innerHTML = "<h1>Snake</h1><p>press <em>space</em> to start the game</p><aside><p><span>directions : <em class='arrow'>⯇</em><em class='arrow'>▼</em><em class='arrow'>⯈</em><em class='arrow' id='haut'>▲</em></span></p><p><span>pause : <em>space</em><span></p></aside>";
}

function displayGameOver() {
    console.log("vitesse= " + (300 - Math.floor(nbTargetsHit / 7) * 20));
    let elt = document.createElement("div");
    elt.id = "allScreen";
    document.getElementById("gameContainer").appendChild(elt); //ne fonctionne pas avec innerHTML directement (efface le cavenas)
    elt.innerHTML = "<h1 id='gameOver'>GAME OVER</h1><p>press <em>space</em> to play again</p>";
}

function displayPause() {
    let elt = document.createElement("div");
    elt.id = "allScreen";
    document.getElementById("gameContainer").appendChild(elt); //ne fonctionne pas avec innerHTML directement (efface le cavenas)
    elt.innerHTML = "<h1>Pause</h1><p>press <em>space</em> to start the game</p>";
}

function displayScore() {
    let dignity = ["Tétard", "Lombric", "Grignoteur", "Gourmet", "Gourmant", "Gloutont", "Goinfre", "Sac de noeux", "Ogre", "Dieu vengeur"];
    let eltScore = document.getElementById("score");
    if (eltScore.style.visibility == "hidden") {
        eltScore.style.visibility = "visible";
    }
    let dignityNb = Math.floor(nbTargetsHit / 7);
    if (dignityNb > dignity.length - 1) dignityNb = dignity.length - 1;
    eltScore.innerHTML = "Nombre de pommes mangées : <strong>" + nbTargetsHit + "</strong><br/><strong>" + dignity[dignityNb] + "</strong>";
}

function event(e) {
    if (!e.repeat) {
        let keysSearch = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
        if (keysSearch.includes(e.key) && !pause) {
            arrayInput.push(e.key);
        } else if (e.key == " ") {
            e.preventDefault();
            pause = !pause;
        }
    }
}

function positionRegistration(Destination) {
    /*mise a jour des variables de position
    et gestion des cibles*/
    if (arrayInput.length > 0) lastImputexecuted = arrayInput[0];
    arrayInput.shift();

    //gestion du suivie des tiles
    for (let i = arrayPart.length - 1; i > 0; i--) {
        arrayPart[i].tile = arrayPart[i - 1].tile;
    }
	
    if (!controlTargetAcquired(Destination)) {
        arrayPart.shift(); //pas de suppresion si cible aquise
        arrayPart[0].tile = Math.floor((Math.random()) * 3); //détermine la tile suivante
    }
    arrayPart.push(Destination);

    arrayPart[arrayPart.length - 2].part = SnakePart.part;
    arrayPart[0].part = SnakePart.rear;
}

function collisionControl(inputDirection) {
    /* control des auto-collisions et sorties de cadre.
    entré: imput directionnel clavier
    sortie: false ou objet de destination */

    //détermine la direction et la case cible
    let Destination = new SnakePart();
    switch (inputDirection) {
        case "ArrowUp":
            Destination.x = arrayPart[arrayPart.length - 1].x;
            Destination.y = arrayPart[arrayPart.length - 1].y - 1;
            Destination.direction = SnakePart.top;
            break;
        case "ArrowRight":
            Destination.x = arrayPart[arrayPart.length - 1].x + 1;
            Destination.y = arrayPart[arrayPart.length - 1].y;
            Destination.direction = SnakePart.right;
            break;
        case "ArrowDown":
            Destination.x = arrayPart[arrayPart.length - 1].x;
            Destination.y = arrayPart[arrayPart.length - 1].y + 1;
            Destination.direction = SnakePart.bottom;
            break;
        case "ArrowLeft":
            Destination.x = arrayPart[arrayPart.length - 1].x - 1;
            Destination.y = arrayPart[arrayPart.length - 1].y;
            Destination.direction = SnakePart.left;
            break;
    }
    //test sortie de cadre
    if (Destination.x < 0 || Destination.x >= nbCasesX || Destination.y < 0 || Destination.y >= nbCasesY) {
        console.log("Hors limites. x: " + Destination.x + "; y: " + Destination.y);
        return false;
    }
    //test auto collision
    if (!controlCell(Destination.x, Destination.y)) {
        console.log("Collision. x: " + Destination.x + "; y: " + Destination.y);
        return false;
    }

    return Destination;
}

function controlCell(x, y) {
    /*passe en revu les coordonnés utilisés et compare avec celles passées en argument,
    retourne true si les coordonnés ne sont pas utilisés par arrayPart*/
    for (let i = 0; i < arrayPart.length; i++) {
        if (x == arrayPart[i].x && y == arrayPart[i].y) {
            return false;
        }
    }
    return true;
}

function goBackControl(direction) {
    /*test retour arrière
    renvoi false si un retour en arrière est détecté.*/
    if (direction == "ArrowUp" && lastImputexecuted == "ArrowDown") return false;
    else if (direction == "ArrowDown" && lastImputexecuted == "ArrowUp") return false;
    else if (direction == "ArrowLeft" && lastImputexecuted == "ArrowRight") return false;
    else if (direction == "ArrowRight" && lastImputexecuted == "ArrowLeft") return false;
    else return true;
}

function setNewTarget() {
    /*met en place une cible sur un case libre n'étant pas indentique à l"ancienne*/
    let x = 1;
    let y = 1;
    do {
        x = Math.floor(Math.random() * nbCasesX);
        y = Math.floor(Math.random() * nbCasesX);
    } while (!controlCell(x, y) || (x == targetCoordinates[0] && y == targetCoordinates[1]));
    targetCoordinates = [x, y];
}

function controlTargetAcquired(Destination) {
    if (targetCoordinates[0] == Destination.x && targetCoordinates[1] == Destination.y) {
        setNewTarget();
        nbTargetsHit++;
        return true;
    }
    return false;
}

})()
