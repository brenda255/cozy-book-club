let searchBtn = document.getElementById("searchBtn");
let searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click(); 
  }
});

searchBtn.addEventListener("click", function () {
  let query = searchInput.value;

  if (query.trim() === "") {
    document.getElementById("quote-banner").style.display = "block";
    document.getElementById("newReleasesContainer").style.display = "block";
    document.getElementById("newReleasesTitle").style.display = "block";
    return;
  }
  
  document.getElementById("quote-banner").style.display = "none";
  document.getElementById("newReleasesContainer").style.display = "none";
  document.getElementById("newReleasesTitle").style.display = "none";

  
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

function fetchNewReleases(){
  fetch("https://www.googleapis.com/books/v1/volumes?q=fiction&orderBy=newest&maxResults=8")
    .then((response) => response.json())
    .then((data) => {
      if (data.items) {
        displayNewReleases(data.items);
      }
    })
    .catch((error) => console.error("Error fetching new releases: ", error));
}


function displayNewReleases(books) {
  const newReleasesContainer = document.getElementById("newReleasesContainer");
  newReleasesContainer.innerHTML = "";

  books.forEach((book) => {
    const info = book.volumeInfo;
    const title = info.title || "No title";
    const authors = info.authors ? info.authors.join(", ") : "Unknown author";
    const description = info.description || "No description available.";
    const thumbnail = info.imageLinks ? info.imageLinks.thumbnail : "";

    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book-card");

    if (thumbnail) {
      const img = document.createElement("img");
      img.src = thumbnail;
      img.alt = title;
      bookDiv.appendChild(img);
    }

    const summaryDiv = document.createElement("div");
    summaryDiv.classList.add("book-summary");


    const titleElem = document.createElement("h4");
    titleElem.textContent = title;
    const authorElem = document.createElement("p");
    authorElem.textContent = "By: " + authors;

    summaryDiv.appendChild(titleElem);
    summaryDiv.appendChild(authorElem);

    // Details (initially hidden)
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("book-details", "hidden");
    const descrElem = document.createElement("p");
    descrElem.textContent = description;

    detailsDiv.appendChild(descrElem);

    summaryDiv.addEventListener("click", () => {
      detailsDiv.classList.toggle("hidden");
    });


    // 3 shelf buttons
    const shelves = ["Want to Read", "Reading", "Read"];
    const buttonContainer = document.createElement("div");

    shelves.forEach((shelf) => {
      const btn = document.createElement("button");
      btn.textContent = shelf;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        saveToShelf(book, shelf);
      });
      buttonContainer.appendChild(btn);
    })

    detailsDiv.appendChild(buttonContainer);
    bookDiv.appendChild(summaryDiv);
    bookDiv.appendChild(detailsDiv);

    newReleasesContainer.appendChild(bookDiv);
  });    
  }


function toggleShelves() {
  const container = document.getElementById('shelvesContainer');
  container.style.display = container.style.display === 'none' || container.style.display === '' ? 'block' : 'none';
}

function displayBooks(books) {
  let results = document.getElementById("results");
  results.innerHTML = "";

  books.forEach((book) => {
    let info = book.volumeInfo;

    let title = info.title || "No title";
    let authors = info.authors ? info.authors.join(", ") : "Unknown author";
    let description = info.description || "No description available.";
    let thumbnail = info.imageLinks ? info.imageLinks.thumbnail : "";

    // Main book card
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book-card");

    // Always visible part (image, title, author)
    let summaryDiv = document.createElement("div");
    summaryDiv.classList.add("book-summary");

    if (thumbnail) {
      let img = document.createElement("img");
      img.src = thumbnail;
      img.alt = title;
      summaryDiv.appendChild(img);
    }

    let titleElem = document.createElement("h3");
    titleElem.textContent = title;

    let authorElem = document.createElement("p");
    authorElem.textContent = "By: " + authors;

    summaryDiv.appendChild(titleElem);
    summaryDiv.appendChild(authorElem);

    // Hidden detailed info
    let detailsDiv = document.createElement("div");
    detailsDiv.classList.add("book-details", "hidden");

    let descrElem = document.createElement("p");
    descrElem.textContent = description;

    // Buttons for three shelves
    const shelves = ["Want to Read", "Reading", "Read"];
    const buttonContainer = document.createElement("div");

    shelves.forEach((shelf) => {
      let btn = document.createElement("button");
      btn.textContent = shelf;
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent toggle when clicking a button
        saveToShelf(book, shelf);
      });
      buttonContainer.appendChild(btn);
    });

    detailsDiv.appendChild(descrElem);
    detailsDiv.appendChild(buttonContainer);

    // Toggle when clicking on book to show more info
    summaryDiv.addEventListener("click", () => {
      detailsDiv.classList.toggle("hidden");
    });

    // Append to book card
    bookDiv.appendChild(summaryDiv);
    bookDiv.appendChild(detailsDiv);

    results.appendChild(bookDiv);
  });  


  //save items to local storage
  function saveToShelf(book, shelfName) {
    let shelves = JSON.parse(localStorage.getItem("bookShelves")) || {};

    if (!shelves[shelfName]) {
      shelves[shelfName] = [];
    }

    let alreadyExists = shelves[shelfName].some((b) => b.id === book.id);

    if (!alreadyExists) {
      shelves[shelfName].push({
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors,
        id: book.id,
      });

      localStorage.setItem("bookShelves", JSON.stringify(shelves));
      displayShelves();
      alert(`Added "${book.volumeInfo.title}" to ${shelfName} shelf.`);
    } else {
      alert(`"${book.volumeInfo.title}" is already in the ${shelfName} shelf.`);
    }
    localStorage.setItem("bookShelves", JSON.stringify(shelves));
    displayShelves();
  }
}

function removeBookFromShelf(shelfName, bookId) {
  //Get all shelves
  let shelves = JSON.parse(localStorage.getItem("bookShelves")) || {};
  //Filter out the book with the matching id
  if (shelves[shelfName]) {
    shelves[shelfName] = shelves[shelfName].filter(
      (book) => book.id !== bookId
    );
  }
  //save the updated shelves back to localstorage
  localStorage.setItem("bookShelves", JSON.stringify(shelves));

  //Re-render the shelves
  displayShelves();
}


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

    shelves[shelfName].forEach((book) => {
      let bookCard = document.createElement("div");
      bookCard.className = "book-card";
      
      let bookInfo = document.createElement("span");
      bookInfo.textContent = `${book.title} by ${
        book.authors ? book.authors.join(", ") : "Unknown Author"
      }`;
      
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";

      bookCard.appendChild(bookInfo);
      bookCard.appendChild(removeButton);
      shelfDiv.appendChild(bookCard);

      removeButton.dataset.shelf = shelfName;
      removeButton.dataset.bookId = book.id;

      removeButton.addEventListener("click", (e) => {
        let shelf = e.target.dataset.shelf;
        let id = e.target.dataset.bookId;

        const modal = document.getElementById("confirmModal");
        const confirmYes = document.getElementById("confirmYes");
        const confirmNo = document.getElementById("confirmNo");

        modal.classList.remove("hidden");

        //remove modal on cancel
        confirmNo.onclick = () => modal.classList.add("hidden");

        //add a one time click event to confirmyes
        confirmYes.onclick = () => {
          removeBookFromShelf(shelf, id);
          modal.classList.add("hidden");
        };
      });
    });

    shelvesContainer.appendChild(shelfDiv);
  }
}

// Quote Banner
const quotes = [
  "“A reader lives a thousand lives before he dies. The man who never reads lives only one.” – George R.R. Martin",
  "“So many books, so little time.” – Frank Zappa",
  "“Until I feared I would lose it, I never loved to read. One does not love breathing.” – Harper Lee",
  "“Reading is essential for those who seek to rise above the ordinary.” – Jim Rohn",
  "“Books are a uniquely portable magic.” – Stephen King"
];
let quoteIndex = 0;
const quoteBanner = document.getElementById("quote-banner");

function rotateQuote() {
  quoteBanner.style.opacity = 0;
  setTimeout(() => {
    quoteBanner.textContent = quotes[quoteIndex];
    quoteBanner.style.opacity = 1;
    quoteIndex = (quoteIndex + 1) % quotes.length;
  }, 500);
}
rotateQuote();
setInterval(rotateQuote, 8000); //rotates quotes every 8 secs


window.addEventListener("DOMContentLoaded", () => {
  displayShelves();
  fetchNewReleases();
});
