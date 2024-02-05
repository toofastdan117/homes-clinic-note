function startTimer() {
    window.myApp.sharedData.started_encounter = true;
    window.myApp.sharedData.encounter_start_time = Date.now()
}

function saveContent(ID, text) {
    if (window.myApp.sharedData.hasOwnProperty(ID)) {
        // Update the corresponding property
        window.myApp.sharedData[ID] = text;
    } else {
        // pass
    }
}

function logNote() {
    
    var current_selections = document.getElementById('encounter-input').querySelectorAll("textarea");
    if (current_selections && current_selections.length > 0) {
        for (var current_selection of current_selections) {
            // Get the value of the textarea
            var current_text = current_selection.value;
            var current_ID = current_selection.id;
            // Log the value to the console
            saveContent(current_ID, current_text);
        }
    } else {
        // Handle the case when there are no textareas
        // You can choose to do nothing or add specific handling
    }

}

function switchSection(selection) {

    // Save whatever is currently written
    
    logNote();

    var writing_area = document.getElementById('encounter-input');
    var help_col = document.getElementById('encounter-help-col')
    var rows = 27
    if (window.myApp.sharedData.started_encounter){
        help_col.innerHTML = switchHelpCol(selection)
        switch (selection) {
            case 'admin':
                writing_area.innerHTML = generateAdminPatientForm();
                break;
            case 'vitals':
                writing_area.innerHTML = generateVitalsForm();
                break;
            case 'hpi':
                let hpi_placeholder = 'Write History of Present Illness (HPI) here...'
                writing_area.innerHTML = `<textarea id="hpi" class="form-control" rows="${rows}" placeholder="${hpi_placeholder}">${window.myApp.sharedData.hpi}</textarea>`
                break;
            case 'pmhx':
                let pmhx_rows = 13
                let pmhx_placeholder = `Write Past Medical History (PMHx) here...\n\nCommon conditions at HOMES include:\n - hypertension\n - diabetes\n - hypercholesterolemia`;
                let pshx_placeholder = `Write Past Surgical History (PSHx) here...\n1. Procedure (Date)`;
                writing_area.innerHTML = 
                    `<textarea id="pmhx" class="form-control" rows="${pmhx_rows}" style="margin-bottom: 1%" placeholder="${pmhx_placeholder}">${window.myApp.sharedData.pmhx}</textarea>
                    <textarea id="pshx" class="form-control" rows="${rows-pmhx_rows}" style="margin-top: 1%"placeholder="${pshx_placeholder}">${window.myApp.sharedData.pshx}</textarea>`;
                break;
            case 'medications':
                let med_rows = 19
                let meds_comment = `Write medications here...\n\nRecommended Format:\n1. Medication 1 (Dose, Route) - taken for {condition}, [Does/Does not] need refill (last taken {time})\n2. Medication 2 (Dose, Route) - taken for {condition}, [Does/Does not] need refill (last taken {time})`
                let allergies_comment = `Write allergies here...\n\nPlease note what happens if exposed to allergen`
                writing_area.innerHTML = 
                `<textarea id="pastmeds" class="form-control" rows="${med_rows}" style="margin-bottom: 1%" placeholder="${meds_comment}">${window.myApp.sharedData.pastmeds}</textarea>
                <textarea id="allergies" class="form-control" rows="${rows-med_rows}" style="margin-top: 1%"placeholder="${allergies_comment}">${window.myApp.sharedData.allergies}</textarea>`;
                break;
            case 'obgyn':
                obgyn_placeholder = 'Write ObGyn Hx here...';
                writing_area.innerHTML = `<textarea id="${selection}" class="form-control" rows="${rows}" placeholder="${obgyn_placeholder}">${window.myApp.sharedData.obgynhx}</textarea>`
                break;
            case 'famhx':
                family_placeholder = 'Write Family Hx here...\nFamily Member (living/passed - age/age passed): disease'
                writing_area.innerHTML = `<textarea id="famhx" class="form-control" rows="${rows}" placeholder="${family_placeholder}">${window.myApp.sharedData.famhx}</textarea>`
                break;
            case 'sochx':
                social_placeholder = 'Write Social Hx here...'
                writing_area.innerHTML = `<textarea id="sochx" class="form-control" rows="${rows}" placeholder="${social_placeholder}">${window.myApp.sharedData.sochx}</textarea>`
                break;
            case 'physexam':
                break;
            case 'aandp':
                assessment_rows = 3
                assessment_placeholder = 'Write Overall Assessment here...';
                plan_placeholder = 'Write a Problem-based plan here.\nPlease include contingencies and patient disposition...';
                writing_area.innerHTML = 
                `<textarea id="pastmeds" class="form-control" rows="${assessment_rows}" style="margin-bottom: 1%" placeholder="${assessment_placeholder}">${window.myApp.sharedData.assessment}</textarea>
                <textarea id="allergies" class="form-control" rows="${rows-assessment_rows}" style="margin-top: 1%"placeholder="${plan_placeholder}">${window.myApp.sharedData.plan}</textarea>`;
                break;
            default:
                writing_area.innerHTML = '';
                break;
        }
    } else if (selection=='admin'){
        writing_area.innerHTML = generateAdminPatientForm();
    }
    else if (selection=='vitals'){
        writing_area.innerHTML = generateVitalsForm();
    }
    else {
        alert('Please start the encounter first.');
    }

}

function addBpReading() {
    // Add a new blood pressure reading input
    const bpReadingsDiv = document.getElementById('bp-readings');
    const newReadingInput = document.createElement('input');
    newReadingInput.type = 'text';
    newReadingInput.classList.add('form-control', 'bp-reading-input');
    newReadingInput.placeholder = 'Enter BP Reading';
    bpReadingsDiv.appendChild(newReadingInput);
  }

function calculateBMI(height, weight) {
    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
}

// Submit functions
function submitAdminForm() {

    if (!window.myApp.sharedData.admin.form_submitted){
        // Update sharedData
        window.myApp.sharedData.admin.ptName = document.getElementById('patientName').value;
        window.myApp.sharedData.admin.ptDOB = document.getElementById('dob').value;
        window.myApp.sharedData.admin.ptGender = document.getElementById('gender').value;
        window.myApp.sharedData.admin.date_of_service = document.getElementById('dos').value;
        window.myApp.sharedData.admin.care_team = document.getElementById('careTeam').value;
        window.myApp.sharedData.admin.form_submitted = true
    }
    else {
        if (document.getElementById('patientName').value){
            window.myApp.sharedData.admin.ptName = document.getElementById('patientName').value;
        }
        if (document.getElementById('dob').value){
            window.myApp.sharedData.admin.ptDOB = document.getElementById('dob').value;
        }
        if (document.getElementById('gender').value){
            window.myApp.sharedData.admin.ptGender = document.getElementById('gender').value;
        }
        if (document.getElementById('dos').value){
            window.myApp.sharedData.admin.date_of_service = document.getElementById('dos').value;
        }
        if (document.getElementById('careTeam').value){
            window.myApp.sharedData.admin.care_team = document.getElementById('careTeam').value;
        }
    }

    // Your additional form submission logic here
    writing_area = document.getElementById('encounter-input')
    writing_area.innerHTML = `${writing_area.innerHTML} <p style="text-align: left; margin-top: 0.5em">Form Submitted!</p>`
    // For example, you can log the updated sharedData to the console
    //console.log(window.myApp.sharedData);
}

function submitVitalsForm() {
    // Update sharedData with vital signs
    const bpReadings = Array.from(document.querySelectorAll('.bp-reading-input')).map(input => input.value);
    window.myApp.sharedData.vitals.bp = bpReadings;
    window.myApp.sharedData.vitals.hr = document.getElementById('hr').value;
    window.myApp.sharedData.vitals.height = document.getElementById('height').value;
    window.myApp.sharedData.vitals.weight = document.getElementById('weight').value;
    // Calculate BMI (assuming height is in cm and weight is in kg)
    window.myApp.sharedData.vitals.bmi = calculateBMI(window.myApp.sharedData.vitals.height, window.myApp.sharedData.vitals.weight);
  
    // Display submitted blood pressure readings
    const submittedBpList = document.getElementById('submitted-bp-list');
    submittedBpList.innerHTML = '';
    bpReadings.forEach(reading => {
      const listItem = document.createElement('li');
      listItem.textContent = reading;
      submittedBpList.appendChild(listItem);
    });
  
    // Inform the user that the form is submitted
    const writing_area = document.getElementById('encounter-input');
    writing_area.innerHTML += `<p style="text-align: left; margin-top: 0.5em">Vitals Submitted!</p>`;
}

// Generate functions
function switchHelpCol(selection) {

    switch(selection) {
        case 'hpi': 
            return generateHPIInfoBox();
        case 'pmhx':
            return '';
        case 'obgyn':
            return generateOBGynInfoBox();
        default:
            return '';
    }

}

function generateAdminPatientForm() {
    return `
        <!-- Form for administrative patient data -->
        <form onsubmit="return false;" id="admin-patient-form" class="needs-validation" novalidate style="text-align: left">
            <h3>Patient Information</h3>
            <div class="form-group">
                <label for="patientName">Patient Name</label>
                <input type="text" class="form-control" id="patientName" placeholder="${window.myApp.sharedData.admin.ptName}" required>
                <div class="invalid-feedback">
                    Please enter the patient's name.
                </div>
            </div>
            <div class="form-group">
                <label for="dob">Date of Birth is <strong>${window.myApp.sharedData.admin.ptDOB}</strong></label>
                <input type="date" class="form-control" id="dob" required>
                <div class="invalid-feedback">
                    Please enter the patient's date of birth.
                </div>
            </div>
            <div class="form-group">
                <label for="gender">Gender</label>
                <select class="form-control" id="gender" required>
                    <option value="" selected disabled>${window.myApp.sharedData.admin.ptGender}</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <div class="invalid-feedback">
                    Please select the patient's gender.
                </div>
            </div>
            <div class="form-group">
                <label for="dos">Date of Service is <strong>${window.myApp.sharedData.admin.date_of_service}</strong></label>
                <input type="date" class="form-control" id="dos" required>
                <div class="invalid-feedback">
                    Please enter the date of service.
                </div>
            </div>
            <div class="form-group">
                <label for="careTeam">Care Team</label>
                <textarea id="careTeam" class="form-control" placeholder="${window.myApp.sharedData.admin.care_team}" id="floatingTextarea"></textarea>
                <div class="invalid-feedback">
                    Please enter the names of the care team.
                </div>
            </div>
            <button style="margin-top:1em" onclick="submitAdminForm()" id="formsubmitBtn" class="btn btn-dark">Submit</button>
        </form>
    `;
}

function generateVitalsForm() {
    return `
      <!-- Vitals Form -->
      <form onsubmit="return false;" id="vitals-form" class="needs-validation" novalidate style="text-align: left">
        <h3>Vitals</h3>
        <div class="form-group">
          <label for="bp">Blood Pressure</label>
          <div class="bp-input-section">
            <div id="bp-readings"></div>
            <input type="text" class="form-control bp-reading-input" placeholder="Enter BP Reading">
            <button type="button" onclick="addBpReading()" class="btn btn-secondary" style="margin-top: 0.5em">Add Reading</button>
          </div>
        </div>
        <div class="form-group">
          <label for="hr">Heart Rate</label>
          <input type="number" class="form-control" id="hr" placeholder="${window.myApp.sharedData.vitals.hr}" required>
          <div class="invalid-feedback">
            Please enter the heart rate.
          </div>
        </div>
        <div class="form-group">
          <label for="height">Height (cm)</label>
          <input type="number" class="form-control" id="height" placeholder="${window.myApp.sharedData.vitals.height}" required>
          <div class="invalid-feedback">
            Please enter the height.
          </div>
        </div>
        <div class="form-group">
          <label for="weight">Weight (kg)</label>
          <input type="number" class="form-control" id="weight" placeholder="${window.myApp.sharedData.vitals.weight}" required>
          <div class="invalid-feedback">
            Please enter the weight.
          </div>
        </div>
        <!-- Display submitted blood pressure readings -->
        <div id="submitted-bp">
          <label>Submitted Blood Pressure Readings:</label>
          <ul id="submitted-bp-list"></ul>
        </div>
        <!-- Add other vital signs as needed -->
        <button style="margin-top:1em" onclick="submitVitalsForm()" class="btn btn-dark">Submit</button>
      </form>
    `;
  }

function generateHPIInfoBox() {
    return `
        <!-- HPI Information Box -->
        <div id="hpi-info-box" style="text-align: left; border: 2px solid #d3d3d3; border-radius: 10px; padding: 4px; background-color: #f5f5f5; height: 95%; overflow-y: auto;">
            <h3 style="color: #333; font-size: 18px;">HPI Guide</h3>
            <p style="font-size: 14px;">
                To gather a comprehensive HPI, consider the following:
            </p>
            <ul style="font-size: 14px;">
                <li>Chronology/Timing - provide a precise sequence of events.</li>
                <li>If dealing with a chronic issue, <strong>what is different now?</strong></li>
                <li>If multiple complaints, address each sequentially</li>
                <li>Analyze symptoms (remember LOCATES).</li>
            </ul>
            <p><strong>LOCATES:</strong></p>
            <ul style="font-size: 14px;">
                <li><strong>Location:</strong></li>
                <li><strong>Onset:</strong></li>
                <li><strong>Characteristic:</strong></li>
                <li><strong>Aggravating/Alleviating</strong></li>
                <li><strong>Timing/Triggers</strong></li>
                <li><strong>Environment/Emotion</strong></li>
                <li><strong>Severity</strong></li>
            </ul>
        </div>
    `;
}

function generateOBGynInfoBox() {
    return `
        <!-- OBGyn Information Box -->
        <div id="obgyn-info-box" style="text-align: left; border: 2px solid #d3d3d3; border-radius: 10px; padding: 4px; background-color: #f5f5f5; height: 95%; overflow-y: auto;">
            <h3 style="color: #333; font-size: 18px;">OBGyn History Guide</h3>
            <p style="font-size: 14px;">
                To gather a comprehensive OBGyn history, consider the following:
            </p>
            <ul style="font-size: 14px;">
                <li><strong>Menstrual History</strong> - age at menarche/menopause, regularity, duration, flow, any changes.</li>
                <li><strong>Obstetric History</strong> - gravida (total pregnancies), para (pregnancies carried to viable gestational age), abortions/miscarriages.</li>
                <li><strong>Gynecologic Surgeries</strong> - any surgeries related to the reproductive system.</li>
                <li><strong>Contraceptive History</strong> - types used, side effects, satisfaction.</li>
            </ul>
        </div>
    `;
}
