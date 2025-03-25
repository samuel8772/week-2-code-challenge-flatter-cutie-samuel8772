function displayCharacterDetails(id) {
  fetch(`http://localhost:3000/characters/${id}`)
      .then(response => response.json())
      .then(character => {
          detailedInfo.innerHTML = `
              <h2>${character.name}</h2>
              <img src="${character.image}" alt="${character.name}" data-id="${character.id}" />
              <p>Votes: <span id="vote-count-${character.id}">${character.votes}</span></p>
              <form id="votes-form-${character.id}">
                  <input type="number" name="votes" min="1" required />
                  <button type="submit">Vote</button>
              </form>
              <button id="reset-votes-${character.id}">Reset Votes</button>
          `;

          // Add event listener for voting
          document.getElementById(`votes-form-${character.id}`).addEventListener("submit", (event) => {
              event.preventDefault();
              const voteInput = parseInt(event.target.elements.votes.value);

              if (isNaN(voteInput) || voteInput < 1) {
                  alert("Please enter a valid positive number.");
                  return;
              }
              
              const voteCount = document.getElementById(`vote-count-${character.id}`);
              const newVotes = parseInt(voteCount.textContent) + voteInput;
              voteCount.textContent = newVotes;

              // Update votes on the server
              fetch(`http://localhost:3000/characters/${character.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ votes: newVotes })
              });
          });

          // Add event listener for resetting votes
          document.getElementById(`reset-votes-${character.id}`).addEventListener("click", () => {
              const voteCount = document.getElementById(`vote-count-${character.id}`);
              voteCount.textContent = 0;

              fetch(`http://localhost:3000/characters/${character.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ votes: 0 })
              });
          });
      })
      .catch(error => {
          console.error(error);
          detailedInfo.innerHTML = "<p>Error loading character details.</p>";
      });
}


