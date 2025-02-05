pageLoad();

//Load event listener for #form and #playAgainBtn
function pageLoad() {

    document.querySelector("#form").addEventListener("submit", (event) => {
        event.preventDefault();
        if (validateForm()) {
            resetForm();
            gameLoad();
        }
    });

    document.querySelector("#playAgainBtn").addEventListener("click", pageReload);
}

// Clears and resets the inputfields and th errormessage in the form
function resetForm() {

    document.querySelector("#errorMsg").textContent = "";
    document.querySelector("#nick").value = "";
    document.querySelector("#age").value = "";
    document.querySelector("#boy").checked = false;
    document.querySelector("#girl").checked = false;
}

// Hides the form and loads in pokemons, music, gamefield and starts game
function gameLoad() {

    document.querySelector("#formWrapper").classList.add("d-none");
    document.querySelector("#gameField").classList.remove("d-none");

    getPokemons();
    toggleMusic();
    gameStart();
}

// Starts the timer and begins the movement of pokemons
function gameStart() {

    oGameData.startTimeInMilliseconds();
    movePokemons();
}

//Create function to get Pokemons images from Json-file and use for-loop to random them to game field
function getPokemons() {

    fetch("./scripts/files.json")
        .then((response) => response.json())
        .then((data) => {
            const images = data.files;

            for (let i = 0; i < 10; i++) {
                const randomImage =
                    images[Math.floor(Math.random() * images.length)];

                oGameData.pokemonNumbers.push(randomImage);

                let pokemonImgRef = document.createElement("img");
                pokemonImgRef.setAttribute(
                    "src",
                    `./assets/pokemons/${randomImage}`
                );
                pokemonImgRef.classList.add("pokemon");

                pokemonImgRef.style.position = "absolute";
                pokemonImgRef.style.left = `${oGameData.getLeftPosition()}px`;
                pokemonImgRef.style.top = `${oGameData.getTopPosition()}px`;

                pokemonImgRef.addEventListener("mouseenter", () => {
                    if (
                        pokemonImgRef.getAttribute("src") !==
                        "./assets/ball.webp"
                    ) {
                        pokemonImgRef.setAttribute("src", "./assets/ball.webp");
                        oGameData.nmbrOfCaughtPokemons++;
                    } else {
                        pokemonImgRef.setAttribute(
                            "src",
                            `./assets/pokemons/${randomImage}`
                        );
                        oGameData.nmbrOfCaughtPokemons--;
                    }
                    if (checkForWin()) {
                        endGame();
                    }
                });

                document.querySelector("#gameField").appendChild(pokemonImgRef);
            }
        });
}

// If music from the audio-element is playing than pause else start the music
function toggleMusic() {

    const bgMusicRef = document.querySelector("#bgMusic");
    bgMusicRef.volume = 0.04;
    if (bgMusicRef.paused) {
        bgMusicRef.play();
    } else {
        bgMusicRef.pause();
    }
}

// Gets the time from game, if the highscore-list from localstorage is empty than render deafult list 
// Add trainer name + time to list, sort list, take out the last name on the list if > 10
// Shows the highscore list and sends it to localstorage. Displays personalisied win-message
// Returns highscorelist for printing in next function
function highScore() {

    let gameTime = oGameData.nmbrOfMilliseconds() / 10;

    gameTime = Math.round(gameTime)

    gameTime = gameTime / 100

    let defaultHighScores = [
        { trainerName: "Ash", time: 4.35 },
        { trainerName: "Misty", time: 13.21 },
        { trainerName: "Brock", time: 6.53 },
        { trainerName: "Pikachu", time: 11.78 },
        { trainerName: "Charizard", time: 15.87 },
        { trainerName: "Squirtle", time: 21.54 },
        { trainerName: "Bulbasaur", time: 12.91 },
        { trainerName: "Eevee", time: 9.12 },
        { trainerName: "Meowth", time: 13.87 },
        { trainerName: "Psyduck", time: 28.02 },
    ];
    defaultHighScores = JSON.stringify(defaultHighScores);

    let highScoreList = JSON.parse(
        localStorage.getItem("highScoreList") || defaultHighScores
    );

    let trainerInfo = { trainerName: oGameData.trainerName, time: gameTime };

    highScoreList.push(trainerInfo);

    highScoreList.sort((a, b) => a.time - b.time);

    if (highScoreList.length > 10) {
        highScoreList.pop();
    }

    localStorage.setItem("highScoreList", JSON.stringify(highScoreList));

    document.querySelector("#highScore").classList.remove("d-none");

    let genderTitle = "";
    if (oGameData.trainerGender === "Boy") {
        genderTitle = "Mr.";
    } else {
        genderTitle = "Ms.";
    }
    document.querySelector(
        "#winMsg"
    ).textContent = `Well played ${genderTitle} ${oGameData.trainerName}, your time is: ${gameTime}s`;

    return highScoreList;
}

//Change the position of each pokemon at random, with an interval. Clears previous interval first.
function movePokemons() {

    clearInterval(oGameData.timeId);

    oGameData.timeId = setInterval(() => {
        let allPokemons = document.querySelectorAll(".pokemon");
        allPokemons.forEach((pokemon) => {
            pokemon.style.top = `${oGameData.getTopPosition()}px`;
            pokemon.style.left = `${oGameData.getLeftPosition()}px`;
        });
    }, 3000);
}

//Turn music off, hides all pokemons, stop the timer and show the highscore list.
function endGame() {

    toggleMusic();

    oGameData.endTimeInMilliseconds();

    highScorePrintOut(highScore());

    let allPokemons = document.querySelectorAll(".pokemon");
    allPokemons.forEach((pokemon) => {
        pokemon.classList.add("d-none");
    });
}
//Clears the page and reloads the validation form.
function pageReload() {

    oGameData.init();
    document.querySelector("#highScore").classList.add("d-none");
    document.querySelector("#gameField").classList.add("d-none");
    document.querySelector("#formWrapper").classList.remove("d-none");
}

// Resets the list in html and then loop through each highscore item from the parameter
// Create li element with the players name and time as two p-elements
// Append the full li-element to the ol-list
function highScorePrintOut(highScoreList) {

    document.querySelector("#highscoreList").textContent = "";

    for (let i = 0; i < highScoreList.length; i++) {
        let liRef = document.createElement("li");
        let divRef = document.createElement("div");
        let playerRef = document.createElement("p");
        let timeRef = document.createElement("p");
        divRef.classList.add("high-score__list-item");
        playerRef.setAttribute("id", "highScorePlayer");
        timeRef.setAttribute("id", "highScoreTime");

        playerRef.textContent = highScoreList[i].trainerName;

        timeRef.textContent = `${highScoreList[i].time} s`;

        document.querySelector("#highscoreList").appendChild(liRef);
        liRef.appendChild(divRef);
        divRef.appendChild(playerRef);
        divRef.appendChild(timeRef);
    }
}
// We log the amount of caught pokemons in the globalvariable 
// if this variable is 10 then we have caught all pokemons and we return true to run the endGame function
function checkForWin() {

    if (oGameData.nmbrOfCaughtPokemons === 10) {
        console.log("Vinst!");
        return true;
    }
}

//Validates user input from form and returns error message.
function validateForm() {

    let trainerName = document.querySelector("#nick");
    let trainerAge = document.querySelector("#age");
    let isTrainerGenderBoy = document.querySelector("#boy");
    let isTrainerGenderGirl = document.querySelector("#girl");

    try {
        if (trainerName.value.length < 5 || trainerName.value.length > 10) {
            throw {
                message: "Your nickname must be 5 to 10 letters of length.",
                nodeRef: trainerName,
            };
        } else if (isNaN(trainerAge.value) || trainerAge.value === "") {
            throw {
                message: "You must enter a valid number as your age.",
                nodeRef: trainerName,
            };
        } else if (trainerAge.value < 10 || trainerAge.value > 15) {
            throw {
                message:
                    "You must be between 10 and 15 years old to play the game.",
                nodeRef: trainerAge,
            };
        } else if (
            !isTrainerGenderBoy.checked &&
            !isTrainerGenderGirl.checked
        ) {
            throw {
                message: "You must choose gender to play the game.",
                nodeRef: trainerAge,
            };
        }
        oGameData.trainerName = trainerName.value;
        oGameData.trainerAge = trainerAge.value;
        if (isTrainerGenderBoy.checked) {
            oGameData.trainerGender = "Boy";
        } else {
            oGameData.trainerGender = "Girl";
        }

        return true;
    } catch (error) {
        document.querySelector("#errorMsg").textContent = error.message;
        error.nodeRef.focus();

        return false;
    }
}
