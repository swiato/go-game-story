# 🕹️ Go Game Story Prototype

This repository serves as a **narrative and gameplay prototype** for an upcoming **Go-based adventure game**. It focuses on blending **interactive storytelling**, **Go puzzle-solving**, and **simulated matches** into a coming-of-age experience for younger audiences.

> 🔗 Playable demo: [https://www.smilelessgames.com/](https://www.smilelessgames.com/)

---

## 📖 Story Overview

The story follows a **young boy** in a fictional country in **Central Europe**. Lost in fantasy worlds of RPGs, anime, and video games, he struggles with **social anxiety** and **low self-esteem**—with only one close friend for support.

At the start of a new school year, he hesitantly steps in to stop a bullying incident. Though socially awkward, his actions draw the attention of a mysterious new **Japanese teacher**, who introduces him to **Atari Go** (a simplified version of Go).

This unexpected encounter ignites a spark. Soon, he learns that a **national Go prodigy** is attending the same school. After a heated exchange, they make a **bet**:
➡️ **Meet in the finals of the national Go championship.**

Thus begins a journey of self-growth, rivalry, and discovery—told through the lens of learning and mastering the ancient game of Go.

---

## 🧾 Game Design Overview

### 🎯 Target Audience

* **Age Group**: Tweens / Young Teens (\~10–15)
* **Tone**: Inspirational, personal, and slightly introspective
* **Appeal**: Fans of strategy, anime-style narratives, slice-of-life drama, and puzzle solving

### 🎮 Genre

Sports (Go), Adventure, Puzzle, Slice of Life, Light RPG

### 🧠 Core Gameplay Loop

1. **Explore** school and town areas
2. **Talk to characters**, uncover story events
3. **Solve Go puzzles** to learn tactics
4. **Challenge NPCs** to Go matches
5. **Defeat local Go clubs** to qualify for nationals
6. **Compete in the championship tournament**

> Think Pokémon Red, but with Go clubs instead of gyms, and logical skill instead of level grinding.

### 🗺️ Structure & Progression

| Pokémon Element      | This Game Equivalent            |
| -------------------- | ------------------------------- |
| Gyms                 | Go Clubs                        |
| Badges               | Club Victories                  |
| Battles              | Go Matches (Atari Go → Full Go) |
| Pokémon Master Title | National Go Champion            |

---

## 📦 Project Components

### 📝 `twee/`

Interactive narrative written in [Twee](https://twinery.org/2/#!/guide/twee), used with **Twine** to create story scenes and dialogue flow.

### 🎯 Embedded Go Board (`jgoboard`)

Uses [**jgoboard**](https://github.com/jokkebk/jgoboard) to present:

* 🧩 **Go puzzles** integrated in the story
* 🎭 **Fake Go matches** to simulate gameplay mechanics

> Note: Full Go AI and real matches will be (hopefully) developed in the final game version.

---

## 🚀 Deployment & Automation

* Built using **Tweego**, which compiles the Twee story into a playable HTML experience.
* Automatically deployed to:
  🌐 [https://www.smilelessgames.com/](https://www.smilelessgames.com/)

---

## 🎮 Prototype Features

* 📚 Narrative-driven adventure about growth and competition
* 🧩 Go puzzles woven into character and story development
* 🎭 Simulated Go matches with story consequences
* 🌍 Early-world exploration through Twine passages
* 🔄 Continuous integration for fast feedback and testing