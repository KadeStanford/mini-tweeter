# Mini‑Tweeter &nbsp;–&nbsp;

## ✅ / ⬜ Task Checklist (T1 – T8)

| ID       | Requirement                                                                                                               | Status                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **T1**   | System maintains **topics** (message threads).                                                                            | ⬜ _TODO_                                 |
| **T2.1** | On login, show the **two newest messages** in every subscribed topic.                                                     | ⬜ _TODO_                                 |
| **T2.2** | Login page also offers a **topic directory** (subscribe) and an **unsubscribe** button next to each current subscription. | ⬜ _TODO_                                 |
| **T3**   | User can **create a new topic** (auto‑subscribed).                                                                        | ⬜ _TODO_                                 |
| **T4**   | User can **post a message** in any topic they’re subscribed to.                                                           | ⬜ _TODO_                                 |
| **T5**   | Follows the **MVC pattern**.                                                                                              | ✅ _Done_ (`models/ views/ controllers/`) |
| **T6**   | Implements the **Observer pattern** (e.g., event bus for new messages, stats, notifications).                             | ⬜ _TODO_                                 |
| **T7**   | Uses the **Singleton pattern** for DB access.                                                                             | ✅ _Done_ (`src/config/db.js`)            |
| **T8**   | Tracks & reports **topic access statistics**.                                                                             | ⬜ _TODO_                                 |

---

## 🗂️ Where to Finish Each Task

| Task ID(s)     | Key files / folders to edit                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| **T1, T3**     | `src/models/topic.js` · `src/controllers/topicController.js` · `src/routes/topic.js`                 |
| **T2.1, T2.2** | `src/controllers/dashboardController.js` _(create)_ · `src/views/dashboard.ejs`                      |
| **T4**         | `src/models/message.js` · `src/controllers/messageController.js` · `src/routes/message.js`           |
| **T6**         | `src/observers/eventBus.js` · add subscriber modules (`notifySubscribers.js`, `topicStats.js`, etc.) |
| **T8**         | `src/models/stats.js` (optional) · observer that increments stats · expose an endpoint / view        |

_(T5 & T7 are fully implemented; no work required.)_

---

## ▶️ Run Locally

```bash
# 1 – install dependencies
npm install

# 2 – start the dev server
node src/app.js
```

- App opens on **http://localhost:3000**
- Sign‑up page: **/signup**  
  Log‑in page: **/login**

> **Prerequisites:**
>
> - Node.js ≥ 18
> - Internet connection (to reach the MongoDB Atlas cluster configured in `src/config/db.js`)
