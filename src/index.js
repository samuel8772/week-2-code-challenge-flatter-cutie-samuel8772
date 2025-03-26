document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000/characters";
    const characterBar = document.querySelector("#character-bar");
    const detailedInfo = document.querySelector("#detailed-info");
    const addCharacterForm = document.querySelector("#character-form");

    let currentCharacter = null; // Store the currently displayed character

    // 1️⃣ Fetch and Display Characters in the Character Bar
    fetch(baseURL)
        .then(res => res.json())
        .then(characters => {
            characters.forEach(character => {
                const span = document.createElement("span");
                span.textContent = character.name;
                span.addEventListener("click", () => showCharacterDetails(character));
                characterBar.appendChild(span);
            });
        });

    // 2️⃣ Show Character Details on Click
    function showCharacterDetails(character) {
        currentCharacter = character; // Set currently displayed character
        detailedInfo.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h2>${character.name}</h2>
            <p>Votes: <span id="vote-count">${character.votes}</span></p>

            <!-- Move the votes form here so it appears for each character -->
            <form id="votes-form">
                <input type="number" id="votes" placeholder="Enter Votes">
                <button type="submit">Add Votes</button>
            </form>

            <button id="reset-btn">Reset Votes</button>
        `;

        // Attach event listener to the newly created form
        document.querySelector("#votes-form").addEventListener("submit", (e) => {
            e.preventDefault();
            let addedVotes = parseInt(document.querySelector("#votes").value) || 0;
            let newVoteCount = currentCharacter.votes + addedVotes;

            document.querySelector("#vote-count").textContent = newVoteCount;
            currentCharacter.votes = newVoteCount;

            // (Optional) Persist votes to the server
            fetch(`${baseURL}/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: newVoteCount })
            });
        });

        // Attach event listener to reset button
        document.querySelector("#reset-btn").addEventListener("click", () => {
            document.querySelector("#vote-count").textContent = "0";
            currentCharacter.votes = 0;

            // (Optional) Persist reset votes
            fetch(`${baseURL}/${currentCharacter.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ votes: 0 })
            });
        });
    }

    // 5️⃣ Add New Character
    addCharacterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let name = document.querySelector("#name").value;
        let image = document.querySelector("#image").value;

        let newCharacter = { name, image, votes: 0 };

        // Update UI
        const span = document.createElement("span");
        span.textContent = name;
        span.addEventListener("click", () => showCharacterDetails(newCharacter));
        characterBar.appendChild(span);

        showCharacterDetails(newCharacter);

        // (Extra Bonus) Save to server
        fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter)
        })
        .then(res => res.json())
        .then(data => newCharacter.id = data.id); // Assign ID from server
    });
});