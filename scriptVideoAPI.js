document.addEventListener('DOMContentLoaded', function () {
    const teamDropdown = document.getElementById('teamSelect');
    showTeams();
    teamDropdown.addEventListener('change', function(){
        const teamId = this.value;
        fetchMatchVideos(teamId);
    });
});

function fetchMatchVideos(teamID) {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamID}`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const lastThreeMatches = data.results.slice(0, 5);
          const matchesContainer = document.getElementById('matches');
          matchesContainer.innerHTML = '';
          lastThreeMatches.forEach(match => {
            const homeTeam = match.strHomeTeam;
            const awayTeam = match.strAwayTeam;
            const videoLink = match.strVideo;
            const homeLogo = match.strHomeTeamBadge;
            const awayLogo = match.strAwayTeamBadge;
            const matchInfo = document.createElement('div');
            matchInfo.classList.add('match');
            matchInfo.innerHTML = `
              <div class="team-logo">
                <img src="${homeLogo}" alt="${homeTeam} Logo">
              </div>
              <div class="match-info">
                <h3>${homeTeam} vs ${awayTeam}</h3>
                <a href="${videoLink}" target="_blank">Highlight Video</a></p>
                <button class="removeTeam">Remove</button> 
              </div>
              <div class="team-logo">
                <img src="${awayLogo}" alt="${awayTeam} Logo">
              </div>
            `;
            matchesContainer.appendChild(matchInfo);

            const removeButton = matchInfo.querySelector('.removeTeam');
            removeButton.addEventListener('click', function() {
                matchesContainer.removeChild(matchInfo);
             });
          });
        }
      })
}

function showTeams() {
    const teamDropdown = document.getElementById('teamSelect');
    fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League`)
    .then(response => response.json())
    .then(data => {
        data.teams.forEach(team => {
            const option = document.createElement('option');
            option.text = team.strTeam;
            option.value = team.idTeam;
            teamDropdown.add(option);
        });
    });
}
