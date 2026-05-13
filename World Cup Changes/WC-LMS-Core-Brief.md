# World Cup Last Man Standing — Core Brief

## What This Game Is

This is a survival prediction game running alongside the 2026 FIFA World Cup. 
Players are trying to stay alive as long as possible by correctly predicting 
match winners. Get it wrong and you lose a life. Lose all your lives and you 
are out. Last player alive wins.

---

## The One Rule That Drives Everything

**Pick a team to win. If they don't win — draw or loss — you lose a life.**

That is the entire game. Everything else is built around that one rule.

---

## Lives

- Every player starts with 3 lives (admin can change this before the tournament starts)
- Losing a life does NOT eliminate you — you carry on
- Losing your LAST life eliminates you
- Lives are shown as hearts on the dashboard ❤️❤️❤️
- If multiple players are still alive at the end, most lives remaining wins

---

## The No-Repeat Rule

Once you pick a team, that team is gone for you forever.
You cannot pick them again in any future round.
This is per player — other players can still pick that team.

This rule gets brutal late in the tournament when all the safe teams are used up.

---

## How Many Picks Per Round

**Group stage (Rounds 1, 2, 3): 3 picks each round**
- Players must pick 3 different teams per round
- Each pick is independent — you can win some and lose some in the same round
- Example: player picks France, Brazil, England. France wins, Brazil draws, England wins.
  Result: lose 1 life (Brazil draw = loss)

**Knockouts (Rounds 4-8): 1 pick per round**
- Back to single pick per round
- Higher stakes, fewer games, every pick matters more

---

## What Happens Each Round — Step by Step

1. Admin opens the round
2. Players log in and see all available teams for that round
3. Teams they have already used in previous rounds are greyed out — they cannot pick them
4. Players submit their picks (3 for group stage, 1 for knockouts)
5. Admin closes the round at the deadline (before first match kicks off)
6. Matches are played
7. Admin enters results
8. System automatically works out who won and who lost
9. For every pick that drew or lost — that player loses 1 life
10. Any player who hits 0 lives is eliminated
11. Admin opens next round — repeat

---

## What Players See

- Their lives remaining shown as hearts
- Which teams they have already used (greyed out, unselectable)
- How many picks they have submitted this round vs how many they need to submit
- Their current picks and their results once matches finish
- The leaderboard showing all players, their lives, and who has been eliminated

---

## What Admin Does

- Creates the tournament and sets the number of lives (default 3)
- Opens and closes each round
- Enters match results one by one as games finish
- The system handles all the life deduction and elimination automatically

---

## The Life Setting

- Admin sets lives ONCE when creating the tournament
- Default is 3
- Can be set anywhere from 1 to 10
- Once the tournament goes live this cannot be changed
- All players get the same number of lives

---

## Why Lives Instead of Instant Elimination

The original setup was one life — get it wrong once and you are out.
That is too harsh for a 39 day tournament with 8 rounds.

With 3 lives and 3 picks per group stage round, players can survive 
a couple of bad picks without being immediately knocked out. 
The tension builds across the tournament rather than half the players 
being gone by matchday 2.

---

## Tournament Timeline

| Round | What It Is | Picks Needed |
|---|---|---|
| Round 1 | Group Matchday 1 — June 11-17 | 3 |
| Round 2 | Group Matchday 2 — June 18-24 | 3 |
| Round 3 | Group Matchday 3 — June 24-27 | 3 |
| Round 4 | Round of 32 — June 28-July 3 | 1 |
| Round 5 | Round of 16 — July 4-7 | 1 |
| Round 6 | Quarter Finals — July 9-12 | 1 |
| Round 7 | Semi Finals — July 14-15 | 1 |
| Round 8 | Final — July 19 | 1 |

---

## Example Player Journey

Round 1: Player picks France (win), Germany (win), Brazil (draw)
Result: Loses 1 life. Now on 2 lives. ❤️❤️🖤

Round 2: Player picks Spain (win), England (win), Argentina (win)
Result: Loses 0 lives. Still on 2 lives. ❤️❤️🖤

Round 3: Player picks Netherlands (loss), Portugal (win), Belgium (draw)
Result: Loses 2 lives. Now on 0 lives. Eliminated.

Meanwhile another player who was more careful still has 2 lives going into the knockouts.
That player has a huge advantage because lives are the tiebreaker at the end.

---

## The Key Things The Code Must Get Right

1. **A draw = a loss** — any result that is not a win costs a life
2. **Lives decrement, not instant elimination** — player loses a life, 
   only eliminated when lives hit zero
3. **No team reuse** — block a player picking a team they have used in any previous round
4. **picks_required per round** — 3 for group rounds, 1 for knockouts — 
   player cannot submit more than the limit, and should be prompted if they have not reached it
5. **Lives as tiebreaker** — leaderboard sorts active players by lives remaining descending
6. **Admin lives setting** — stored on the tournament record, 
   copied to each player's entry when they join, locked once tournament is live
