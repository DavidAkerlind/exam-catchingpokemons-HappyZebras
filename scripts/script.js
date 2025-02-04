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
}

function gameStart() {
    startTimer();
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
                pokemonImgRef.setAttribute("id", "pokemon");

                pokemonImgRef.style.position = "absolute";
                pokemonImgRef.style.left = `${oGameData.getLeftPosition()}px`;
                pokemonImgRef.style.top = `${oGameData.getTopPosition()}px`;

                pokemonImgRef.addEventListener("mouseenter", () => {
                    if (
                        pokemonImgRef.getAttribute("src") !==
                        "./assets/ball.webp"
                    ) {
                        pokemonImgRef.setAttribute("src", "./assets/ball.webp");
                    } else {
                        pokemonImgRef.setAttribute(
                            "src",
                            `./assets/pokemons/${randomImage}`
                        );
                    }

                    checkForWin();
                });
                document.querySelector("#gameField").appendChild(pokemonImgRef);
            }
        });
}

function toggleMusic() {}

function addTrainerToDatabase() {}

function startTimer() {}

function movePokemons() {}

function checkForWin() {}

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
