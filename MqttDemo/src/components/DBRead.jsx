import { db, ref, get, onValue } from "./firebase"

// Fetch data once
const getUserData = async (userId) => {
  const snapshot = await get(ref(db, "users/" + userId))
  if (snapshot.exists()) {
    console.log(snapshot.val())
  } else {
    console.log("No data available")
  }
}

// Listen for real-time updates
const listenToMessages = (callback) => {
  const messagesRef = ref(db, "messages")
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val()
    callback(data)
  })
}

export { getUserData, listenToMessages }