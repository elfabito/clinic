document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#lunes").style.display = "none";
  document.querySelector("#martes").style.display = "none";
  document.querySelector("#miercoles").style.display = "none";
  document.querySelector("#jueves").style.display = "none";
  document.querySelector("#viernes").style.display = "none";
  document.querySelector("#sabado").style.display = "none";

  document
    .getElementById("specialist")
    .addEventListener("change", function (e) {
      e.stopPropagation();
      e.preventDefault();

      dynamicdropdown(e);
    });
});
function esDiferenteDia(diaSemana) {
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
function populateDropdown(doctor, name, dayOfWeek, availableTimes) {
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
  option0.value = "";
  timeDropdown.addEventListener("change", function (e) {
    e.stopPropagation();
    e.preventDefault();

    getOption(doctor, name, dayOfWeek);
  });
  timeDropdown.appendChild(option0);

  availableTimes.map((time) => {
    const option = document.createElement("option");
    option.value = `${time}`;
    // option.disabled = "disabled";
    option.textContent = `${time}`;
    timeDropdown.appendChild(option);
  });

  timeDropdown.appendChild(space);
  document.getElementById("time").appendChild(timeDropdown);
}
function getOption(doctor, name, dayOfWeek) {
  selected = document.getElementById(`${name} ${siguienteFecha(dayOfWeek)}`);
  value = selected.value;
  console.log(value);
  var elems = document.querySelectorAll("select");
  if (value != "") {
    for (var i = 0; i < elems.length; i++) {
      elems[i].disabled = true;
    }
    selected.disabled = false;
    position = document.getElementById("specialist");
    position.disabled = false;
  } else {
    for (var i = 0; i < elems.length; i++) {
      elems[i].disabled = false;
    }
    selected.disabled = false;
    position = document.getElementById("specialist");
    position.disabled = false;
  }
  document
    .getElementById("formreserva")
    .addEventListener("submit", function (e) {
      e.stopPropagation();
      e.preventDefault();

      reserva(doctor, dayOfWeek);
    });
}
function dynamicdropdown(el) {
  var br = document.createElement("br");

  var time = document.getElementById("time");
  // Clear any previous content in the div
  time.innerHTML = "";
  time.append(br);

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
          // document
          //   .getElementById("formreserva")
          //   .addEventListener("submit", function (e) {
          //     e.stopPropagation();
          //     e.preventDefault();
          //     document
          //       .getElementById("formreserva")
          //       .addEventListener("submit", function (e) {
          //         e.stopPropagation();
          //         e.preventDefault();

          //         reserva(doctor);
          //       });
          //   });
          // checkbox = document.getElementById(`${doctor.first_name}`);
          // if (checkbox.checked) {
          //   document
          //     .getElementById("formreserva")
          //     .addEventListener("submit", function (e) {
          //       e.stopPropagation();
          //       e.preventDefault();

          //       reserva(doctor);
          //     });
          // }

          fetch(`/available/${doctor.user_id}`)
            .then((response) => response.json())
            .then((data) => {
              let doctoravailable = data.available;
              let br1 = document.createElement("br");
              time.appendChild(br1);
              let label = document.createElement("label");
              label.innerHTML = `${doctor.first_name}' available schedules`;

              let input = document.createElement("input");
              // input.type = "checkbox";
              // input.id = `${doctor.first_name}`;
              // input.value = `${doctor.first_name}`;
              // label.appendChild(input);
              time.appendChild(label);
              let br = document.createElement("br");
              time.appendChild(br);

              if (doctoravailable.lunes.length != 0 && esDiferenteDia(1)) {
                populateDropdown(
                  doctor,
                  doctor.first_name,
                  1,
                  doctoravailable.lunes
                );
              }
              if (doctoravailable.martes.length != 0 && esDiferenteDia(2)) {
                populateDropdown(
                  doctor,
                  doctor.first_name,
                  2,
                  doctoravailable.martes
                );
              }

              if (doctoravailable.miercoles.length != 0 && esDiferenteDia(3)) {
                populateDropdown(
                  doctor,
                  doctor.first_name,
                  3,
                  doctoravailable.miercoles
                );
              }
              if (doctoravailable.jueves.length != 0 && esDiferenteDia(4)) {
                populateDropdown(
                  doctor,
                  doctor.first_name,
                  4,
                  doctoravailable.jueves
                );
              }
              if (doctoravailable.viernes.length != 0 && esDiferenteDia(5)) {
                populateDropdown(
                  doctor,
                  doctor.first_name,
                  5,
                  doctoravailable.viernes
                );
              }
              if (doctoravailable.sabado.length != 0 && esDiferenteDia(6)) {
                populateDropdown(
                  doctor,
                  doctor.first_name,
                  6,
                  doctoravailable.sabado
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
          document
            .getElementById("formreserva")
            .addEventListener("submit", function (e) {
              e.stopPropagation();
              e.preventDefault();
            });
          // checkbox = document.getElementById(`${doctor.first_name}`);
          // if (checkbox.checked) {
          //   document
          //     .getElementById("formreserva")
          //     .addEventListener("submit", function (e) {
          //       e.stopPropagation();
          //       e.preventDefault();

          //       reserva(doctor);
          //     });
          // }

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
          document
            .getElementById("formreserva")
            .addEventListener("submit", function (e) {
              e.stopPropagation();
              e.preventDefault();
              // checkbox = document.getElementById(`${doctor.first_name}`);
              // if (checkbox.checked) {
              //   document
              //     .getElementById("formreserva")
              //     .addEventListener("submit", function (e) {
              //       e.stopPropagation();
              //       e.preventDefault();

              //       reserva(doctor);
              //     });
              // }
            });

          fetch(`/available/${doctor.user_id}`)
            .then((response) => response.json())
            .then((data) => {
              let doctoravailable = data.available;
              let br1 = document.createElement("br");
              time.appendChild(br1);
              let label = document.createElement("label");
              label.innerHTML = `Horarios Disponibles de  ${doctor.first_name}  `;

              let input = document.createElement("input");
              input.type = "checkbox";
              input.id = `${doctor.first_name}`;
              input.value = `${doctor.first_name}`;
              label.appendChild(input);
              time.appendChild(label);
              let br = document.createElement("br");
              time.appendChild(br);
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
  button.className = "btn btn-secondary float-end";
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
  button.className = "btn btn-secondary float-end";
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
  button.className = "btn btn-secondary float-end";
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
  button.className = "btn btn-secondary float-end";
  button.innerHTML = "Save";
  element.innerHTML = "";
  element.append(input);
  input.id = "first_name";
  input.type = "text";
  input.name = "first_name";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    let content_new = input.value;
    content_newUpper =
      content_new.charAt(0).toUpperCase() + content_new.slice(1);
    fetch(`profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        first_name: `${content_newUpper}`,
      }),
    }).then((result) => {
      value = content_newUpper;
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
  button.className = "btn btn-secondary float-end";
  button.innerHTML = "Save";
  element.innerHTML = "";
  element.append(input);
  input.id = "last_name";
  input.type = "text";
  input.name = "last_name";
  btn.innerHTML = "";
  btn.append(button);
  const user_id = JSON.parse(document.getElementById("user_id").textContent);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    let content_new = input.value;
    content_newUpper =
      content_new.charAt(0).toUpperCase() + content_new.slice(1);

    fetch(`profile/${user_id}`, {
      method: "PUT",
      body: JSON.stringify({
        last_name: `${content_newUpper}`,
      }),
    }).then((result) => {
      value = content_newUpper;
      btn.innerHTML = "";
      btn.append(btnEdit);
      element.innerHTML = value;
    });
  });
}

function editAvailable() {
  var element = document.getElementById("availabledata");

  element.style.display = "none";
  var btn = document.querySelector("#abutton");
  var btnEdit = document.getElementById("buttonEditA");
  var button = document.createElement("button");

  btn.innerHTML = "";
  button.innerHTML = "Save";
  button.className = "btn btn-secondary float-end";
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

  const user_id = JSON.parse(document.getElementById("user_id").textContent);

  button.addEventListener("click", (e) => {
    e.preventDefault();
    var maxOptions = 3;

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
  button.className = "btn btn-secondary float-end";
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
function reserva(doctor, dayOfWeek) {
  // var elems = document.querySelectorAll("select");
  // a = [];
  // console.log(elems);
  // for (var i = 0; i < elems.length; i++) {
  //   if ((elems[i].disabled = false)) {
  //     a.push(elems[i]);
  //   }
  // }
  selected = document.getElementById(
    `${doctor.first_name} ${siguienteFecha(dayOfWeek)}`
  );
  value = selected.value;
  fecha = siguienteFecha(dayOfWeek);
  date = fecha.split("/");
  dateeng = date.reverse().join("-");
  console.log(dateeng);
  console.log(`TIME : ${value}`);
  console.log(siguienteFecha(dayOfWeek));
  time = value.split(":");
  console.log(time);
  datetime = dateeng + " " + time[0] + ":00";
  console.log(datetime);
  var date = document.getElementById("id_datetime");
  var comment = document.getElementById("id_comment");
  const doc = JSON.parse(JSON.stringify(doctor));
  // let time = getOption(doctor.user.first_name, dayOfWeek);
  console.log(doctor);
  console.log(doc);
  console.log(typeof doc);
  checkbox = document.getElementById(`${doctor.first_name}`);

  fetch(`reserva`, {
    method: "POST",
    body: JSON.stringify({
      service: doctor.position,
      doctor: doctor,
      datetime: datetime,
      comment: comment.value,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      // alert("Appointment successfully");
      // location.href = "profile";
      // alert(JSON.stringify(result["msg"]));
      if (result["msg"] == "Register Successfully, wait for approved") {
        // document.getElementById("msg").innerHTML = result["msg"];
        location.href = "profile";
      } else {
        // document.getElementById("msg").innerHTML = result["msg"];
        window.location.reload();
      }
    });

  // document
  //   .getElementById("formreserva")
  //   .addEventListener("submit", function (e) {
  //     e.stopPropagation();
  //     e.preventDefault();

  //     reserva(doctor);
}

function approved(id) {
  fetch(`reserva/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      canceled: false,
      approved: true,
    }),
  }).then((result) => {
    window.location.reload();
  });
}
function cancelAppoint(id) {
  fetch(`reserva/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      canceled: true,
      approved: false,
    }),
  }).then((result) => {
    window.location.reload();
  });
}
function deleteAppoint(id) {
  fetch(`reserva/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json()) // or res.json()
    .then((result) => window.location.reload());
}

function imagedata(id) {
  image = document.getElementById("choose-file").value;

  console.log(image);
  fetch(`doctor/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      image: image,
    }),
  }).then((result) => {
    window.location.reload();
  });
}

// Display "image" in Local storage as src of img preview even after page refreshes

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
