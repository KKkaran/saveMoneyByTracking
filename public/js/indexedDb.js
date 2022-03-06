console.log("in indexed db file")
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

if(!window.indexedDB){
    alert("no indexed DB")
}else{
    //alert("indexeddb working")
}
let request = window.indexedDB.open("Budget Tracker Application2", 2 ), //1 is the verison number
    db,tx,store,index

request.onerror = (e)=>{
    console.log(`The error is: ${e.target.errorCode}`)
}

const sendToServer = ()=>{
    //when we get back online send the transaction to server
    console.log("in send to server method")
    let trans = db.transaction("DataStore","readwrite")
    let obj = trans.objectStore("DataStore")

    let getAllTrans = obj.getAll()

    getAllTrans.onsuccess = ()=>{
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getAllTrans.result),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })
            .then(response => response.json())
            .then(serverResponse => {
              if (serverResponse.message) {
                throw new Error(serverResponse);
              }
              const transaction = db.transaction(['DataStore'], 'readwrite');
              const bos = transaction.objectStore('DataStore');
              bos.clear();
            })
            .catch(err => {
              console.log(err);
            });
        }
}
//   tx.oncomplete = ()=>{
//       db.close()
//   }

request.onsuccess = (e)=>{
    db = request.result
    tx = db.transaction("DataStore","readwrite")
    store = tx.objectStore("DataStore")
    //index = store.index("transactionName")

    db.onerror = (e)=>{
        console.log(`ERROR: ${e.target.errorCode}`)
    }

    if(navigator.onLine){
        sendToServer();
    }
    //fetch the data and store in the db
    
}
request.onupgradeneeded = (e)=>{
    //the store defines the structure for the data
    let db = request.result,
    store = db.createObjectStore("DataStore",
        { autoIncrement: true }
    )
}
function saveRecord(record) {
    
    console.log("no internet but stored for now")
    let trans = db.transaction("DataStore", 'readwrite');
  
    const bs = trans.objectStore('DataStore');
    bs.add(record);
};

//show the site offline as it was online
//so we will get all the values and then



window.addEventListener('online', sendToServer);
