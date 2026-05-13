# World Cup LMS — Full Development Brief

## What We're Building
A Last Man Standing tournament for the 2026 FIFA World Cup. 30 players, each starting with 3 lives. Players pick teams to win each round. Wrong picks cost a life. No lives left means elimination. Last player standing wins.

---

## Rule Set
- Each player starts with **3 lives** (configurable by admin before tournament starts)
- **Group stage**: players pick **3 teams per round** (3 rounds = 9 picks total)
- **Knockouts**: players pick **1 team per round**
- A draw counts as a **loss** (costs a life)
- Players **cannot reuse a team** they've picked in any previous round
- Last player standing wins
- If multiple players survive to the end, **most lives remaining wins**

---

## Round Structure

| Round | Stage | Dates | Picks Required |
|---|---|---|---|
| Round 1 | Group Stage Matchday 1 | June 11-17 | 3 picks |
| Round 2 | Group Stage Matchday 2 | June 18-24 | 3 picks |
| Round 3 | Group Stage Matchday 3 | June 24-27 | 3 picks |
| Round 4 | Round of 32 | June 28 - July 3 | 1 pick |
| Round 5 | Round of 16 | July 4-7 | 1 pick |
| Round 6 | Quarter Finals | July 9-12 | 1 pick |
| Round 7 | Semi Finals | July 14-15 | 1 pick |
| Round 8 | Final | July 19 | 1 pick |

---

## Group Stage Fixtures (for reference)

### Round 1 — June 11–17 (Matchday 1)
Mexico vs South Africa · South Korea vs Czechia · Canada vs Bosnia & Herzegovina · USA vs Paraguay · Qatar vs Switzerland · Brazil vs Morocco · Haiti vs Scotland · Australia vs Türkiye · Germany vs Curaçao · Ivory Coast vs Ecuador · Netherlands vs Japan · Sweden vs Tunisia · Spain vs Cape Verde · Belgium vs Egypt · Saudi Arabia vs Uruguay · Iran vs New Zealand · France vs Senegal · Iraq vs Norway · Argentina vs Algeria · Austria vs Jordan · Portugal vs DR Congo · England vs Croatia · Ghana vs Panama · Uzbekistan vs Colombia

### Round 2 — June 18–24 (Matchday 2)
Czechia vs South Africa · Mexico vs South Korea · Switzerland vs Bosnia & Herzegovina · Canada vs Qatar · Scotland vs Morocco · Brazil vs Haiti · Türkiye vs Paraguay · USA vs Australia · Germany vs Ivory Coast · Ecuador vs Curaçao · Netherlands vs Sweden · Tunisia vs Japan · Spain vs Saudi Arabia · Belgium vs Iran · Uruguay vs Cape Verde · New Zealand vs Egypt · France vs Iraq · Norway vs Senegal · Argentina vs Austria · Jordan vs Algeria · Portugal vs Uzbekistan · Colombia vs DR Congo · England vs Ghana · Panama vs Croatia

### Round 3 — June 24–27 (Matchday 3)
South Africa vs South Korea · Czechia vs Mexico · Bosnia & Herzegovina vs Qatar · Switzerland vs Canada · Morocco vs Haiti · Scotland vs Brazil · Türkiye vs USA · Paraguay vs Australia · Curaçao vs Ivory Coast · Ecuador vs Germany · Japan vs Sweden · Tunisia vs Netherlands · Egypt vs Iran · Belgium vs New Zealand · Cape Verde vs Saudi Arabia · Uruguay vs Spain · Senegal vs Iraq · France vs Norway · Algeria vs Austria · Jordan vs Argentina · DR Congo vs Uzbekistan · Colombia vs Portugal · Croatia vs Ghana · Panama vs England

---

## User Workflow

1. Player registers and joins the tournament
2. Assigned lives on joining (taken from tournament settings)
3. Round opens — player logs in and sees available teams for that round
4. Teams already used in previous rounds are greyed out and unselectable
5. Group stage: player must submit 3 picks before the round deadline
6. Knockouts: player must submit 1 pick before the round deadline
7. Results come in — each losing or drawing pick costs 1 life
8. Dashboard updates showing lives remaining as hearts
9. If lives hit 0 — player is eliminated and shown their final position
10. Repeat each round until one player remains

---

## Admin Workflow

1. Create tournament — set name, entry fee, prize pool, lives (default 3)
2. Lives setting is locked once tournament status goes live
3. Open each round — players can now submit picks
4. Set round deadline (before first match of that round kicks off)
5. Close round at deadline — no more picks accepted
6. Enter match results one by one as games finish
7. System auto-deducts lives and eliminates players on 0 lives
8. Check leaderboard looks correct
9. Open next round
10. Repeat until tournament complete

---

## Database Changes

Run these in Supabase SQL Editor against the existing schema:

```sql
-- Add lives setting to tournaments
ALTER TABLE tournaments ADD COLUMN lives INTEGER DEFAULT 3;

-- Add lives tracking to tournament entries
ALTER TABLE tournament_entries 
  ADD COLUMN lives_remaining INTEGER DEFAULT 3,
  ADD COLUMN max_lives INTEGER DEFAULT 3;

-- Add picks required per round
ALTER TABLE rounds ADD COLUMN picks_required INTEGER DEFAULT 1;
```

---

## Code Changes

### 1. `api/tournaments.js`
When creating a tournament, accept and save the lives field:

```js
const { name, entry_fee, prize_pool, max_players, lives = 3 } = req.body;

const { data, error } = await supabase
  .from('tournaments')
  .insert({ name, entry_fee, prize_pool, max_players, lives })
  .select();
```

---

### 2. `api/entries.js`
When a player joins, read the tournament lives setting and assign to the entry:

```js
// Get tournament lives setting
const { data: tournament } = await supabase
  .from('tournaments')
  .select('lives')
  .eq('id', tournament_id)
  .single();

const lives = tournament?.lives || 3;

// Insert entry with lives assigned
const { data, error } = await supabase
  .from('tournament_entries')
  .insert({
    tournament_id,
    user_id: user.id,
    status: 'active',
    lives_remaining: lives,
    max_lives: lives
  })
  .select();
```

---

### 3. `api/rounds.js`
When creating rounds, save picks_required per round:

```js
const { name, round_number, opens_at, closes_at, picks_required = 1 } = req.body;

const { data, error } = await supabase
  .from('rounds')
  .insert({ name, round_number, opens_at, closes_at, picks_required })
  .select();
```

---

### 4. `api/picks.js`
Add validation so players cannot exceed picks_required for a round, and cannot reuse a team from any previous round:

```js
// POST - Submit pick
if (req.method === 'POST') {
  const { team_id, round_id, tournament_id } = req.body;

  // Get picks_required for this round
  const { data: round } = await supabase
    .from('rounds')
    .select('picks_required')
    .eq('id', round_id)
    .single();

  // Count existing picks this round for this player
  const { data: existingRoundPicks } = await supabase
    .from('picks')
    .select('id')
    .eq('user_id', user.id)
    .eq('round_id', round_id)
    .eq('tournament_id', tournament_id);

  if (existingRoundPicks.length >= round.picks_required) {
    return res.status(400).json({ 
      error: `You can only make ${round.picks_required} pick(s) this round` 
    });
  }

  // Check team has not been used in any previous round
  const { data: previousPicks } = await supabase
    .from('picks')
    .select('team_id')
    .eq('user_id', user.id)
    .eq('tournament_id', tournament_id)
    .neq('round_id', round_id);

  const usedTeamIds = previousPicks.map(p => p.team_id);

  if (usedTeamIds.includes(team_id)) {
    return res.status(400).json({ 
      error: 'You have already used this team in a previous round' 
    });
  }

  // Insert pick
  const { data, error } = await supabase
    .from('picks')
    .insert({
      user_id: user.id,
      team_id,
      round_id,
      tournament_id,
      result: 'pending'
    })
    .select();
}
```

---

### 5. `api/admin-results.js`
Replace the instant elimination logic with lives-based logic. Find the loop that sets `status: 'eliminated'` and replace entirely with:

```js
// Get all picks that just became losses in this round
const { data: losingPicks } = await supabase
  .from('picks')
  .select('user_id, rounds:round_id(round_number)')
  .eq('result', 'loss')
  .eq('round_id', match.round_id);

// Process each losing player — decrement life, eliminate if zero
for (const pick of losingPicks || []) {
  // Get current lives for this player in this tournament
  const { data: entry } = await supabase
    .from('tournament_entries')
    .select('lives_remaining')
    .eq('user_id', pick.user_id)
    .eq('tournament_id', match.tournament_id)
    .single();

  const newLives = Math.max(0, (entry.lives_remaining || 1) - 1);

  // Update lives, only eliminate if lives hit zero
  await supabase
    .from('tournament_entries')
    .update({
      lives_remaining: newLives,
      ...(newLives === 0 ? {
        status: 'eliminated',
        eliminated_round: pick.rounds?.round_number,
        eliminated_at: new Date().toISOString()
      } : {})
    })
    .eq('user_id', pick.user_id)
    .eq('tournament_id', match.tournament_id);
}
```

---

### 6. `api/leaderboard.js`
Add lives to the leaderboard response and sort active players by lives remaining as tiebreaker:

```js
// In the leaderboard map, add lives fields to each entry
return {
  position: null,
  username: entry.users?.username,
  display_name: entry.users?.display_name,
  status: entry.status,
  lives_remaining: entry.lives_remaining,
  max_lives: entry.max_lives,
  eliminated_round: entry.eliminated_round,
  current_pick: latestPick ? {
    team: latestPick.teams?.name,
    flag: latestPick.teams?.flag_url,
    result: latestPick.result
  } : null
};

// Update sort — active players sorted by lives remaining descending (tiebreaker)
const sortedLeaderboard = leaderboard?.sort((a, b) => {
  if (a.status === 'active' && b.status !== 'active') return -1;
  if (a.status !== 'active' && b.status === 'active') return 1;
  if (a.status === 'active' && b.status === 'active') {
    return (b.lives_remaining || 0) - (a.lives_remaining || 0);
  }
  return (b.eliminated_round || 0) - (a.eliminated_round || 0);
});
```

---

### 7. `frontend/admin.html`
Add lives input to the tournament creation form:

```html
<div class="form-group">
  <label for="tournament-lives">Lives Per Player</label>
  <input 
    type="number" 
    id="tournament-lives" 
    min="1" 
    max="10" 
    value="3"
    class="form-control"
  >
  <small>Cannot be changed once tournament is live</small>
</div>
```

---

### 8. `frontend/js/admin.js`
Include lives when submitting the tournament creation form, and lock the field once tournament is live:

```js
// Include lives in tournament creation
const lives = parseInt(document.getElementById('tournament-lives').value) || 3;

const response = await fetch('/api/tournaments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name,
    entry_fee,
    prize_pool,
    max_players,
    lives
  })
});

// Lock lives field if tournament is already live
if (tournament.status === 'live') {
  document.getElementById('tournament-lives').disabled = true;
}
```

---

### 9. `frontend/js/dashboard.js`
Show lives as hearts and show how many picks the player has submitted this round:

```js
function updateStatusCard(data) {
  const statusDiv = document.getElementById('player-status');

  if (data.status === 'eliminated') {
    statusDiv.innerHTML = `
      <div class="eliminated">
        <h3>Eliminated</h3>
        <p>You were eliminated in Round ${data.eliminated_round}</p>
      </div>
    `;
    return;
  }

  // Build hearts display
  const heartsDisplay = Array.from({ length: data.max_lives }, (_, i) =>
    `<span class="life-heart ${i < data.lives_remaining ? 'active' : 'lost'}">♥</span>`
  ).join('');

  statusDiv.innerHTML = `
    <div class="active">
      <h3>Still In It</h3>
      <div class="lives-display">${heartsDisplay}</div>
      <p>${data.lives_remaining} of ${data.max_lives} lives remaining</p>
      <p>Picks this round: ${data.picks_this_round} / ${data.picks_required}</p>
    </div>
  `;
}
```

---

### 10. `frontend/css/style.css`
Add styles for the life hearts display:

```css
.lives-display {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.life-heart {
  font-size: 28px;
  transition: color 0.3s;
}

.life-heart.active {
  color: #e63946;
}

.life-heart.lost {
  color: #333;
  opacity: 0.3;
}
```

---

## Summary of All Files Changed

| File | What Changed |
|---|---|
| `supabase-schema.sql` | Add lives to tournaments, lives_remaining + max_lives to tournament_entries, picks_required to rounds |
| `api/tournaments.js` | Accept and save lives setting on create |
| `api/entries.js` | Read tournament lives and assign to player on join |
| `api/rounds.js` | Accept and save picks_required per round |
| `api/picks.js` | Validate picks_required limit and no-repeat team rule |
| `api/admin-results.js` | Decrement lives on loss, only eliminate when lives hit 0 |
| `api/leaderboard.js` | Include lives in response, use lives as active player tiebreaker sort |
| `frontend/admin.html` | Add lives number input to tournament creation form |
| `frontend/js/admin.js` | Send lives on tournament create, lock field when tournament is live |
| `frontend/js/dashboard.js` | Display lives as hearts, show picks submitted vs picks required |
| `frontend/css/style.css` | Style the life hearts (active = red, lost = faded) |
