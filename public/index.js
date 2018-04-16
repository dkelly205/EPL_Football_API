var app = function(){
  const url = "http://api.football-data.org/v1/competitions/445/teams";
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.setRequestHeader("X-Auth-Token", "712265f452b34e6b9a3e2d967fe81811");

  const url2 = "http://api.football-data.org/v1/competitions/445/leagueTable";
  const request2 = new XMLHttpRequest();
  request2.open("GET", url2);
  request2.setRequestHeader("X-Auth-Token", "712265f452b34e6b9a3e2d967fe81811");

  request.addEventListener("load", function() {
  const teams = JSON.parse(request.responseText);
  renderDropDown(teams);
  });

  request2.addEventListener("load", function(){
  const leagueTable = JSON.parse(request2.responseText);
  getLeagueTable(leagueTable.standing);
  })

  request.send();
  request2.send();
}

var getLeagueTable = function(teams){
  var mainDiv = document.getElementById('main');
  var heading = document.createElement('h3')
  heading.innerText = "League Table";
  mainDiv.appendChild(heading);
  var table = document.createElement('table');
  var head = document.createElement('tr');
  var teamPosition = document.createElement('th');
  teamPosition.innerText = 'Position'
  var teamName = document.createElement('th');
  teamName.innerText = 'Name'
  var teamPlayed = document.createElement('th');
  teamPlayed.innerText = 'Played'
  var teamWins = document.createElement('th');
  teamWins.innerText = 'W'
  var teamDraws = document.createElement('th');
  teamDraws.innerText = 'D'
  var teamLosses = document.createElement('th');
  teamLosses.innerText = 'L'
  var teamGoalDiff= document.createElement('th');
  teamGoalDiff.innerText = 'GD'
  var teamPoints = document.createElement('th');
  teamPoints.innerText = 'Pts'

  head.appendChild(teamPosition);
  head.appendChild(teamName);
  head.appendChild(teamPlayed);
  head.appendChild(teamWins);
  head.appendChild(teamDraws);
  head.appendChild(teamLosses);
  head.appendChild(teamGoalDiff);
  head.appendChild(teamPoints);
  table.appendChild(head);

  teams.forEach(function(team){
    var tr = document.createElement('tr');
    var position = document.createElement('td');
    position.innerText = team.position;
    var name = document.createElement('td');
    name.innerText = team.teamName;
    var played = document.createElement('td');
    played.innerText = team.wins + team.draws + team.losses;
    var wins = document.createElement('td');
    wins.innerText = team.wins;
    var draws = document.createElement('td');
    draws.innerText = team.draws;
    var losses = document.createElement('td');
    losses.innerText = team.losses;
    var goalDifference = document.createElement('td');
    goalDifference.innerText = team.goalDifference;
    var points = document.createElement('td');
    points.innerText = team.points;

    tr.appendChild(position);
    tr.appendChild(name);
    tr.appendChild(played);
    tr.appendChild(wins);
    tr.appendChild(draws);
    tr.appendChild(losses);
    tr.appendChild(goalDifference);
    tr.appendChild(points);
    table.appendChild(tr)
  })
  mainDiv.appendChild(table);
}




var renderDropDown = function(teams){
  var dropDown = createDropDown(teams);
  var mainDiv = document.getElementById('dropDown');
  mainDiv.appendChild(dropDown);
}

var createDropDown = function(teams){
  var select = document.createElement('select');
  var defaultOption = document.createElement('option');
  defaultOption.innerText = 'Select a team';
  defaultOption.disabled=true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);
  teams.teams.forEach(function(team, index){
    var optionTag = createOptionTag(team.name, index);
    select.appendChild(optionTag);
  })
  select.addEventListener('change', function(event){
    var selectedIndex = event.target.value;
    selectTeam(teams, selectedIndex);
  })
  return select;
}

var createOptionTag = function(text, index){
  var option = document.createElement('option');
  option.innerText = text;
  option.value = index;
  return option;
}

var selectTeam = function(teams, selectedIndex){
  // debugger;
  const mainDiv = document.getElementById('main');
  // mainDiv.innerHTML = "";
  while(mainDiv.firstChild){
    mainDiv.removeChild(mainDiv.firstChild);
  }
  var team = teams.teams[selectedIndex];
  var teamDetails = createListItem(team);
  createSingleTeam(teamDetails);
  // debugger;
  // console.log(teams);
  // console.log("team", teams.teams[selectedIndex]._links.players.href);
  const url3 = teams.teams[selectedIndex]._links.players.href;
  //create new AJAX request
  const request3 = new XMLHttpRequest();
  request3.open("GET", url3);
  request3.setRequestHeader("X-Auth-Token", "712265f452b34e6b9a3e2d967fe81811");

  request3.addEventListener("load", function() {
  const players = JSON.parse(request3.responseText);
  getTeamPlayers(players);

  });
  request3.send();
}

var createListItem = function(team){
  var ul = document.createElement('ul');
  var name = document.createElement('li');
  name.innerText = team.name + " ";
  var img = createImage(team);
  name.appendChild(img);
  ul.appendChild(name);
  return ul;
}

var createImage = function(team){
  var img = document.createElement('img');
  img.src = team.crestUrl;
  img.alt = `${team.name} logo`;
  img.height = 40;
  return img;
}

var getTeamPlayers = function(players){

  var mainDiv = document.getElementById('main');

  var tableOfPlayers = document.createElement('table');
  var head = document.createElement('tr');
  var squadNo = document.createElement('th');
  squadNo.innerText = 'Number'
  var name = document.createElement('th');
  name.innerText = 'Name'
  var position = document.createElement('th');
  position.innerText = 'Position'

  head.appendChild(squadNo);
  head.appendChild(name);
  head.appendChild(position);
  tableOfPlayers.appendChild(head);

  players.players.forEach(function(player){
    var tr = document.createElement('tr');
    var number = document.createElement('td');
    number.innerText = player.jerseyNumber;
    var name = document.createElement('td');
    name.innerText = player.name;
    var position = document.createElement('td');
    position.innerText = player.position;

    tr.appendChild(number);
    tr.appendChild(name);
    tr.appendChild(position);
    tableOfPlayers.appendChild(tr)



  })
  mainDiv.appendChild(tableOfPlayers);



  console.log(players.players.length);
  let homegrown = [];
  players.players.forEach(function(player){
    console.log(player);
    if(player.nationality === "England"){
      homegrown.push(player)
  }
  });

  console.log(homegrown.length);

  var container = document.createElement('div');
  var chart = new Highcharts.Chart({
    chart: {
      type: 'pie',
      renderTo: container
    },
    title: { //NEW
       text: "Homegrown vs Foreign"
    },
    series: [{
      name: "Type", //NEW
       data: [{
         name: "Homegrown",
         y: homegrown.length,
         color: "red"
       },
       {
         name: "Foreign",
         y: players.players.length - homegrown.length,
         color: "navy"
       }]
    }]
 })

  mainDiv.appendChild(container);






}

var createSingleTeam = function(team){
  var mainDiv = document.getElementById('main');
  var existingTeam = document.querySelector('ul');

  if(existingTeam != null){
    mainDiv.removeChild(existingTeam);
  }
  mainDiv.appendChild(team);
}



window.addEventListener('load', app);
