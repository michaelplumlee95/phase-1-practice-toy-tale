let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  // add event listener for like button using event delegation
  toyCollection.addEventListener("click", (event) => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.id;
      console.log(toyId);
      const toyLikes = parseInt(
        event.target.previousElementSibling.textContent
      );
      const newLikes = toyLikes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likes: newLikes,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // update the DOM with the new number of likes
          event.target.previousElementSibling.textContent = `${data.likes} likes`;
        })
        .catch((error) => console.error(error));
    }
  });
  // add event listener for the toy form submission
  toyFormContainer.addEventListener("submit", (event) => {
    event.preventDefault();
    // get the input values from the form
    const name = event.target.name.value;
    const image = event.target.image.value;

    // send a POST request to create a new toy
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((toy) => {
        // add the new toy to the DOM
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h2>${toy.name}</h2>
            <img src="${toy.image}" alt="${toy.name}">
            <p>${toy.likes} likes</p>
            <button class="like-btn" id="${toy.id}">Like ❤️</button>
          `;
        toyCollection.appendChild(card);

        // reset the form and toggle the visibility
        toyFormContainer.reset();
        toyFormContainer.style.display = "none";
        addToy = false;
      })
      .catch((error) => console.error(error));
  });
});

const toyCollection = document.getElementById("toy-collection");

// make a GET request to fetch all the toys
fetch("http://localhost:3000/toys")
  .then((response) => response.json())
  .then((toys) => {
    // create a card for each toy and append it to the toy-collection div
    toys.forEach((toy) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" alt="${toy.name}">
          <p>${toy.likes} likes</p>
          <button class = "like-btn" id = "${toy.id}">Like ❤️</button>
        `;
      toyCollection.appendChild(card);
    });
  })
  .catch((error) => console.error(error));
