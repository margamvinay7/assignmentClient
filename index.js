document.addEventListener('DOMContentLoaded',function(){
    fetch('https://assignmentserver-gexz.onrender.com/getAll')
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
        loadHTMLTable(data['data'])})
    

});


document.querySelector('table tbody').addEventListener('click',function(event){
    if(event.target.className==="delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className=="edit-row-btn"){
        handleEditRow(event.target.dataset.id);
    }
})

const updateBtn=document.querySelector('#update-row-btn');
const searchBtn=document.querySelector('#search-btn');

searchBtn.addEventListener('click',function(){
    
    const searchValue=document.querySelector('#search-input').value;
    console.log(searchValue)
    fetch('https://assignmentserver-gexz.onrender.com/search/'+searchValue)
    .then(response=>response.json())
    .then(data=>loadHTMLTable(data['data']))
})

function deleteRowById(id){
    fetch('https://assignmentserver-gexz.onrender.com/delete/'+id,{
        method:'DELETE'
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.success){
            location.reload();
        }
    });
}


function handleEditRow(id){
    const updateSection=document.querySelector('#update-row');
    updateSection.hidden=false;
    document.querySelector('#update-name-input').dataset.id=id;
}

updateBtn.addEventListener('click',function(){
    const updateNameInput=document.querySelector('#update-name-input');

    console.log(updateNameInput);

    fetch('https://assignmentserver-gexz.onrender.com/update',{
        method:'PATCH',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            id:updateNameInput.dataset.id,
            name:updateNameInput.value
        })
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.success){
            location.reload();
        }
    })
})

const addBtn=document.querySelector('#add-name-btn');

addBtn.addEventListener('click',async function(e){
    e.preventDefault()
    console.log('add button clicked')
    const nameInput=document.querySelector('#name-input');
    const name=nameInput.value;
    console.log(name)
   
        nameInput.value="";
    
    

    await fetch('https://assignmentserver-gexz.onrender.com/insert',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({name:name})
    })
    .then(response=>response.json())
    .then(data=>insertRowIntoTable(data['data']));


    location.reload()
    
})

function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data?.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data?.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id, name, date}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}