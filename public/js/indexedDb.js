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

    fetch("/api/transaction")
        .then(response => {
            return response.json();
        })
        .then(data => {
            transactions = data;
            transactions.forEach(t=>{
                // let trans = db.transaction("DataStore", 'readwrite');
                // console.log("adding ")
                // const bs = trans.objectStore("DataStore");
                obj.add({
                    id:t._id,
                    name:t.name,
                    value:t.value
                })
            })
        });
    
    let t1 = store.getAll()
    t1.onsuccess = ()=>{
        console.log(t1.result.length)
    }
    

//   tx.oncomplete = ()=>{
//       db.close()
//   }
}
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
    //index = store.createIndex("transactionName","transactionName",{unique:false}) 
    

}
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions 
    console.log("no internet but stored for now")
    let trans = db.transaction(['expense'], 'readwrite');
  
    // access the object store 
    const bs = trans.objectStore('new data');
  
    // add record to your store with add method
    bs.add(record);
};


window.addEventListener('online', sendToServer);