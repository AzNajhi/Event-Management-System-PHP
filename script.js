let nameList = [];
let unusedName = [];
let usedName = [];

function updateStaffInputs () {
    setTimeout(() => {
        document.querySelector(".process-button").disabled = true;
        document.querySelector(".process-button").removeAttribute("onclick");
        nameList = [];
        unusedName = [];
        usedName = [];

        let day = document.querySelector(".form-control[name='day']").value;
        let session = document.querySelector(".form-control[name='session']").value;
        let participant = document.querySelector(".form-control[name='participant']").value;
        let ratioStaff = document.querySelector(".form-control[name='ratio-staff']").value;
        let ratioParticipant = document.querySelector(".form-control[name='ratio-participant']").value;

        if (!day || !session || !participant || !ratioStaff || !ratioParticipant) {
            let message = `<span class="warning-message">Please ensure all inputs are filled out correctly!</span>`
            document.querySelector('.staff-input-label').innerHTML = message;
            document.querySelector('.staff-input').innerHTML = "";
            document.querySelector(".process-button").disabled = true;
            document.querySelector(".process-button").removeAttribute("onclick");
            return;
        }

        let staffPerSession = Math.ceil((ratioStaff / ratioParticipant) * participant);
        let totalStaff = staffPerSession * session * day;
        let message = `<span>Kindly assign staff to the event.</span>`
        document.querySelector('.staff-input-label').innerHTML = message;

        if (totalStaff == 0 || isNaN(totalStaff) || totalStaff == Infinity) {
            let message = `<span class="warning-message">Please ensure all inputs are filled out correctly!</span>`
            document.querySelector('.staff-input-label').innerHTML = message;
            document.querySelector('.staff-input').innerHTML = "";
        
        } else {
            let data = {
                'action' : 'update',
            };
            
            console.log("Test: ", data);
            fetch('http://localhost/event_management/update.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log("Test: ", data);
                nameList = data['nameList'];
                let message = `<span>Kindly assign staff to the event.</span>`;
                document.querySelector('.staff-input-label').innerHTML = message;
                let inputs = Array.from({length: totalStaff}, (_, index) => {
                    let options = `<option value=''>Select Staff ${index + 1}</option>`;
                    nameList.forEach((name) => {
                        options += `<option value="${name}">${name}</option>`;
                    });
                    return `<select class="form-control selectpicker staff-id" data-index="${index + 1}" onchange="checkStaffInputs(this, event)">${options}</select>`;
                }).join('');
                document.querySelector('.staff-input').innerHTML = inputs;
                unusedName = [...nameList]
            })
            .catch((error) => console.error('Error:', error));
        };
    }, 500);
}

function checkStaffInputs (input, event) {
    event.preventDefault();
    let inputIndex = input.getAttribute('data-index');
    let staffName = input.value;
    let found = false;

    if (usedName.length === 0) {
        usedName.push({index: inputIndex, name: staffName})
        unusedName = unusedName.filter(name => name !== staffName);

    } else if (staffName === "") {
        usedName = usedName.filter(item => {
            if (item.index === inputIndex) {
                unusedName.push(item.name);
                return false;
            }
            return true;
        });

    } else {
        usedName.forEach(input => {
            if (input.index === inputIndex) {
                found = true;
                if (input.name !== staffName) {
                    unusedName.push(input.name);
                    input.name = staffName;
                    unusedName = unusedName.filter(name => name !== staffName);
                }
            }
        });

        if (!found) {
            usedName.push({index: inputIndex, name: staffName})
            unusedName = unusedName.filter(name => name !== staffName);
        }
    }

    document.querySelectorAll(".staff-id").forEach((input, index) => {
        let options = [];
        let selectedStaff = "";
        usedName.forEach((staff) => {
            if (staff.index == index + 1) {
                options.push(staff.name);
                selectedStaff = staff.name;
            }
        })
        unusedName.forEach((name) => {options.push(name)});
        options.sort();

        const selectElement = input;
        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = `Select Staff ${index + 1}`;
        selectElement.appendChild(defaultOption);

        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });

        selectElement.value = selectedStaff;
    });

    let allFilled = true;
    document.querySelectorAll(".staff-id").forEach((input) => {
        if (input.value == "") {
            allFilled = false;
        }

        if (allFilled) {
            document.querySelector(".process-button").disabled = false;
            document.querySelector(".process-button").addEventListener("click", sendForm);

        } else {
            document.querySelector(".process-button").disabled = true;
            document.querySelector(".process-button").removeAttribute("onclick");

        }
    })
}

function sendForm(event) {
    event.preventDefault();
    
    let data = {
        'day' : document.querySelector(".form-control[name='day']").value,
        'session' : document.querySelector(".form-control[name='session']").value,
        'participant' : document.querySelector(".form-control[name='participant']").value,
        'ratioStaff' : document.querySelector(".form-control[name='ratio-staff']").value,
        'ratioParticipant' : document.querySelector(".form-control[name='ratio-participant']").value,
        'staffInputs' : Array.from(document.querySelectorAll(".staff-id"), input => input.value)
    };

    fetch('http://localhost/event_management/process.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector(".result-schedule").innerHTML = data["table"];
    })
    .catch((error) => console.error('Error:', error));
}

function navigateToDatabase () {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "http://localhost/event_management/staff.php";
    
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "grant-access";
    input.value = "true";

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

updateStaffInputs();