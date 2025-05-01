let searchBtn = document.getElementById("searchBtn");


searchBtn.addEventListener("click", function () {
    let query = document.getElementById("searchInput").value;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
        .then (response => response.json())
        .then (data => {
            displayBooks(data.items);
        })
        .catch(error => {
            console.error("Error fetching books:", error);
        });
});

function displayBooks(books) {
    let results = document.getElementById("results");
    results.innerHTML = "";

    books.forEach(book => {
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
        
    });
}








