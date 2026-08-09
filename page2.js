// const grid = document.getElementById("userGrid");
// const search = document.getElementById("search");

// function renderUsers(list) {
//   grid.innerHTML = "";
//   list.forEach(u => {
//     const card = document.createElement("div");
//     card.className = "card";
//     card.innerHTML = `
//       <img src="${u.avatar}" alt="${u.name}">
//       <h3>${u.name}</h3>
//       <p>${u.email}</p>
//       <p><strong>${u.role}</strong></p>
//       <p>${u.address}</p>
//     `;
//     grid.appendChild(card);
//   });
// }

// renderUsers(users);

// search.addEventListener("input", () => {
//   const q = search.value.toLowerCase();
//   renderUsers(users.filter(u => u.name.toLowerCase().includes(q)));
// });

const grid = document.getElementById("userGrid");
const search = document.getElementById("search");

function renderUsers(list) {
  grid.innerHTML = "";
  list.forEach(u => {
    const fullName = `${u.firstName} ${u.lastName}`;
    const fullAddress = `${u.address.street}, ${u.address.city}, ${u.address.state} ${u.address.zipCode}, ${u.address.country}`;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${u.avatar}" alt="${fullName}">
      <h3>${fullName}</h3>
      <p>${u.email}</p>
      <p>${u.phone}</p>
      <p><strong>${u.role}</strong></p>
      <p>${u.age} years old &bull; ${u.gender}</p>
      <p>${fullAddress}</p>
      <p>Joined: ${u.joinedDate}</p>
      <p class="status ${u.isActive ? "active" : "inactive"}">
        ${u.isActive ? "Active" : "Inactive"}
      </p>
    `;
    grid.appendChild(card);
  });
}

renderUsers(users);

search.addEventListener("input", () => {
  const q = search.value.toLowerCase();
  renderUsers(users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
  ));
});