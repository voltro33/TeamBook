function fetchFutureMatches(teamId, numMatch) {
    const url = `https://proxy.cors.sh/?https://api.football-data.org/v2/teams/${teamId}/matches?status=SCHEDULED`;
    const headers = {
        'X-Auth-Token': 'be3a4a0da29649b49f4e2993959b7c28'
    };

    fetch(url, { headers })
        .then(response => {
            return response.json();
        })
        .then(data => {
            const futureMatches = data.matches.slice(0, numMatch).reverse();
            const matchesContainer = document.getElementById('matches');
            matchesContainer.innerHTML = '';
            futureMatches.forEach(match => {
                Promise.all([
                    findImage(match.homeTeam.id),
                    findImage(match.awayTeam.id)
                ]).then(([homeLogo, awayLogo]) => {
                    const matchElement = document.createElement('div');
                    matchElement.classList.add('match');

                    const homeLogoElement = document.createElement('img');
                    homeLogoElement.src = homeLogo;
                    homeLogoElement.alt = match.homeTeam.name + ' Logo';
                    matchElement.appendChild(homeLogoElement);

                    const competitionElement = document.createElement('p');
                    competitionElement.textContent = match.competition.name;
                    matchElement.appendChild(competitionElement);

                    const awayLogoElement = document.createElement('img');
                    awayLogoElement.src = awayLogo;
                    awayLogoElement.alt = match.awayTeam.name + ' Logo';
                    matchElement.appendChild(awayLogoElement);

                    const matchDateDiv = document.createElement('div');

                    const matchDateElement = document.createElement('p');
                    const matchDate = new Date(match.utcDate);
                    const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    matchDateElement.textContent = dateFormatter.format(matchDate);
                    matchDateDiv.appendChild(matchDateElement);

                    const matchTimeElement = document.createElement('p');
                    const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                    matchTimeElement.textContent = timeFormatter.format(matchDate);
                    matchDateDiv.appendChild(matchTimeElement);

                    matchElement.appendChild(matchDateDiv);

                    matchesContainer.appendChild(matchElement);
                })
            });
        })
}


function findImage(teamID) {
    return fetch(`https://corsproxy.io/?https://api.football-data.org/v2/teams/${teamID}`, {
        headers: {
            'X-Auth-Token': '3ffc8b7376ce456eba25599a38e36bea'
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data && data.crestUrl) {
            return data.crestUrl;
        } 
    })
}

function getTeamIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('teamId');
}

const teamId = getTeamIdFromUrl();

function goPastMatch() {
    window.location.href = `pastMatches.html?teamId=${teamId}`;
}

fetchFutureMatches(teamId, 2);
