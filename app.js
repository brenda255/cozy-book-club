let searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", function () {
  let query = document.getElementById("searchInput").value;

  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayBooks(data.items);
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
});

function displayBooks(books) {
  let results = document.getElementById("results");
  results.innerHTML = "";

  books.forEach((book) => {
    let info = book.volumeInfo;

    let title = info.title || "No title";
    let authors = info.authors ? info.authors.join(", ") : "Unkown author";
    let description = info.description || "No description available.";
    let thumbnail = info.imageLinks ? info.imageLinks.thumbnail : "";

    //container div for each book
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book-card");

    //add thumbnail if there is one
    if (thumbnail) {
      let img = document.createElement("img");
      img.src = thumbnail;
      img.alt = title;
      bookDiv.appendChild(img);
    }

    //add title, author and desc.
    let titleElem = document.createElement("h3");
    titleElem.textContent = title;

    let authorElem = document.createElement("p");
    authorElem.textContent = "By: " + authors;

    let descrElem = document.createElement("p");
    descrElem.textContent = description;

    bookDiv.appendChild(titleElem);
    bookDiv.appendChild(authorElem);
    bookDiv.appendChild(descrElem);

    results.appendChild(bookDiv);

    //buttons for the three shelves
    const shelves = ["Want to Read", "Reading", "Read"];
    const buttonContainer = document.createElement("div");

    shelves.forEach((shelf) => {
      let btn = document.createElement("button");
      btn.textContent = shelf;
      btn.addEventListener("click", () => {
        saveToShelf(book, shelf);
        alert(`Added "${book.volumeInfo.title}" to ${shelf} shelf.`);
      });
      buttonContainer.appendChild(btn);
    });
    bookDiv.appendChild(buttonContainer);

    //save items to local storage
    function saveToShelf(book, shelfName) {
      let shelves = JSON.parse(localStorage.getItem("bookShelves")) || {};

      if (!shelves[shelfName]) {
        shelves[shelfName] = [];
      }

      shelves[shelfName].push({
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        id: book.id,
      });

      localStorage.setItem("bookShelves", JSON.stringify(shelves));
      displayShelves();
    }
  });


  function displayShelves() {
    const shelvesContainer = document.getElementById("shelvesContainer");
    shelvesContainer.innerHTML = ""; // this clears it before repopulating 

    const shelves = JSON.parse(localStorage.getItem("bookShelves")) || {};

    for (let shelfName in shelves) {
        let shelfDiv = document.createElement("div");
        shelfDiv.className = "shelf-section";

        let heading = document.createElement("h3");
        heading.textContent = shelfName;
        shelfDiv.appendChild(heading);

        shelves[shelfName].forEach(book => {
            let p = document.createElement("p");
            p.textContent = `${book.title} by ${book.authors ? book.authors.join(", ") : "Unknown Author"}`;
            shelfDiv.appendChild(p);
        });

        shelvesContainer.appendChild(shelfDiv);
    }
  }

  window.addEventListener("load", displayShelves);
}
