document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document.querySelector("#timeform").style.display = "none";
  document.getElementById("ktime").style.display = "none";
  // const form = document.querySelector("#formreserva");
  // form.document.getElementById("time").getElementById("ktime").style.display =
  //   "none";

  // (makesDropdown = document.getElementById("makesDropdown")),
  //   (modelsDropdown = document.getElementById("modelsDropdown")),
  //   makesDropdown.addEventListener("change", updateModelsDropdown);
  // modelsDropdown.addEventListener("change", updateMakesDropdown);
  // doctor = {
  //   Position: ["Kinesiologia", "Masajista", "Quiropraxia", "Otro"],
  //   Time: [
  //     "09:00 – 10:00",
  //     "10:00 – 11:00",
  //     "11:00 – 12:00",
  //     "13:00 – 14:00",
  //     "14:00 – 15:00",
  //     "15:00 – 16:00",
  //     "16:00 – 17:00",
  //     "17:00 – 18:00",
  //     "18:00 – 19:00",
  //   ],
  // };
  const user_id = JSON.parse(document.getElementById("user_id").textContent);

  // document
  //   .querySelector("#inicio")
  //   .addEventListener("click", () => load_inicio());
  // document
  //   .querySelector("#reservas")
  //   .addEventListener("click", () => load_reservas());
  // document
  //   .querySelector("#consultas")
  //   .addEventListener("click", () => load_consultas());
  // document
  //   .querySelector("#hclinica")
  //   .addEventListener("click", () => load_hclinica());

  load_inicio();
});
// function updateModelsDropdown(event) {
//   let // The "target" of the `change` event is the input that changed
//     thisMake = event.target.value,
//     // Gets the array of models from `cars` (If no make is selected, uses all models)
//     relevantModels = cars[thisMake] || getAllModels();
//   modelsDropdown.selectedIndex = 0; // Shows the first (blank) option

//   // The select element's children are the options
//   let optionElements = modelsDropdown.children;
//   for (let option of optionElements) {
//     // Uses CSS to hide (or unhide) HTML elements
//     option.classList.add("hidden");

//     // Keeps the blank option as well as the ones included in the array
//     if (relevantModels.includes(option.value) || option.value === "") {
//       option.classList.remove("hidden");
//     }
//   }
// }

// function updateMakesDropdown(event) {
//   let thisModel = event.target.value,
//     relevantMake = "",
//     // Gets an array of the "keys" for an object
//     allMakes = Object.keys(doctor);

//   // Loops through the keys and tests each corresponding value (ie, each array of models)
//   for (let make of allMakes) {
//     let models = doctor[make];

//     // Finds the key whose value includes the selected model
//     if (models.includes(thisModel)) {
//       // Saves the name of the key so we can select it in the makesDropdown
//       relevantMake = make;
//     }
//   }
//   let optionElements = makesDropdown.children;
//   for (let i = 0; i < optionElements.length; i++) {
//     // Finds the index of the matching value
//     if (relevantMake === optionElements[i].value) {
//       // Selects the option by its index
//       makesDropdown.selectedIndex = i;
//     }
//   }
// }

// // Defines a helper function
// function getAllModels() {
//   // Gets an array of the "keys" for an object

//   const makes = Object.keys(doctor);
//   const models = []; // Starts with an empty array to push models into
//   for (let make of makes) {
//     // `cars[make]` retrieves the value (array of models) for that key
//     // `...` spreads the array into individual values (models)
//     // `push` adds each model to the new `models` array
//     models.push(...doctor[make]);
//   }
//   return models;
// }
function dynamicdropdown() {
  document.getElementById("specialist").addEventListener("change", function () {
    var el = this;
    var status = document.getElementById("status");

    if (el.value === "kinesiologia") {
      var options = status.querySelectorAll("option");
      console.log(options.length);
      if (options.length >= 1) {
        status.removeChild(options[options.length - 1]);
      }
      var option = document.createElement("option");
      const k = (document.getElementById("ktime").style.display = "block");
      // console.log(time);
      option.textContent = "18:00 – 19:00";
      status.appendChild(option);
      status.appendChild(k);
    } else if (el.value === "masajista") {
      if (options.length >= 1) {
        status.removeChild(options[options.length - 1]);
      }
      var option = document.createElement("option");
      option.textContent = "12:00 – 13:00";
      status.appendChild(option);
      var option1 = document.createElement("option");
      option1.textContent = "13:00 – 14:00";
      status.appendChild(option1);
      var option2 = document.createElement("option");
      option2.textContent = "15:00 – 16:00";
      status.appendChild(option2);
    } else if (el.value === "quiropraxia") {
      var options = status.querySelectorAll("option");
      if (options.length >= 1) {
        status.removeChild(options[options.length - 1]);
      }
      var option = document.createElement("option");
      option.textContent = "08:00 – 09:00";
      status.appendChild(option);
      var option1 = document.createElement("option");
      option1.textContent = "18:00 – 19:00";
      status.appendChild(option1);
    }
  });
}
//
function editPhone() {
  var element = document.getElementById("pphone");
  let value = element.innerHTML;

  var btn = document.getElementById("tbutton");
  var btnEdit = document.getElementById("buttonEdit");
  let input = document.createElement("input");
  input.value = value;

  let button = document.createElement("button");

  button.innerHTML = "Save";
  element.innerHTML = "";
  element.append(input);
  input.id = "inputId";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    let content_new = input.value;
    var regex = /^\+[0-9]{1,3}[0-9]{4,14}(?:x+)?$/;
    if (content_new.match(regex)) {
      fetch(`/profile/${user_id}`, {
        method: "PUT",
        body: JSON.stringify({
          phone: `${content_new}`,
        }),
      }).then((result) => {
        value = content_new;
        btn.innerHTML = "";
        btn.append(btnEdit);
        element.innerHTML = value;
      });
    } else {
      alert("Insert a valid phone, like +59899999999");
    }
  });
}

function editGender() {
  var element = document.getElementById("gender");
  let value = element.innerHTML;
  var array = ["Male", "Female", "Dont want to say"];
  var btn = document.getElementById("gbutton");
  var btnEdit = document.getElementById("buttonEditG");

  let button = document.createElement("button");
  var selectList = document.createElement("select");
  button.innerHTML = "Save";
  element.innerHTML = "";
  for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList.appendChild(option);
  }
  element.append(selectList);
  selectList.id = "selectListId";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    var e = document.getElementById("selectListId");
    var value = e.value;
    text = e.options[e.selectedIndex].text;
    console.log(text);
    fetch(`/profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        gender: `${text}`,
      }),
    }).then((result) => {
      value = text;
      element.innerHTML = value;
      btn.innerHTML = "";
      btn.append(btnEdit);
      element.innerHTML = text;
    });
  });
}

function editDescription() {
  var element = document.getElementById("description");
  let value = element.innerHTML;

  var btn = document.getElementById("dbutton");
  var btnEdit = document.getElementById("buttonEditD");
  let textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.rows = "4";
  textArea.cols = "40";
  let button = document.createElement("button");

  button.innerHTML = "Save";
  element.innerHTML = "";
  element.append(textArea);
  textArea.id = "description";
  textArea.type = "text";
  textArea.name = "description";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);
  // td.append(input);
  // td.append(space);
  button.addEventListener("click", (e) => {
    e.preventDefault();
    let content_new = textArea.value;
    console.log(user_id);
    console.log(content_new);
    fetch(`profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        description: `${content_new}`,
      }),
    }).then((result) => {
      value = content_new;
      btn.innerHTML = "";
      btn.append(btnEdit);
      element.innerHTML = value;
    });
  });
}

function editFirst() {
  var element = document.getElementById("fname");
  let value = element.innerHTML;

  var btn = document.getElementById("nbutton");
  var btnEdit = document.getElementById("buttonEditN");
  let input = document.createElement("input");
  input.value = value;

  let button = document.createElement("button");

  button.innerHTML = "Save";
  element.innerHTML = "";
  element.append(input);
  input.id = "first_name";
  input.type = "text";
  input.name = "first_name";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);
  // td.append(input);
  // td.append(space);
  button.addEventListener("click", (e) => {
    e.preventDefault();
    let content_new = input.value;
    console.log(user_id);
    console.log(content_new);
    fetch(`profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        first_name: `${content_new}`,
      }),
    }).then((result) => {
      value = content_new;
      btn.innerHTML = "";
      btn.append(btnEdit);
      element.innerHTML = value;
    });
  });
}

function editLast() {
  var element = document.getElementById("lname");
  let value = element.innerHTML;

  var btn = document.getElementById("lbutton");
  var btnEdit = document.getElementById("buttonEditL");
  let input = document.createElement("input");
  input.value = value;

  let button = document.createElement("button");

  button.innerHTML = "Save";
  element.innerHTML = "";
  element.append(input);
  input.id = "last_name";
  input.type = "text";
  input.name = "last_name";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);
  // td.append(input);
  // td.append(space);
  button.addEventListener("click", (e) => {
    e.preventDefault();
    let content_new = input.value;
    console.log(user_id);
    console.log(content_new);
    fetch(`profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        last_name: `${content_new}`,
      }),
    }).then((result) => {
      value = content_new;
      btn.innerHTML = "";
      btn.append(btnEdit);
      element.innerHTML = value;
    });
  });
}

function editAvailable() {
  var element = document.getElementById("availabledata");
  // let value = element.innerHTML;
  element.style.display = "none";
  var btn = document.getElementById("abutton");
  var btnEdit = document.getElementById("buttonEditA");
  let form = document.getElementById("timeform");
  form.style.display = "block";
  console.log(form);
  let button = document.createElement("button");
  // formavailable = document.getElementById("formavailable");
  // formavailable.addEventListener("submit", () => {
  //   const selectedOptions = [];
  //   e.preventDefault();
  //   document.querySelectorAll('[type="checkbox"]').forEach((item) => {
  //     if (item.checked) {
  //       selectedOptions.push(item.value);
  //     }
  //   });
  // });
  button.innerHTML = "Save";
  button.type = "submit";

  console.log(available);
  // input.id = "available";
  // input.type = "text";
  // form.name = "available";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);
  // td.append(input);
  // td.append(space);
  button.addEventListener("click", (e) => {
    let selectedOptions = [];
    e.preventDefault();
    var maxOptions = 3;
    var optionCount = 0;
    var selected1 = [];
    for (var i = 0; i < form.length; i++) {
      if (form.options[i].selected) {
        optionCount++;
        selected1.push(`${form.options[i].value}`);
        if (optionCount > maxOptions) {
          alert("You can choose only 3, not submitting");
          return false;
        }
      }
    }
    //  return true;
    //     if (form.options[i].selected )
    //   }
    console.log(selected1);
    // txtSelectedValuesObj.value = selectedArray;

    // for (const option of available) {
    //   if (option.is(":checked")) {
    //     selectedOptions.push(option.value);
    //   }
    // }
    // let arr = [];
    // let ids = `('${selectedOptions.join("','")}')`;

    // const tupleArray = selected1.map(
    //   (element, index) => `(${index}, '${element}')`
    // );

    // let content_new = `[${tupleArray.join(", ")}]`;
    console.log(selected1);
    // console.log(content_new);
    fetch(`profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        available: `${selected1}`,
      }),
    }).then((result) => {
      btn.innerHTML = "";
      btn.append(btnEdit);
      form.style.display = "none";
      element.style.display = "block";
      element.innerHTML = "";
      for (var i = 0; i < selected1.length; i++) {
        element.innerHTML += selected1[i] + `</br>`;
        // I'm only getting "David" as output!!
      }
      // element.innerHTML = selected1;
    });
  });
}

function editPosition() {
  var element = document.getElementById("position");
  let value = element.innerHTML;
  var array = ["Kinesiologia", "Masajista", "Quiropraxia", "Otro"];
  var btn = document.getElementById("pbutton");
  var btnEdit = document.getElementById("buttonEditP");

  let button = document.createElement("button");
  var selectList = document.createElement("select");
  button.innerHTML = "Save";
  element.innerHTML = "";
  for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList.appendChild(option);
  }
  element.append(selectList);
  selectList.id = "selectListId";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    var e = document.getElementById("selectListId");
    var value = e.value;
    text = e.options[e.selectedIndex].text;
    console.log(text);
    fetch(`/profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        position: `${text}`,
      }),
    }).then((result) => {
      value = text;
      element.innerHTML = value;
      btn.innerHTML = "";
      btn.append(btnEdit);
      element.innerHTML = text;
    });
  });
}
function reserva() {
  var element = document.getElementById("position");
  let value = element.innerHTML;
  var array = ["Kinesologia", "Masajista", "Quiropraxia", "Otro"];
  var btn = document.getElementById("pbutton");
  var btnEdit = document.getElementById("buttonEditP");

  let button = document.createElement("button");
  var selectList = document.createElement("select");
  button.innerHTML = "Save";
  element.innerHTML = "";
  for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    selectList.appendChild(option);
  }
  element.append(selectList);
  selectList.id = "selectListId";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    var e = document.getElementById("selectListId");
    var value = e.value;
    text = e.options[e.selectedIndex].text;
    console.log(text);
    fetch(`/profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        position: `${text}`,
      }),
    }).then((result) => {
      value = text;
      element.innerHTML = value;
      btn.innerHTML = "";
      btn.append(btnEdit);
      element.innerHTML = text;
    });
  });
}
// function editPatient() {
//   var element = document.getElementById("editformPatient");
//   element.addEventListener("submit", (e) => {
//     e.preventDefault();

//     fetch(`registerpatient`, {
//       method: "POST",
//       body: JSON.stringify({
//         is_patient: true,
//       }),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         console.log("hola");
//         load_inicio();
//       });
//   });
// }
// function createDoctor() {
//   var element = document.getElementById("formPatient");
//   element.addEventListener("submit", (e) => {
//     e.preventDefault();

//     fetch(`registerdoctor`, {
//       method: "POST",
//       body: JSON.stringify({
//         is_doctor: true,
//       }),
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         console.log("hola");
//         load_inicio();
//       });
//   });
// }
