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

document.querySelector("#form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#errorMsg").textContent = "";
    validateForm();
});
