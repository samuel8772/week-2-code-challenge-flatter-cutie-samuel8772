function displayAnimals() {
    const animalsContainer = document.getElementById("animals-container");

    fetch("http://localhost:3000/characters")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch animals");
            }
            return response.json();
        })
        .then(animals => {
            animalsContainer.innerHTML = ""; // Clear previous content

            animals.forEach(animal => {
                const animalCard = document.createElement("div");
                animalCard.classList.add("animal-card");

                animalCard.innerHTML = `
                    <h2>${animal.name}</h2>
                    <img src="${animal.image}" alt="${animal.name}" />
                    <p>Votes: <span id="vote-count-${animal.id}">${animal.votes}</span></p>
                    <form class="votes-form" data-id="${animal.id}">
                        <input type="number" name="votes" min="1" required />
                        <button type="submit">Vote</button>
                    </form>
                    <button class="reset-votes" data-id="${animal.id}">Reset Votes</button>
                `;

                animalsContainer.appendChild(animalCard);
            });

            // Attach event listeners for voting
            document.querySelectorAll(".votes-form").forEach(form => {
                form.addEventListener("submit", (event) => {
                    event.preventDefault();
                    const animalId = event.target.getAttribute("data-id");
                    const voteInput = Math.abs(parseInt(event.target.elements.votes.value, 10));

                    if (isNaN(voteInput) || voteInput < 1) {
                        alert("Please enter a valid positive number.");
                        return;
                    }

                    const voteCountElement = document.getElementById(`vote-count-${animalId}`);
                    const newVotes = parseInt(voteCountElement.textContent, 10) + voteInput;
                    voteCountElement.textContent = newVotes;

                    // Reset input field
                    event.target.reset();

                    // Update votes on the server
                    fetch(`http://localhost:3000/characters/${animalId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ votes: newVotes })
                    })
                    .catch(error => console.error("Error updating votes:", error));
                });
            });

            // Attach event listeners for resetting votes
            document.querySelectorAll(".reset-votes").forEach(button => {
                button.addEventListener("click", () => {
                    const animalId = button.getAttribute("data-id");
                    const voteCountElement = document.getElementById(`vote-count-${animalId}`);
                    voteCountElement.textContent = 0;

                    fetch(`http://localhost:3000/characters/${animalId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ votes:
