indexedDB.deleteDatabase("db2");
let db2 = new Localbase('db2')

//get all the trans and save it in the indexedDB
fetch("/api/transaction").then(d=>d.json()).then(data=>{
    transactions = data
    data.map(d=>{
        db2.collection("users").add(d);
    })
    
})
db2.collection('users').get().then(users => {
    console.log("***********************")
    //transactions = users;
    console.log(transactions)
  })


window.addEventListener("offline",()=>{
    console.log("internet went down")
    
    populateTotal();
    populateTable();
    populateChart();
})
window.addEventListener("online",()=>{
    console.log("internet came back on")
    //console.log(trans)
})