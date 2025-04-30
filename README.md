# Mini-Tweeter – Class Project

## ✔️ Progress Checklist

| Task ID | Requirement | Status |
|---------|-------------|--------|
| **T1** | The system maintains **topics** (message threads). | ⬜ *TODO* |
| **T2.1** | After login, show **2 most‑recent messages per subscribed topic**. | ⬜ *TODO* |
| **T2.2** | After login, provide **topic directory** for new subscriptions **and** an **“unsubscribe”** button beside each current subscription. | ⬜ *TODO* |
| **T3** | A user can **start a new topic** (auto‑subscribed). | ⬜ *TODO* |
| **T4** | A user can **post a message** in a subscribed topic. | ⬜ *TODO* |
| **T5** | Code follows the **MVC pattern**. | ✅ *Implemented*<br>• Models: `src/models/`<br>• Views: `src/views/`<br>• Controllers: `src/controllers/` |
| **T6** | Implements the **Observer pattern**. | ⬜ *TODO* (event bus & subscribers) |
| **T7** | Uses the **Singleton pattern** for DB access. | ✅ *Implemented* in `src/config/db.js` |
| **T8** | Tracks & reports **topic access statistics**. | ⬜ *TODO* |

---

## 🛠️ Open Work Items & Where to Code Them

| Task | Files / Areas to Edit |
|------|-----------------------|
| **Topic schema & CRUD** (T1, T3) | `src/models/topic.js` · `src/controllers/topicController.js` · `src/routes/topic.js` |
| **Message schema & CRUD** (T4) | `src/models/message.js` · `src/controllers/messageController.js` · `src/routes/message.js` |
| **Dashboard logic & views** (T2.1, T2.2) | Create `src/controllers/dashboardController.js`, edit `src/views/dashboard.ejs` |
| **Observer pattern** (T6) | Create `src/observers/eventBus.js` and subscriber modules (`notifySubscribers.js`, `topicStats.js`, …) |
| **Topic statistics** (T8) | Increment `viewCount` in an observer; add stats endpoint/view |

---

## ▶️ Running Locally

```bash
# 1 – install dependencies
npm install

# 2 – start the server
node src/app.js
```

*Server runs on **http://localhost:3000***  
Sign‑up at **/signup**, Log‑in at **/login**

> **Prerequisites:** Node ≥ 18 and internet access to the MongoDB Atlas cluster.

