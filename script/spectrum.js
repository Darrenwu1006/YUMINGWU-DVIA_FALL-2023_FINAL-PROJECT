const dem = document.getElementById('dem');
const both = document.getElementById('both');
const rep = document.getElementById('rep');

let flag = false;
let container;
document.addEventListener('DOMContentLoaded', function () {
  fetch('Data/bannedbook_list.csv')
    .then((response) => response.text())
    .then((data) => processData(data))
    .then((books) => {
      const imgs = document.querySelectorAll('.book');
      // console.log(this.images);
      // console.log(books);
      dem.addEventListener('click', (e) => {
        if (flag !== false) container.removeChild(hoverMenu);

        for (let i = 0; i < books.length; i++) {
          if (books[i].title === e.target.id) {
            hoverMenu = createHoverMenu(books[i].title, books[i].author);
          }
        }
        dem.appendChild(hoverMenu);
        flag = true;
        container = dem;
      });
      both.addEventListener('click', (e) => {
        if (flag !== false) container.removeChild(hoverMenu);

        for (let i = 0; i < books.length; i++) {
          if (books[i].title === e.target.id) {
            hoverMenu = createHoverMenu(books[i].title, books[i].author);
          }
        }
        both.appendChild(hoverMenu);
        flag = true;
        container = both;
      });
      rep.addEventListener('click', (e) => {
        if (flag !== false) container.removeChild(hoverMenu);

        for (let i = 0; i < books.length; i++) {
          if (books[i].title === e.target.id) {
            hoverMenu = createHoverMenu(books[i].title, books[i].author);
          }
        }
        rep.appendChild(hoverMenu);
        flag = true;
        container = rep;
      });
    });
  //make data readable from csv
  function processData(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    const books = lines.slice(1).map((line) => {
      const currentLine = line.split(',');
      return headers.reduce((book, header, index) => {
        book[header] = currentLine[index];
        return book;
      }, {});
    });

    // console.log(books);
    //create books/covers by category and add to spectrum
    books.forEach((book) => {
      const containerId = getContainerIdByCategory(book.category);
      const container = document.getElementById(containerId);
      const img = document.createElement('img');
      const cover = document.createElement('img');
      img.src = book.img;
      cover.src = 'png/cover9.jpeg';
      container.appendChild(cover);
      container.appendChild(img);

      cover.classList = 'cover';
      img.classList = 'book';
      img.style.width = '8%';
      img.style.height = 'auto';
      cover.style.width = '8%';
      cover.style.height = '8%';

      const randomX = Math.floor(
        Math.random() * (container.offsetWidth - img.width)
      );
      const randomY = Math.floor(
        Math.random() * (container.offsetHeight - img.height)
      );
      img.style.left = `${randomX}px`;
      img.style.top = `${randomY}px`;
      img.className = 'book';
      img.id = book.title;

      cover.style.left = `${randomX}px`;
      cover.style.top = `${randomY}px`;
    });

    return books;
  }
  //hover menu content
  function createHoverMenu(title, author) {
    const hoverMenu = document.createElement('div');
    hoverMenu.className = 'hover-menu';

    const titleElement = document.createElement('div');
    titleElement.textContent = `Title: ${title}`;
    const authorElement = document.createElement('div');
    authorElement.textContent = `Author: ${author}`;
    hoverMenu.appendChild(titleElement);
    const lineBreak = document.createElement('br');

    hoverMenu.appendChild(titleElement);
    hoverMenu.appendChild(lineBreak);
    hoverMenu.appendChild(authorElement);

    return hoverMenu;
  }
  //assign container id to category
  function getContainerIdByCategory(category) {
    switch (category) {
      case 'dem':
        return 'dem';
        break;
      case 'both':
        return 'both';
        break;
      case 'rep':
        return 'rep';
        break;
      default:
        return 'both';
    }
  }
});


//Title design 
function getRandomOpacity() {
  return Math.random();
}

function applyRandomOpacity(element) {
  var spans = element.querySelectorAll('span');
  spans.forEach(function (span) {
    span.style.opacity = getRandomOpacity();
  });
}

function updateOpacities() {
  var mainTitle = document.getElementById('mainTitle');
  // var subTitle = document.getElementById('subTitle');
  // var author = document.getElementById('author');

  applyRandomOpacity(mainTitle);
  // applyRandomOpacity(subTitle);
  // applyRandomOpacity(author);
}

document.querySelectorAll('span').forEach(function (span) {
  span.style.transition = 'opacity 0.5s ease-in-out';
});

setInterval(updateOpacities, 5000);
