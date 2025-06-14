import "fake-indexeddb/auto";
import { openDB } from "idb";

(async () => {
  // Open (or create) the database
  const db = await openDB("test", 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("books")) {
        const store = db.createObjectStore("books", { keyPath: "isbn" });
        store.createIndex("by_title", "title", { unique: true });
        store.put({ title: "Quarry Memories", author: "Fred", isbn: 123456 });
        store.put({ title: "Water Buffaloes", author: "Fred", isbn: 234567 });
        store.put({ title: "Bedrock Nights", author: "Barney", isbn: 345678 });
      }
    }
  });

  // Operation 1: Get a record by index
  const book = await db.getFromIndex("books", "by_title", "Quarry Memories");
  console.log("From index:", book);

  // Operation 2: Iterate over the records using a cursor
  const tx = db.transaction("books", "readonly");
  const store = tx.objectStore("books");
  let cursor = await store.openCursor(IDBKeyRange.lowerBound(200000));
  while (cursor) {
    console.log("From cursor:", cursor.value);
    cursor = await cursor.continue();
  }

  // Operation 3: Add a new record
  await db.put("books", { title: "Stone Age Tales", author: "Wilma", isbn: 456789 });
  console.log("New book added!");

  console.log("All done!");
})();

