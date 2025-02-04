pageLoad();

function pageLoad() {
    console.log("pageLoad()");

    document.querySelector("#form").addEventListener("submit", (event) => {
        event.preventDefault();
        if (validateForm()) {
            resetForm();
            gameLoad();
        }
    });
}

function resetForm() {
    console.log("resetForm()");

    document.querySelector("#errorMsg").textContent = "";
    document.querySelector("#nick").value = "";
    document.querySelector("#age").value = "";
    document.querySelector("#boy").checked = false;
    document.querySelector("#girl").checked = false;
}

function gameLoad() {
    console.log("gameLoad()");

    document.querySelector("#formWrapper").classList.add("d-none");
    document.querySelector("#gameField").classList.remove("d-none");

    getPokemons();

    toggleMusic();
    addTrainerToDatabase();

    gameStart();
    checkForWin();
}

function gameStart() {
    timer();
    movePokemons();
}

function getPokemons() {
    console.log("getPokemons()");

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
                       if (pokemonImgRef.getAttribute("src") !==
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



function toggleMusic() {
    console.log("toggleMusic()")
    const bgMusicRef = document.querySelector("#bgMusic")
            bgMusicRef.volume = 0.04;
    if (bgMusicRef.paused) {
        bgMusicRef.play();
    } else {
         bgMusicRef.pause()
    }
}

function highScore() {}

function addTrainerToDatabase() {}

function timer() {}



function movePokemons() {
    console.log("movePokemons()");

    setInterval(() => {
        let allPokemons = document.querySelectorAll(".pokemon");
        allPokemons.forEach((pokemon) => {
            pokemon.style.top = `${oGameData.getTopPosition()}px`;
            pokemon.style.left = `${oGameData.getLeftPosition()}px`;
        });
    }, 3000);
}

function endGame() {
    console.log("endGame()")

    toggleMusic();

    timer();

    highScore();
    
    oGameData.endTimeInMilliseconds();
    let allPokemons = document.querySelectorAll(".pokemon");
        allPokemons.forEach((pokemon) => {
            pokemon.classList.add("d-none")
        });

    //Stänga av musik
    //Avsluta timer
    //Hämta total highscore
    //Kolla om score är top 10 på highscore
    //OM : Lägga till highscore och ta bort tidigare highscore.
    //Lägga in en overlay bakom highscore?

}

function checkForWin() {
    console.log("checkForWin()");
    if (oGameData.nmbrOfCaughtPokemons === 10) {
        console.log("Vinst!");
        return true;
    }
}

function validateForm() {
    console.log("validateForm()");
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
