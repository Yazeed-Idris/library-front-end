const baseUrl = 'http://localhost:3000';
const librarianUrl = './Books.html';
const memberUrl = './MyBooks.html';
let memberInfo = null;
let librarianInfo = null;
const xhttp = new XMLHttpRequest();


async function login() {
    const email = document.getElementById("email");

    if (email.value.toString().startsWith('1')) {
        // login librarian
        // console.log('librarian');

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 & xhttp.status === 200) {
                const response = JSON.parse(xhttp.response);
                console.log(response);
                window.sessionStorage.setItem('librarianInfo', JSON.stringify(response));
                window.location.href = librarianUrl;
            }
        };

        xhttp.open("GET", baseUrl + '/librarian/' + email.value.toString(), true);
        xhttp.send();

    } else if (email.value.toString().startsWith('2')) {
        // login member
        // console.log('member');
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                console.log(xhttp.response)
                const response = JSON.parse(xhttp.response);
                console.log(response);
                window.sessionStorage.setItem('memberInfo', JSON.stringify(response));
                window.location.href = memberUrl;
            }
        };

        xhttp.open("GET", baseUrl + '/member/' + email.value.toString(), true);
        xhttp.send();

    }
}

function logMemberInfo() {
    memberInfo = JSON.parse(window.sessionStorage.getItem('memberInfo'));
    console.log(memberInfo);
}

async function addBook() {
    const quantity = document.getElementById('quantity').value;

    const bookItem = {
        state: true,
        book: parseInt(document.getElementById('ISBN').value), // needs revision
    }

    console.log(parseInt(document.getElementById('ISBN').value));
    const book = {
        ISBN: parseInt(document.getElementById('ISBN').value),
        title: document.getElementById('title').value,
        subject: document.getElementById('subject').value,
        publicationDate: document.getElementById('publicationDate').value,
        author: parseInt(document.getElementById('author').value),
    }

    await fetch(baseUrl + '/librarian/book', {
        method: 'POST',
        body: JSON.stringify(book),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });

    for (let i = 0; i < quantity; i++) {
        await fetch(baseUrl + '/librarian/book-item', {
            method: 'POST',
            body: JSON.stringify(bookItem),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            });
    }

}

function deleteBook() {
    const deleteBookISBN = parseInt(document.getElementById('ISBNDelete').value);

    fetch(baseUrl + '/librarian/book/' + deleteBookISBN, {
        method: 'DELETE',
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function requestBook() {
    const bookName = document.getElementById('requestedBookName');

    alert(bookName.value + " was successfully requested");
}

function addMember() {
    const member = {
        personId: parseInt(document.getElementById('memberId').value),
        name: document.getElementById('memberName').value,
        phone: document.getElementById('memberPhone').value,
        memberBarcode: document.getElementById('memberBarcode').value,
    }

    fetch(baseUrl + '/librarian/member', {
        method: 'POST',
        body: JSON.stringify(member),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function deleteMember() {
    const memberId = document.getElementById('memberIdDelete').value;

    fetch(baseUrl + '/librarian/member/' + memberId, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }).then(function (response) {
        return response.json();
    })
        .then(function (data) {
            console.log(data);
        });
}

async function borrowBook() {
    const ISBN = parseInt(document.getElementById('ISBNBorrow').value);
    const memberId = parseInt(JSON.parse(window.sessionStorage.getItem('memberInfo'))['personId']);

    await fetch(baseUrl + '/member/borrow/' + ISBN + '/' + memberId, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
    location.reload();
}

function reserveBook() {
    const ISBN = parseInt(document.getElementById('ISBNReserve').value);
    const memberId = parseInt(JSON.parse(window.sessionStorage.getItem('memberInfo'))['personId']);

    fetch(baseUrl + '/member/reserve/' + ISBN + '/' + memberId, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function renewBook() {
    const barcode = parseInt(document.getElementById('barcodeRenew').value);

    fetch(baseUrl + '/member/renew/' + barcode, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

async function returnBook() {
    const memberId = parseInt(JSON.parse(window.sessionStorage.getItem('memberInfo'))['personId']);
    const barcode = parseInt(document.getElementById('barcodeReturn').value);

    await fetch(baseUrl + '/member/return/' + barcode + '/' + memberId, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            // return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
    location.reload();
}

async function loadMemberBooks() {
    let booksView = document.getElementById('memberBooksView');
    if (!booksView)
        return;
    booksView.innerHTML = '';
    const memberId = parseInt(JSON.parse(window.sessionStorage.getItem('memberInfo'))['personId']);

    let booksArray = [];

    await fetch(baseUrl + '/member/books/' + memberId, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            booksArray = data;
        });

    for (let i = 0; i < booksArray.length; i++) {
        booksView.innerHTML += `
        <tr>
      <th scope="row">${i+1}</th>
      <td>${booksArray[i].ISBN}</td>
      <td>${booksArray[i].TITLE}</td>
      <td>${booksArray[i].NAME}</td>
      <td>${booksArray[i].BARCODE}</td>
    </tr>
        `
    }
}

async function loadLibraryBooks() {
    const booksView = document.getElementById('searchView');
    if (!booksView)
        return;
    booksView.innerHTML = '';

    let booksArray = [];

    await fetch(baseUrl + '/librarian/books/all',  {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            booksArray = data;
        });

    for (let i = 0; i < booksArray.length; i++) {
        booksView.innerHTML += `
        <tr>
      <td>${booksArray[i].ISBN}</td>
      <td>${booksArray[i].title}</td>
      <td>${booksArray[i].subject}</td>
      <td>${booksArray[i].publicationDate}</td>
    </tr>
        `
    }
}

async function loadInactiveMembers() {
    const view = document.getElementById('inactiveMembers');
    if (!view)
        return;
    view.innerHTML = '';

    let array = [];

    await fetch(baseUrl + '/librarian/members/inactive',  {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            array = data;
        });



    for (let i = 0; i < array.length; i++) {
        view.innerHTML += `
        <tr>
      <td>${array[i]['PERSON_ID']}</td>
      <td>${array[i]['NAME']}</td>
      <td>${array[i]['PHONE']}</td>
      <td>${array[i]['MEMBER_BARCODE']}</td>
    </tr>
        `
    }
}

async function loadLateMembers() {
    const view = document.getElementById('lateMembersView');
    if (!view)
        return;
    view.innerHTML = '';

    let array = [];

    await fetch(baseUrl + '/librarian/members/late',  {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            array = data;
        });



    for (let i = 0; i < array.length; i++) {
        view.innerHTML += `
        <tr>
      <td>${array[i]['PERSON_ID']}</td>
      <td>${array[i]['NAME']}</td>
      <td>${array[i]['PHONE']}</td>
      <td>${array[i]['MEMBER_BARCODE']}</td>
    </tr>
        `
    }
}

async function loadPenalties() {
    const view = document.getElementById('penaltiesView');
    if (!view)
        return;
    view.innerHTML = '';

    let array = [];

    await fetch(baseUrl + '/librarian/members/penalties',  {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            array = data;
        });



    for (let i = 0; i < array.length; i++) {
        view.innerHTML += `
        <tr>
      <td>${array[i]['MEMBER_NAME']}</td>
      <td>${array[i]['PENALTY_AMOUNT']}</td>
      <td>${array[i]['MEMBER_ID']}</td>
    </tr>
        `
    }
}

async function loadOutstandingMembers() {
    const view = document.getElementById('outstandingMembersView');
    if (!view)
        return;
    view.innerHTML = '';

    let array = [];

    await fetch(baseUrl + '/librarian/members/outstanding',  {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            array = data;
        });



    for (let i = 0; i < array.length; i++) {
        view.innerHTML = `
        <tr>
      <td>${array[i]['PERSON_ID']}</td>
      <td>${array[i]['NAME']}</td>
      <td>${array[i]['PHONE']}</td>
      <td>${array[i]['MEMBER_BARCODE']}</td>
    </tr>
        `
    }
}

async function searchBooks() {
    const value = document.getElementById('searchValue').value;
    const searchType = document.getElementById('searchType').value;

    let booksArray = [];

    await fetch(baseUrl + '/member/books?searchCondition=' + searchType + '&value=' + value,  {
        method: 'GET',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            booksArray = data;
        });

    const searchView = document.getElementById('searchView');
    searchView.innerHTML = '';


    for (let i = 0; i < booksArray.length; i++) {
        searchView.innerHTML += `
        <tr>
      <td>${booksArray[i].ISBN}</td>
      <td>${booksArray[i].title}</td>
      <td>${booksArray[i].subject}</td>
      <td>${booksArray[i].publicationDate}</td>
    </tr>
        `
    }
}


function logout() {
    window.sessionStorage.setItem('librarianInfo', JSON.stringify({}));
    window.sessionStorage.setItem('memberInfo', JSON.stringify({}));
}

async function registerAccount() {
    const account = {
        personId: parseInt(document.getElementById('id').value),
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
    }

    if (document.getElementById('registrationOption').value === 'librarian') {
        await fetch(baseUrl + '/librarian/librarian', {
            method: 'POST',
            body: JSON.stringify(account),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            });
    } else {
        await fetch(baseUrl + '/librarian/author', {
            method: 'POST',
            body: JSON.stringify(account),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            });
    }
}

loadInactiveMembers().then();
loadLibraryBooks().then();
loadMemberBooks().then();
loadLateMembers().then();
loadPenalties().then();
loadOutstandingMembers().then();
