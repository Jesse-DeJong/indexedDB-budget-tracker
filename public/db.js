// OPEN an indexedDB request
let request = indexedDB.open("budget", 1),
    db,
    tx,
    store;

// Establish request outcomes
request.onupgradeneeded = function (event) {
    db = request.result;
    store = db.createObjectStore("pending", { autoIncrement: true });
};

request.onerror = (error) => {
    console.error(error);
};

request.onsuccess = (event) => {
    db = request.result;
    tx = db.transaction("pending", "readwrite");
    store = tx.objectStore("pending");

    if(navigator.onLine) {
        onlineUpdate();
    }
    // tx.oncomplete = () => {
    //     db.close();
    // }
};

// Offline saving of records
function saveRecord (transaction) {
    tx = db.transaction("pending", "readwrite");
    store = tx.objectStore("pending");
    store.add(transaction);
};

// Update database when back online
function onlineUpdate () {
    tx = db.transaction("pending", "readwrite");
    store = tx.objectStore("pending");
    retrieved = store.getAll();

    retrieved.onsuccess = () => {
        if(retrieved.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(retrieved.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(() => {
                tx = db.transaction("pending", "readwrite");
                store = tx.objectStore("pending");
                store.clear();
            });
        }
    };
};

// Eventlistener for network connectivity
window.addEventListener("online",checkDatabase);