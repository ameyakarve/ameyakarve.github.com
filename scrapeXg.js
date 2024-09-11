/**
 * Load https://understat.com/league/EPL/2023
 * table = document.querySelector('#league-chemp')
 * tb = table.querySelectorAll('tbody')
 * nodes = tb.querySelectorAll('a')
 * var list = [].slice.call(nodes);
 * links = list.map(d => d.href)
 * localStorage.setItem('allteams', links)
 * 
 * Start with localStorage.setItem('idx', 0) on https://understat.com/team/Manchester_City/2023
 * Keep pasting the below script in console
 */
var idx = parseInt(localStorage.getItem('idx'));
var allTeams = localStorage.getItem('allteams').split(',').filter(a => a.trim());
var xgnodes = document.querySelectorAll(".teams-xG")
var xgnodelist = [].slice.call(xgnodes);
var homexg = xgnodelist.map(function(e) { return e.querySelector('.team-home').innerText; });
var awayxg = xgnodelist.map(function(e) { return e.querySelector('.team-away').innerText; });

var calendarnodes = document.querySelectorAll(".calendar-date")
var calendarnodelist = [].slice.call(calendarnodes);
var homeaway = calendarnodelist.map(function(e) { return e.attributes['data-side'].nodeValue; });

var teamtitlenodes = document.querySelectorAll(".team-title")
var teamtitlenodelist = [].slice.call(teamtitlenodes);
var opponent = teamtitlenodelist.map(function(e) { return allTeams.indexOf(e.children[0].href); });

localStorage.setItem(`opp-${idx}`, opponent);

localStorage.setItem(`xg-${idx}`, homexg.map((item, idx) => homeaway[idx] == 'h' ? item : awayxg[idx]));
localStorage.setItem(`home-${idx}`, homeaway);
idx++;
localStorage.setItem('idx', idx);
window.location.href = allTeams[idx];

