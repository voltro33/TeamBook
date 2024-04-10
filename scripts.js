let teams2 = [];

function showCards() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const templateCard = document.querySelector(".card");

    for (let i = 0; i < teams2.length; i++) {
        let teamID = teams2[i];

        const nextCard = templateCard.cloneNode(true);
        editCardContent(nextCard, teamID, i);
        cardContainer.appendChild(nextCard);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    displayTeamList();
    showCards();
});

function quoteAlert() {
    console.log("Button Clicked!")
    alert("Life could be a dream...!");
}


function displayTeamList() {
    teams2 = loadTeamsData();  //---> this is in ScriptAPI btw
    console.log("Team List:", teams2);
}

function editCardContent(card, teamID, i) {
    fetch(`https://corsproxy.io/?https://api.football-data.org/v2/teams/${teamID}`, {
        headers: {
            'X-Auth-Token': '3ffc8b7376ce456eba25599a38e36bea'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.crestUrl) {
            const teamName = data.name;
            const teamLogoURL = data.crestUrl;
            
            card.style.display = "block";

            const cardHeader = card.querySelector("h2");
            cardHeader.textContent = teamName;

            const cardImage = card.querySelector("img");
            cardImage.src = teamLogoURL;
            cardImage.alt = teamName + " Logo";

            const teamInfo = document.createElement('div');
            teamInfo.innerHTML = `
            <button style="background-color: rgb(0, 180, 251);" class="view-button">View</button>
                <button style="background-color: rgb(251, 79, 0);" class="removeTeam">Remove Team</button> 
            `;
            card.appendChild(teamInfo);

            const removeButton = teamInfo.querySelector('.removeTeam');
            removeButton.addEventListener('click', function() {
                removeTeam(i);   // ----> this is in scriptAPI btw, just removes a team from the index and saves it on the session
            });

            const viewButton = teamInfo.querySelector('.view-button');
            viewButton.addEventListener('click', function() {
                window.location.href = `pastMatches.html?teamId=${teamID}`;
            });

        } 
    })
}
