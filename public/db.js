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

    // tx.oncomplete = () => {
    //     db.close();
    // }
};

// Frontend Calls
function saveRecord (transaction) {
    tx = db.transaction("pending", "readwrite");
    store = tx.objectStore("pending");
    store.add(transaction);
};