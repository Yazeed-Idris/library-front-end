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
        bookId: parseInt(document.getElementById('ISBN').value), // needs revision
    }

    console.log(parseInt(document.getElementById('ISBN').value));
    const book = {
        ISBN: parseInt(document.getElementById('ISBN').value),
        title: document.getElementById('title').value,
        subject: document.getElementById('subject').value,
        publicationDate: document.getElementById('publicationDate').value,
        authorPersonId: document.getElementById('author').value,
    }

    fetch(baseUrl + '/librarian/book', {
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
        .then(function (response){
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
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function deleteMember() {
    const memberId = document.getElementById('memberIdDelete').value;

    fetch(baseUrl+'/librarian/member/' + memberId, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }).then(function (response){
        return response.json();
    })
        .then(function (data) {
            console.log(data);
        });
}

function borrowBook() {
    const ISBN = parseInt(document.getElementById('ISBNBorrow').value);

    fetch(baseUrl + '/member/borrow/' + ISBN, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function logout() {
    // logout
}
