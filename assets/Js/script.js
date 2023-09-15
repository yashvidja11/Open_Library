const mainEl = document.getElementById("main");
const mainEl2 = document.getElementById("main2");
const loaderEl = document.getElementById("loader");

const apidata = async (searchQuery) => {
  if (mainEl) {
    if (searchQuery !== "") {
      showLoader();
      let url = `https://openlibrary.org/search.json?title=${searchQuery}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data.docs);

      let output = "";
      data.docs.forEach((item) => {
        const title = item.title ? item.title : "unknown title";
        if (title !== "Undefined") {
          const imageUrl = item.cover_i
            ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
            : "./assets/images/th.jpg";
          output += `
              <div class="books-data" onclick="showBookDetails('${item.key}')">
                <a href="book-details.html?id=${
                  item.key
                }"><img class="img" src="${imageUrl}"/></a>
                <p><b>Title</b>: ${item.title}</p>
                <p><b>Authors</b> : ${item.author_name.map((item) => item)}</p>
              </div>`;
        }

        mainEl.innerHTML = output;
        hideLoader();
      });
    }
  }
};

const showBookDetails = async () => {
  if (mainEl2) {
    showLoader();
    const urlParams = new URLSearchParams(window.location.search);
    const bookKey = urlParams.get("id");
    const res = await fetch(`https://openlibrary.org${bookKey}.json`);
    const book = await res.json();
    console.log(book);
    const authorKey = book.authors.map((name) => name.author.key);
    const apiUrl = `https://openlibrary.org${authorKey}.json`;
    const author_res = await fetch(apiUrl);
    const author_data = await author_res.json();
    console.log(author_data);
    const imageUrl = book.covers
      ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
      : "./assets/images/th.jpg";
    let output = `
      <img class="img" src="${imageUrl}"/>
      <h1>${book.title}</h1>
      <p><b>Author</b>: ${book.authors ? author_data.name : "Unknown"}</p>
      <p><b>Published</b>: ${author_data.created.value}</p>
      <p><b>Number of Pages</b>: ${
        book.number_of_pages ? book.number_of_pages : "Unknown"
      }</p>
      <p><b>Publishers</b>: ${
        book.publisher ? book.publisher.join(", ") : "Unknown"
      }</p>
      <p><b>Latest revision</b>: ${
        book.latest_revision ? book.latest_revision : "Unknown"
      }</p>
      <p><b>Weight</b>: ${book.weight ? book.weight : "Unknown"}</p>
      <p><b>Last modified</b>: ${
        book.last_modified ? book.last_modified.value : "Unknown"
      }</p>
    `;

    mainEl2.innerHTML = output;
    hideLoader();
  }
};
const showLoader = () => {
  loaderEl.style.display = "block";
};

const hideLoader = () => {
  loaderEl.style.display = "none";
};

const searchBooks = () => {
  const searchQuery = document.getElementById("search-input").value;
  if (searchQuery == "") {
    document.getElementById("p").innerHTML = "*please enter a book name";
  }
  console.log(searchQuery);
  apidata(searchQuery);
};
apidata();
showBookDetails();
