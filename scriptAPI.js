let teams = ['64', '65', '57'];

document.addEventListener("DOMContentLoaded", function() {
    const leagueDropdown = document.getElementById('leagueSelect');
    const teamDropdown = document.getElementById('teamSelect');
    const apiToken = 'be3a4a0da29649b49f4e2993959b7c28';
    let addedTeamID = "";

    function populateLeagues() {
        const apiURL = 'https://corsproxy.io/?https://api.football-data.org/v2/competitions';
        fetch(apiURL, {
            headers: {
                'X-Auth-Token': `${apiToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            data.competitions.forEach(competition => {
                if (competition.plan === 'TIER_ONE') {
                    const option = document.createElement('option');
                    option.text = competition.name;
                    option.value = competition.id;
                    leagueDropdown.add(option);
                }
            });
        })
    }

    function populateTeams(leagueId) {
        const teamsURL = `https://corsproxy.io/?https://api.football-data.org/v2/competitions/${leagueId}/teams`;
        
        fetch(teamsURL, {
            headers: {
                'X-Auth-Token': `${apiToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            teamDropdown.innerHTML = '';
            data.teams.forEach(team => {
                const option = document.createElement('option');
                option.text = team.name;
                option.value = team.id;
                teamDropdown.add(option);
            });
        })
    }

    leagueDropdown.addEventListener('change', function() {
        const selectedLeagueId = this.value;
            populateTeams(selectedLeagueId);
    });

    teamDropdown.addEventListener('change', function() {
        const selectedTeamId = this.value;
        const teamLogo = document.getElementById('teamImage');
        fetch(`https://corsproxy.io/?https://api.football-data.org/v2/teams/${selectedTeamId}`, {
            headers: {
                'X-Auth-Token': `${apiToken}`
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data && data.crestUrl) {
                teamLogo.src = data.crestUrl; 
                teamLogo.alt = data.name; 
                addedTeamID = selectedTeamId;
            }
        })
       
    });

    const addTeamButton = document.getElementById('addTeam');
    addTeamButton.addEventListener('click', function() {
        if (addedTeamID !== "") {
            teams.push(addedTeamID);
            saveTeamsData();
            window.location.reload();
        }
        else {
            console.error('Cant add team!!!');
        }
    });

    loadTeamsData();
    populateLeagues();
});


function removeTeam(index) {
    teams.splice(index, 1);
    saveTeamsData();
    window.location.reload();
}

function saveTeamsData() {
    sessionStorage.setItem('teams', JSON.stringify(teams));
}

function loadTeamsData() {
    const storedTeams = sessionStorage.getItem('teams');
    if (storedTeams) {
        teams = JSON.parse(storedTeams);
    }

    return teams;
}
