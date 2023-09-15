const mainEl = document.getElementById("main");
const mainEl2 = document.getElementById("main2");
const mainEl3 = document.getElementById('main3');
const loaderEl = document.getElementById("loader");

const searchBooks = () => {
    const searchQuery = document.getElementById("search-input").value;
    if (searchQuery == "") {
      document.getElementById("p").innerHTML = "*please enter a book name";
    }
    // console.log(searchQuery);
    // apidata(searchQuery);
    localStorage.setItem("myValue", searchQuery);
  window.location.href = "/search.html";
  };
  const value = localStorage.getItem("myValue");

const MainBooksData = () => {
    if (mainEl) {
      fetch("https://openlibrary.org/works/OL45804W/editions.json")
        .then((res) => res.json())
        .then((data) => {
          console.log(data.entries);
          let output = "";
          data.entries.map((item) => {
            const imageUrl = item.covers
              ? `https://covers.openlibrary.org/b/id/${item.covers}-L.jpg`
              : "/assets/images/alt.jpg";
            output += `
              <div class="card"onclick="MainshowBookDetails()">
                  <a href="bookDetails.html?id=${item.key}">
                  <img class="img" id="${item.key}" src="${imageUrl}"/>
                  <p class="text-white text-center"> ${item.title}</P></a>
              </div>`;
          });
  
          mainEl.innerHTML = output;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

const apidata = async (value) => {
  if (mainEl3) {
    if (searchQuery !== "") {
      showLoader();
      let url = `https://openlibrary.org/search.json?title=${value}`;
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

        mainEl3.innerHTML = output;
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
      <p><b>Subject</b>: ${
        book.subjects
        ? book.subjects.map((subject)=>subject)
        : "Unknown"
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
    localStorage.setItem("myValue", mainEl2);
        window.location.href = "/search.html";
    hideLoader();
  }
};
const showLoader = () => {
  loaderEl.style.display = "block";
};

const hideLoader = () => {
  loaderEl.style.display = "none";
};

MainBooksData();
apidata(value);
showBookDetails();
