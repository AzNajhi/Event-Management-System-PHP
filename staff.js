function editStaff (button) {
    let staffIndex = button.getAttribute('data-index');
    let parent = button.parentElement;
    let input = document.querySelector(`input[data-index='${staffIndex}']`);
    input.disabled = false;
    parent.innerHTML = `<button class="btn btn-secondary save-button" data-index="${staffIndex}" type="button" onclick="saveStaff(this)"><i class="fa-regular fa-floppy-disk"></i></button>`
}

function saveStaff (button) {
    let staffIndex = button.getAttribute('data-index');
    let staffID = document.querySelector(`input[data-index='${staffIndex}']`).getAttribute('data-id');
    let staffName = document.querySelector(`input[data-index='${staffIndex}']`).value;

    if (staffID != "" && staffName != "") {
        let data = {
            'action' : 'edit',
            'id' : staffID,
            'name' : staffName,
        };

        fetch('http://localhost/event_management/update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log("Retrieved: ", result);
            document.querySelector(`input[data-index='${staffIndex}']`).setAttribute('value', result['name']);
            alert("Staff info updated sucessfully!")
        })
        .catch((error) => console.error('Error:', error));
    
    } else if (staffID == "" && staffName != "" ){
        let data = {
            'action' : 'add',
            'name' : staffName
        };

        fetch('http://localhost/event_management/update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            document.querySelector(`input[data-index='${staffIndex}']`).setAttribute('data-id', result['id']);
            document.querySelector(`input[data-index='${staffIndex}']`).setAttribute('value', staffName);
            alert("Staff info added succesfully!");
        })
        .catch((error) => console.error('Error:', error));

    } else {
        alert("Please make sure to enter the staff name before you save!")
        return

    }
    let parent = button.parentElement;
    let input = document.querySelector(`input[data-index='${staffIndex}']`);
    input.disabled = true;
    parent.innerHTML = `
        <button class="btn btn-secondary edit-button" data-index="${staffIndex}" type="button" onclick="editStaff(this)"><i class="fa-regular fa-pen-to-square"></i></button>
        <button class="btn btn-danger delete-button" data-index="${staffIndex}" type="button" onclick="deleteStaff(this)"><i class="fas fa-trash"></i></button>
    `
}

function deleteStaff (button) {
    let staffIndex = button.getAttribute('data-index');
    let staffID = document.querySelector(`input[data-index='${staffIndex}']`).getAttribute('data-id');

    if (staffID != "") {
        let data = {
            'action' : 'delete',
            'id' : staffID
        };

        fetch('http://localhost/event_management/update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Retrieved: ", data);
        })
        .catch((error) => console.error('Error:', error));
    }
    
    let selectedRow = document.querySelector(`.app-form tr:nth-of-type(${staffIndex})`);
    selectedRow.remove();

    // Update list after removing an element
    document.querySelectorAll(".staff-input").forEach((input, index) => input.setAttribute('data-index', index + 1));
    document.querySelectorAll(".app-form tr").forEach((tr, index) => {
        let editButton = tr.querySelector('.edit-button');
        let deleteButton = tr.querySelector('.delete-button');
        let saveButton = tr.querySelector('.save-button');

        if (editButton) {editButton.setAttribute('data-index', index + 1)}
        if (deleteButton) {deleteButton.setAttribute('data-index', index + 1)}
        if (saveButton) {saveButton.setAttribute('data-index', index + 1)}
    });
}

function addStaff () {
    let listContainer = document.querySelector('.app-form table tbody');
    let listNumber = document.querySelectorAll('.app-form table tr').length;
    listContainer.innerHTML += `
    <tr>
        <td>
            <input class='form-control staff-input' type='text' value='' data-id='' data-index='${listNumber + 1}'>
        </td>
        <td>
            <div class='button-group'>
                <button class='btn btn-secondary save-button' data-index="${listNumber + 1}" type="button" onclick="saveStaff(this)"><i class="fa-regular fa-floppy-disk"></i></button>
            </div>
        </td>
    </tr>
    `;
}