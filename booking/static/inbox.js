document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document.querySelector("#lunes").style.display = "none";
  document.querySelector("#martes").style.display = "none";
  document.querySelector("#miercoles").style.display = "none";
  document.querySelector("#jueves").style.display = "none";
  document.querySelector("#viernes").style.display = "none";
  document.querySelector("#sabado").style.display = "none";
  document.getElementById("ktime").style.display = "none";
  document
    .getElementById("specialist")
    .addEventListener("change", function (e) {
      e.stopPropagation();
      e.preventDefault();
      // Call the dynamicdropdown function here
      dynamicdropdown(e);
    });
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
function esDiferenteDia(diaSemana) {
  // Obtener el día actual
  let diaActual = new Date().getDay();

  // Verificar si el día proporcionado es igual al día actual
  if (diaSemana === diaActual) {
    return false; // Es el mismo día
  } else {
    return true; // No es el mismo día
  }
}
function siguienteFecha(diaSemana) {
  // Verificar si el día proporcionado es válido (entre 0 y 6, representando domingo a sábado)
  if (diaSemana >= 0 && diaSemana <= 6) {
    // Obtener la fecha actual
    let fechaActual = new Date();

    // Calcular la cantidad de días que faltan para llegar al próximo día deseado
    let diferencia = (diaSemana - fechaActual.getDay() + 7) % 7;

    // Obtener la fecha del siguiente día deseado
    let fechaSiguiente = new Date(
      fechaActual.getTime() + diferencia * 24 * 60 * 60 * 1000
    );

    // Devolver la fecha del siguiente día
    return fechaSiguiente.toLocaleDateString("en-GB");
  }
}
function populateDropdown(name, dayOfWeek, availableTimes) {
  const timeDropdown = document.createElement("select");
  const space = document.createElement("br");
  timeDropdown.className = "btn btn-outline-";
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  const option0 = document.createElement("option");
  timeDropdown.id = `${name} ${siguienteFecha(dayOfWeek)}`;
  option0.textContent = `${days[dayOfWeek]} ${siguienteFecha(dayOfWeek)}`;

  timeDropdown.appendChild(option0);

  availableTimes.map((time) => {
    const option = document.createElement("option");
    option.value = `${time}`;
    option.disabled = "disabled";
    option.textContent = `${time}`;
    timeDropdown.appendChild(option);
  });

  timeDropdown.appendChild(space);
  document.getElementById("time").appendChild(timeDropdown);
}
function dynamicdropdown(el) {
  var br = document.createElement("br");

  var time = document.getElementById("time");
  // Clear any previous content in the div
  time.innerHTML = "";
  time.append(br);
  console.log(el.value);
  fechaActual = new Date().toLocaleDateString("en-GB");

  // Create empty array for filters position of doctors

  let m = [];
  let q = [];
  var k = [];
  let o = [];

  fetch(`/alldoctors`)
    .then((response) => response.json())
    .then((doctors) => {
      doctors.filter((doctor) => {
        if (doctor.position == "Kinesiologia") {
          k.push(doctor);
        }
      });

      doctors.filter((doctor) => {
        if (doctor.position == "Masajista") {
          m.push(doctor);
        }
      });

      doctors.filter((doctor) => {
        if (doctor.position == "Quiropraxia") {
          q.push(doctor);
        }
      });

      doctors.filter((doctor) => {
        if (doctor.position == "Otro") {
          o.push(doctor);
        }
      });

      if (el.value == "kinesiologia") {
        time.innerHTML = "";
        if (k.length == 0) {
          time.textContent = "";
          let div = document.createElement("div");
          div.innerHTML = `No Doctor Found`;
          time.appendChild(div);
        }

        k.map((doctor) => {
          document
            .getElementById("formreserva")
            .addEventListener("submit", function (e) {
              e.stopPropagation();
              e.preventDefault();
              // Call the dynamicdropdown function here
              reserva(el, doctor);
            });
          fetch(`/available/${doctor.user_id}`)
            .then((response) => response.json())
            .then((data) => {
              let doctoravailable = data.available;

              let label = document.createElement("div");
              label.innerHTML = `Horarios Disponibles de  ${doctor.first_name}  `;
              time.appendChild(label);
              if (doctoravailable.sabado.length != 0 && esDiferenteDia(6)) {
                populateDropdown(doctor.first_name, 6, doctoravailable.sabado);
              }
              if (doctoravailable.viernes.length != 0 && esDiferenteDia(5)) {
                populateDropdown(doctor.first_name, 5, doctoravailable.viernes);
              }
              if (doctoravailable.jueves.length != 0 && esDiferenteDia(4)) {
                populateDropdown(doctor.first_name, 4, doctoravailable.jueves);
              }
              if (doctoravailable.lunes.length != 0 && esDiferenteDia(1)) {
                populateDropdown(doctor.first_name, 1, doctoravailable.lunes);
              }
              if (doctoravailable.martes.length != 0 && esDiferenteDia(2)) {
                populateDropdown(doctor.first_name, 2, doctoravailable.martes);
              }

              if (doctoravailable.miercoles.length != 0 && esDiferenteDia(3)) {
                populateDropdown(
                  doctor.first_name,
                  3,
                  doctoravailable.miercoles
                );
              }
            });
        });
      } else if (el.value == "quiropraxia") {
        time.innerHTML = "";
        if (q.length == 0) {
          time.textContent = "";
          let div = document.createElement("div");
          div.innerHTML = `No Doctor Found`;
          time.appendChild(div);
        }

        q.map((doctor) => {
          document.getElementById("time").innerHTML = "";
          fetch(`/available/${doctor.user_id}`)
            .then((response) => response.json())
            .then((data) => {
              let doctoravailable = data.available;

              let label = document.createElement("div");
              label.innerHTML = `Horarios Disponibles de ${doctor.first_name}  `;
              time.appendChild(label);
              if (doctoravailable.lunes.length != 0 && esDiferenteDia(1)) {
                populateDropdown(doctor.first_name, 1, doctoravailable.lunes);
              }
              if (doctoravailable.martes.length != 0 && esDiferenteDia(2)) {
                populateDropdown(doctor.first_name, 2, doctoravailable.martes);
              }
              if (doctoravailable.miercoles.length != 0 && esDiferenteDia(3)) {
                populateDropdown(
                  doctor.first_name,
                  3,
                  doctoravailable.miercoles
                );
              }
              if (doctoravailable.jueves.length != 0 && esDiferenteDia(4)) {
                populateDropdown(doctor.first_name, 4, doctoravailable.jueves);
              }
              if (doctoravailable.viernes.length != 0 && esDiferenteDia(5)) {
                populateDropdown(doctor.first_name, 5, doctoravailable.viernes);
              }
              if (doctoravailable.sabado.length != 0 && esDiferenteDia(6)) {
                populateDropdown(doctor.first_name, 6, doctoravailable.sabado);
              }
            });
        });
      } else if (el.value == "masajista") {
        time.innerHTML = "";
        if (m.length == 0) {
          time.textContent = "";
          let div = document.createElement("div");
          div.innerHTML = `No Doctor Found`;
          time.appendChild(div);
        }

        m.map((doctor) => {
          fetch(`/available/${doctor.user_id}`)
            .then((response) => response.json())
            .then((data) => {
              let doctoravailable = data.available;

              let label = document.createElement("div");
              label.innerHTML = `Horarios Disponibles de ${doctor.first_name}  `;
              time.appendChild(label);
              if (doctoravailable.lunes.length != 0 && esDiferenteDia(1)) {
                populateDropdown(doctor.first_name, 1, doctoravailable.lunes);
              }
              if (doctoravailable.martes.length != 0 && esDiferenteDia(2)) {
                populateDropdown(doctor.first_name, 2, doctoravailable.martes);
              }
              if (doctoravailable.miercoles.length != 0 && esDiferenteDia(3)) {
                populateDropdown(
                  doctor.first_name,
                  3,
                  doctoravailable.miercoles
                );
              }
              if (doctoravailable.jueves.length != 0 && esDiferenteDia(4)) {
                populateDropdown(doctor.first_name, 4, doctoravailable.jueves);
              }
              if (doctoravailable.viernes.length != 0 && esDiferenteDia(5)) {
                populateDropdown(doctor.first_name, 5, doctoravailable.viernes);
              }
              if (doctoravailable.sabado.length != 0 && esDiferenteDia(6)) {
                populateDropdown(doctor.first_name, 6, doctoravailable.sabado);
              }
            });
        });
      } else {
        time.textContent = "";
        let div = document.createElement("div");
        div.innerHTML = `No Doctor Found`;
        time.appendChild(div);
      }
    });
}

function editPhone() {
  var element = document.getElementById("pphone");
  let value = element.innerHTML;

  var btn = document.getElementById("tbutton");
  var btnEdit = document.getElementById("buttonEdit");
  let input = document.createElement("input");
  input.value = value;

  let button = document.createElement("button");
  button.className = "btn btn-secondary";
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
  button.className = "btn btn-secondary";
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
  button.className = "btn btn-secondary";
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
  button.className = "btn btn-secondary";
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
  button.className = "btn btn-secondary";
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
  var btn = document.querySelector("#abutton");
  var btnEdit = document.getElementById("buttonEditA");
  var button = document.createElement("button");
  console.log(btn);
  btn.innerHTML = "";
  button.innerHTML = "Save";
  console.log(button);
  btn.append(button);

  let lunes = document.getElementById("lunes");
  let martes = document.getElementById("martes");
  let miercoles = document.getElementById("miercoles");
  let jueves = document.getElementById("jueves");
  let viernes = document.getElementById("viernes");
  let sabado = document.getElementById("sabado");
  lunes.style.display = "block";
  martes.style.display = "block";
  miercoles.style.display = "block";
  jueves.style.display = "block";
  viernes.style.display = "block";
  sabado.style.display = "block";

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

  console.log(available);
  // input.id = "available";
  // input.type = "text";
  // form.name = "available";

  const user_id = JSON.parse(document.getElementById("user_id").textContent);
  // td.append(input);
  // td.append(space);
  button.addEventListener("click", (e) => {
    e.preventDefault();
    var maxOptions = 3;
    var optionCount = 0;
    var daytime = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
    };
    for (var i = 0; i < lunes.length; i++) {
      if (lunes.options[i].selected) {
        daytime.lunes.push(`${lunes.options[i].value}`);

        if (lunes.options[i].selected.length > maxOptions) {
          alert("You can choose only 3, not submitting");

          return false;
        }
      }
    }
    for (var i = 0; i < martes.length; i++) {
      if (martes.options[i].selected) {
        daytime.martes.push(`${martes.options[i].value}`);
        if (martes.options[i].selected.length > maxOptions) {
          alert("You can choose only 3, not submitting");

          return false;
        }
      }
    }
    for (var i = 0; i < miercoles.length; i++) {
      if (miercoles.options[i].selected) {
        daytime.miercoles.push(`${miercoles.options[i].value}`);
        if (miercoles.options[i].selected.length > maxOptions) {
          alert("You can choose only 3, not submitting");

          return false;
        }
      }
    }
    for (var i = 0; i < jueves.length; i++) {
      if (jueves.options[i].selected) {
        daytime.jueves.push(`${jueves.options[i].value}`);
        if (jueves.options[i].selected.length > maxOptions) {
          alert("You can choose only 3, not submitting");
          optionCount = 0;
          return false;
        }
      }
    }
    for (var i = 0; i < viernes.length; i++) {
      if (viernes.options[i].selected) {
        daytime.viernes.push(`${viernes.options[i].value}`);
        if (viernes.options[i].selected.length > maxOptions) {
          alert("You can choose only 3, not submitting");

          return false;
        }
      }
    }
    for (var i = 0; i < sabado.length; i++) {
      if (sabado.options[i].selected) {
        daytime.sabado.push(`${sabado.options[i].value}`);
        if (sabado.options[i].selected.length > maxOptions) {
          alert("You can choose only 3 per day, not submitting");

          return false;
        }
      }
    }
    //  return true;
    //     if (form.options[i].selected )
    //   }
    console.log(daytime);
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

    // console.log(content_new);
    fetch(`available/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        lunes: `${daytime.lunes}`,
        martes: `${daytime.martes}`,
        miercoles: `${daytime.miercoles}`,
        jueves: `${daytime.jueves}`,
        viernes: `${daytime.viernes}`,
        sabado: `${daytime.sabado}`,
      }),
    }).then((result) => {
      btn.innerHTML = "";
      btn.append(btnEdit);
      lunes.style.display = "none";
      martes.style.display = "none";
      miercoles.style.display = "none";
      jueves.style.display = "none";
      viernes.style.display = "none";
      sabado.style.display = "none";
      element.style.display = "block";
      window.location.reload();
      // element.innerHTML = "";
      // for (const [key, value] of Object.entries(daytime)) {
      //   console.log(key, value);
      //   element.innerHTML += `${key} : ${value} ` + `</br>`;
      // }
      // for (var i = 0; i < selected1.length; i++) {
      //   element.innerHTML += selected1[i] + `</br>`;
      //   // I'm only getting "David" as output!!
      // }
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
  button.className = "btn btn-secondary";
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
    console.log(user_id);
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
function reserva(el, doctor) {
  var e = document.getElementById("specialist");
  var date = document.getElementById("id_datetime");
  var comment = document.getElementById("id_comment");
  console.log(date.value);
  var value = el.value;
  console.log(value);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);
  console.log(doctor);
  console.log(doctor.position);
  fetch(`/available/${doctor.user_id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.doctor.first_name);
      fetch(`reserva`, {
        method: "POST",
        body: JSON.stringify({
          service: data.doctor.position,
          doctor: data.doctor.first_name,
          datetime: date.value,
          comment: comment.value,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          alert("Appointment successfully");
          location.href = "profile";
        });
    });
  // // var text = e.options[e.selectedIndex].text;
  // // button.innerHTML = "Save";
  // // element.innerHTML = "";
  // // for (var i = 0; i < array.length; i++) {
  // //   var option = document.createElement("option");
  // //   option.value = array[i];
  // //   option.text = array[i];
  // //   selectList.appendChild(option);
  // // }
  // // element.append(selectList);
  // // selectList.id = "selectListId";
  // // btn.innerHTML = "";
  // // btn.append(button);
  // // const user_id = JSON.parse(document.getElementById("user_id").textContent);

  // // button.addEventListener("click", (e) => {
  // //   e.preventDefault();
  // //   var e = document.getElementById("selectListId");
  // //   var value = e.value;
  // //   text = e.options[e.selectedIndex].text;
  // //   console.log(text);
  // // });
}

function approved(id) {
  fetch(`reserva/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      approved: true,
    }),
  }).then((result) => {
    window.location.reload();
  });
}
function deleteAppoint(id) {
  fetch(`reserva/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.text()) // or res.json()
    .then((res) => window.location.reload());
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
