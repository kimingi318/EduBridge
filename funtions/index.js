// functions/index.js (Firebase Cloud Functions)

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.notifyStudentsOnStatusChange = functions.firestore
  .document("Class_Status/{sessionId}")
  .onWrite(async (change, context) => {
    const before = change.before.data() || {};
    const after = change.after.data() || {};
    if (before.status === after.status) return null; // no change

    const sessionId = context.params.sessionId;
    const payload = {
      notification: {
        title: "Class status updated",
        body: `Your class is now ${after.status}.`,
      },
      data: { sessionId },
    };

    // fetch tokens of students enrolled in this session
    const tokensSnap = await admin
      .firestore()
      .collection("sessionTokens")
      .doc(sessionId)
      .collection("students")
      .get();
    const tokens = tokensSnap.docs.map((d) => d.id);
    if (tokens.length > 0) {
      return admin.messaging().sendToDevice(tokens, payload);
    }
    return null;
  });

// scheduled job to remind lecturers 30 minutes before class starts
exports.remindLecturers = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    const now = Date.now();
    const cutoff = new Date(now + 30 * 60 * 1000);
    // assuming you have a collection for sessions with startTime stored as ISO string
    const snap = await admin
      .firestore()
      .collection("class_sessions")
      .where("startTime", "<=", cutoff.toISOString())
      .where("startTime", ">", new Date(now).toISOString())
      .get();
    const messages = [];
    snap.forEach((doc) => {
      const s = doc.data();
      if (s.lecturerToken) {
        messages.push({
          token: s.lecturerToken,
          notification: {
            title: "Update class status",
            body: `Your ${s.unitName || "class"} starts in 30 minutes.`,
          },
          data: { sessionId: doc.id },
        });
      }
    });
    if (messages.length) {
      await admin.messaging().sendAll(messages);
    }
    return null;
  });
