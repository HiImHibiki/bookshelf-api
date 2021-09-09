const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } =
        request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess && name && readPage <= pageCount) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const index = books.findIndex((note) => note.id === id);
    books.splice(index, 1);
    let errorCode = 500;
    let errorMsg = "Buku gagal ditambahkan";
    if (!name) {
        errorCode = 400;
        errorMsg = "Gagal menambahkan buku. Mohon isi nama buku";
    }
    if (readPage > pageCount) {
        errorCode = 400;
        errorMsg =
            "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
    }

    const response = h.response({
        status: "fail",
        message: errorMsg,
    });
    response.code(errorCode);
    return response;
};

const getAllBooksHandler = (request, h) => {
    let allBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const {
        name: queryName,
        reading: queryReading,
        finished: queryFinished,
    } = request.query;

    if (queryName) {
        allBooks = books
            .filter((book) => book.name.toLowerCase().includes(queryName.toLowerCase()))
            .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }));
    }

    if (queryReading == 0) {
        allBooks = books
            .filter((book) => book.reading === false)
            .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }));
    }
    if (queryReading == 1) {
        allBooks = books
            .filter((book) => book.reading === true)
            .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }));
    }

    if (queryFinished == 0) {
        allBooks = books
            .filter((book) => book.finished === false)
            .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }));
    }
    if (queryFinished == 1) {
        allBooks = books
            .filter((book) => book.finished === true)
            .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }));
    }

    const response = h.response({
        status: "success",
        data: {
            books: allBooks,
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: "success",
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } =
        request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((note) => note.id === bookId);

    if (index !== -1 && name && readPage <= pageCount) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }

    let errorCode = 404;
    let errorMsg = "Gagal memperbarui buku. Id tidak ditemukan";
    if (!name) {
        errorCode = 400;
        errorMsg = "Gagal memperbarui buku. Mohon isi nama buku";
    }
    if (readPage > pageCount) {
        errorCode = 400;
        errorMsg =
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
    }

    const response = h.response({
        status: "fail",
        message: errorMsg,
    });
    response.code(errorCode);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((note) => note.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
