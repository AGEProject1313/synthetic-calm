const profiles = [
  {nick:'MetroKind', age:31, photo:'assets/profiles/001.jpg', bio:'Consistent baseline player. Early courts, clean rallies, no drama.', tags:['Baseline', 'Morning Player', 'Intermediate'], rating:'3.5', shield:false, target:false},
  {nick:'VelvetLoop', age:29, photo:'assets/profiles/002.jpg', bio:'Plays better after work. Looking for relaxed singles and mixed doubles.', tags:['Singles', 'Evening Match', 'Friendly'], rating:'3.0', shield:false, target:false},
  {nick:'CivicBloom', age:27, photo:'assets/profiles/003.jpg', bio:'New to competitive sets. Good footwork, terrible second serve.', tags:['Beginner+', 'Practice Sets', 'Hard Court'], rating:'2.5', shield:false, target:false},
  {nick:'BlueHarbor', age:33, photo:'assets/profiles/004.jpg', bio:'Weekend doubles, clean volleys, and coffee after the match.', tags:['Doubles', 'Volley', 'Weekend'], rating:'3.0', shield:true, target:false},
  {nick:'MiraByte', age:24, photo:'assets/profiles/005.jpg', bio:'Fast rallies, quick returns, always tracking stats.', tags:['Returner', 'Stats', 'Fast Pace'], rating:'3.5', shield:false, target:false},
  {nick:'LunaTrace', age:32, photo:'assets/profiles/006.jpg', bio:'Night courts and long rallies. I play to win, politely.', tags:['Night Match', 'Competitive', 'Hard Court'], rating:'4.0', shield:false, target:false},
  {nick:'NovaMuse', age:26, photo:'assets/profiles/007.jpg', bio:'Still learning match rhythm. Good energy, weak tiebreaks.', tags:['Practice', 'Casual', 'Learning'], rating:'2.5', shield:false, target:false},
  {nick:'AxisWren', age:41, photo:'assets/profiles/008.jpg', bio:'Reliable doubles partner. I like structured games and punctual players.', tags:['Doubles', 'Tactical', 'Punctual'], rating:'3.5', shield:false, target:false},
  {nick:'KiteSignal', age:30, photo:'assets/profiles/009.jpg', bio:'Weekend player. Slice too much, laugh too often.', tags:['Slice', 'Weekend', 'Casual'], rating:'3.0', shield:false, target:false},
  {nick:'AmberLoop', age:28, photo:'assets/profiles/010.jpg', bio:'Evening matches, decent serve, better third set.', tags:['Evening Match', 'Singles', 'Endurance'], rating:'3.5', shield:false, target:false},
  {nick:'MoonRelay', age:34, photo:'assets/profiles/011.jpg', bio:'Nights are quieter. Less noise. Better rallies.', tags:['Night Match', 'Lake Pavilion', 'Intermediate+'], rating:'4.0', shield:true, target:true},
  {nick:'PolarFrame', age:37, photo:'assets/profiles/012.jpg', bio:'Patient from the baseline. Not fast, but difficult to move.', tags:['Baseline', 'Defensive', 'Singles'], rating:'3.5', shield:false, target:false},
  {nick:'UrbanSwan', age:31, photo:'assets/profiles/013.jpg', bio:'Clean technique, soft hands at the net, prefers early evenings.', tags:['Net Play', 'Evening Match', 'Mixed Doubles'], rating:'3.0', shield:false, target:false},
  {nick:'CrimsonMap', age:33, photo:'assets/profiles/014.jpg', bio:'Knows every court in Veyra. Plays aggressive from the first point.', tags:['Aggressive', 'City Courts', 'Singles'], rating:'4.0', shield:false, target:false},
  {nick:'SoftCircuit', age:25, photo:'assets/profiles/015.jpg', bio:'Casual hits, neon courts, and no judgment on double faults.', tags:['Casual', 'Practice', 'Beginner+'], rating:'2.5', shield:false, target:false},
  {nick:'AsterLane', age:30, photo:'assets/profiles/016.jpg', bio:'Good serve, bad patience. Looking for competitive friendly matches.', tags:['Serve', 'Competitive', 'Friendly'], rating:'3.5', shield:false, target:false},
  {nick:'HaloMint', age:27, photo:'assets/profiles/017.jpg', bio:'Fresh air, clean courts, and short warmups.', tags:['Fitness', 'Hard Court', 'Short Sets'], rating:'3.0', shield:false, target:false},
  {nick:'EchoVale', age:36, photo:'assets/profiles/018.jpg', bio:'I read opponents better than I hit winners.', tags:['Tactical', 'Control', 'Singles'], rating:'3.5', shield:true, target:false},
  {nick:'IvyVector', age:28, photo:'assets/profiles/019.jpg', bio:'Runner with a racquet. Long rallies preferred.', tags:['Runner', 'Endurance', 'Baseline'], rating:'3.5', shield:false, target:false},
  {nick:'NeonPiano', age:23, photo:'assets/profiles/020.jpg', bio:'Late matches only. Decent backhand, unreliable schedule.', tags:['Night Match', 'Backhand', 'Casual'], rating:'3.0', shield:false, target:false},
  {nick:'LatticeBlue', age:35, photo:'assets/profiles/021.jpg', bio:'Urban planner. Court planner. Always books the right slot.', tags:['Booking', 'Hard Court', 'Doubles'], rating:'3.0', shield:false, target:false},
  {nick:'SilverHush', age:32, photo:'assets/profiles/022.jpg', bio:'Quiet courts, clean rallies, no shouting.', tags:['Quiet Match', 'Baseline', 'Friendly'], rating:'3.5', shield:false, target:false},
  {nick:'SunsetGrip', age:38, photo:'assets/profiles/023.jpg', bio:'Prefers sunset sessions and players who call lines honestly.', tags:['Sunset Match', 'Fair Play', 'Singles'], rating:'3.0', shield:false, target:false},

  {nick:'GlassSignal', age:39, photo:'assets/profiles/024.jpg', bio:'Flat shots, clean timing, short points when possible.', tags:['Flat Hitter', 'Singles', 'Hard Court'], rating:'3.5', shield:false, target:false},
  {nick:'NorthArray', age:42, photo:'assets/profiles/025.jpg', bio:'Direct game. Strong serve. No wasted movement.', tags:['Serve', 'Power', 'Competitive'], rating:'4.0', shield:true, target:false},
  {nick:'RailGhost', age:45, photo:'assets/profiles/026.jpg', bio:'Old-school tennis. Slice, patience, and awkward angles.', tags:['Slice', 'Veteran', 'Tactical'], rating:'3.5', shield:false, target:false},
  {nick:'StaticFox', age:36, photo:'assets/profiles/027.jpg', bio:'Fixes strings, grips, and occasionally broken confidence.', tags:['Gear', 'Practice', 'Friendly'], rating:'3.0', shield:false, target:false},
  {nick:'CobaltNine', age:50, photo:'assets/profiles/028.jpg', bio:'Disciplined warmup, disciplined serve, espresso after.', tags:['Serve', 'Fitness', 'Morning Player'], rating:'3.5', shield:false, target:false},
  {nick:'SignalMoth', age:38, photo:'assets/profiles/029.jpg', bio:'Calm rallies, clean footwork, slow starts.', tags:['Footwork', 'Control', 'Practice'], rating:'3.0', shield:false, target:false},
  {nick:'IronDawn', age:47, photo:'assets/profiles/030.jpg', bio:'Early courts. Heavy topspin. Not much small talk.', tags:['Topspin', 'Morning Player', 'Competitive'], rating:'4.0', shield:true, target:false},
  {nick:'HexRiver', age:35, photo:'assets/profiles/031.jpg', bio:'Lefty serve, strange angles, very fair line calls.', tags:['Lefty', 'Angles', 'Singles'], rating:'3.5', shield:false, target:false},
  {nick:'SlateEcho', age:44, photo:'assets/profiles/032.jpg', bio:'Quiet confidence. Strong coffee. Better backhand.', tags:['Backhand', 'Coffee', 'Singles'], rating:'3.5', shield:false, target:false},
  {nick:'BetaSage', age:29, photo:'assets/profiles/033.jpg', bio:'Systems thinker with chaotic footwork.', tags:['Practice', 'Learning', 'Friendly'], rating:'2.5', shield:false, target:false},
  {nick:'QuantumVibe', age:40, photo:'assets/profiles/034.jpg', bio:'Late trains, late courts, decent first serve.', tags:['Night Match', 'Serve', 'Hard Court'], rating:'3.5', shield:false, target:false},
  {nick:'DeltaKind', age:46, photo:'assets/profiles/035.jpg', bio:'Reliable hitting partner. Private, punctual, allergic to drama.', tags:['Reliable', 'Practice Sets', 'Private'], rating:'3.0', shield:false, target:false},
  {nick:'VesperCloud', age:52, photo:'assets/profiles/036.jpg', bio:'Jazz records, precise opinions, surprisingly sharp volleys.', tags:['Volley', 'Veteran', 'Doubles'], rating:'3.5', shield:true, target:false},
  {nick:'BrightKernel', age:34, photo:'assets/profiles/037.jpg', bio:'Dry humor, black tea, and a serve that disappears wide.', tags:['Serve Wide', 'Singles', 'Competitive'], rating:'4.0', shield:false, target:false},
  {nick:'CopperOwl', age:43, photo:'assets/profiles/038.jpg', bio:'Night reader. Day strategist. Baseline grinder.', tags:['Baseline', 'Strategy', 'Endurance'], rating:'3.5', shield:false, target:false},
  {nick:'RookPilot', age:39, photo:'assets/profiles/039.jpg', bio:'Complicated coffee orders, simple tennis: serve and attack.', tags:['Serve & Attack', 'Coffee', 'Singles'], rating:'3.5', shield:true, target:false},
  {nick:'GreyOrbit', age:49, photo:'assets/profiles/040.jpg', bio:'Calm evenings, sharp focus, no wasted points.', tags:['Control', 'Evening Match', 'Hard Court'], rating:'3.0', shield:false, target:false},

  {nick:'IronServe92', age:36, photo:'assets/profiles/nathan.png', bio:'Aggressive forehand, unreliable schedule, prefers evening courts.', tags:['Forehand', 'Lake Pavilion', 'Evening Match', 'Singles'], rating:'3.5', shield:false, target:false}
];

let index = 0;
const el = id => document.getElementById(id);

function currentProfile(){
  return profiles[index % profiles.length];
}

function resetMessagePanel(){
  el('messagePanel').classList.add('hidden');
  el('messageArea').classList.add('hidden');
  el('askPassBtn').classList.add('hidden');
  el('typingIndicator').classList.add('hidden');
  el('replyBox').classList.add('hidden');
  el('replyBox').innerHTML = '';
}

function render(){
  const p = currentProfile();
  el('profilePhoto').src = p.photo;
  el('nickname').textContent = p.nick;
  el('meta').textContent = `${p.age} · Veyra District`;
  el('bio').textContent = p.bio;
  el('rating').textContent = `${p.rating} rating`;
  el('shieldBadge').classList.toggle('hidden', !p.shield);
  el('tags').innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  resetMessagePanel();
}

function next(){
  index = (index + 1) % profiles.length;
  render();
}

function previous(){
  index = (index - 1 + profiles.length) % profiles.length;
  render();
}

function approveConnection(){
  const p = currentProfile();
  if (
    p.target &&
    typeof setProgress === "function"
) {
    setProgress("sofia_profile_found");
}
  el('messagePanel').classList.remove('hidden');
  el('messageArea').classList.add('hidden');
  el('askPassBtn').classList.add('hidden');
  el('typingIndicator').classList.add('hidden');
  el('replyBox').classList.add('hidden');
  el('replyBox').innerHTML = '';
  el('connectionText').textContent = `${p.nick} has been added to your approved players.`;
}

function sendMessage(){
  const p = currentProfile();
  if (
    p.target &&
    typeof setProgress === "function"
) {
    setProgress("sofia_contact_attempted");
}
  el('messageArea').classList.remove('hidden');
  el('typingIndicator').classList.add('hidden');
  el('replyBox').classList.add('hidden');
  el('replyBox').innerHTML = '';

  if(p.target){
    el('askPassBtn').classList.remove('hidden');
  } else {
    el('askPassBtn').classList.add('hidden');
    el('replyBox').classList.remove('hidden');
    el('replyBox').textContent = 'Message request sent. No reply yet.';
  }
}

function askAboutBlackPass(){
  if (typeof setProgress === "function") {
    setProgress("sofia_match_question_sent");
}
  el('askPassBtn').classList.add('hidden');
  el('typingIndicator').classList.remove('hidden');
  el('replyBox').classList.add('hidden');

  setTimeout(() => {
    if (typeof setProgress === "function") {
  setProgress("sofia_badge_confirmed");
  setProgress("sm4418_linked_to_sofia");
  setProgress("sofia_contact_unlocked");  
}
    el('typingIndicator').classList.add('hidden');
    el('replyBox').classList.remove('hidden');
    el('replyBox').innerHTML = `
  <b>You:</b><br>
  Hi, I think I have your black pass. Is the number SM-4418?<br><br>

  <b>MoonRelay:</b><br>
  Yes! Where did you find it? Can I have it back?<br><br>

  <b>You:</b><br>
  Of course. I just need to know your full name first.<br><br>

  <b>MoonRelay:</b><br>
  My name is Sofia Mirel. I think that guy, IronServe92, took it from my tennis bag. <br><br>

  <b>You:</b><br>
  Thanks. I'll message you to arrange the handover.
`;
  }, 12000);
}

el('skipBtn').addEventListener('click', next);
el('prevBtn').addEventListener('click', previous);
el('connectBtn').addEventListener('click', approveConnection);
el('sendMessageBtn').addEventListener('click', sendMessage);
el('askPassBtn').addEventListener('click', askAboutBlackPass);

if (typeof setProgress === "function") {
    setProgress("matchpoint_opened");
    setProgress("ironserve92_identified");
}

render();
