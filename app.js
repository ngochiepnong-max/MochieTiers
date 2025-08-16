// Simple dynamic rendering
const list = document.getElementById('list');
const search = document.getElementById('search');
const tpl = document.getElementById('card-tpl');

let players = [];
let currentTab = 'overall';

fetch('data/players.json')
  .then(r => r.json())
  .then(json => {
    players = json.players;
    render();
  });

function render(){
  list.innerHTML = '';
  const q = (search.value || '').toLowerCase();
  players
    .filter(p => !q || p.name.toLowerCase().includes(q))
    .sort((a,b) => a.rank - b.rank)
    .forEach(p => list.appendChild(makeCard(p)));
}

function makeCard(p){
  const node = tpl.content.cloneNode(true);
  node.querySelector('.rank-number').textContent = p.rank;
  const avatar = node.querySelector('.avatar');
  avatar.style.background = `url(${p.avatar}) center/cover, linear-gradient(135deg,#355,#557)`;
  node.querySelector('.name').textContent = p.name;
  node.querySelector('.region').textContent = p.region || 'NA';
  const tiersWrap = node.querySelector('.tiers');
  p.tiers.forEach(t => {
    tiersWrap.appendChild(tierPill(t));
  });
  return node;
}

function tierPill(t){
  const div = document.createElement('div');
  div.className = 'tier';
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.innerHTML = iconFor(t.icon);
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = t.level;
  div.appendChild(dot);
  div.appendChild(label);
  return div;
}

function iconFor(name){
  switch(name){
    case 'pearl': return '🟣';
    case 'axe': return '🪓';
    case 'sword': return '🗡️';
    case 'heart': return '❤️';
    case 'potion': return '⚗️';
    case 'helmet': return '🪖';
    case 'pick': return '⛏️';
    default: return '⬡';
  }
}

search.addEventListener('input', render);

// Copy IP
document.getElementById('copyIp').addEventListener('click', () => {
  navigator.clipboard.writeText('mcpvp.club');
  const btn = document.getElementById('copyIp');
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = 'Copy', 1200);
});

// Tabs
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
    // For demo we keep same dataset; you can switch fetch here if needed.
    render();
  });
});
