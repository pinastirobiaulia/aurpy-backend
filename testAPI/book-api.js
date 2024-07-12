const book = async () => {
  const books = await fetch("http://localhost:3000/books");
  console.log(books);
};
