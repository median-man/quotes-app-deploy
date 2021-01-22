// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(() => {
  $(".delquote").on("click", function (event) {
    const id = $(this).data("id");

    // Send the DELETE request.
    $.ajax(`/api/quotes/${id}`, {
      type: "DELETE",
    }).then(() => {
      console.log("deleted id ", id);
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(".create-form").on("submit", (event) => {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    const newQuote = {
      author: $("#auth").val().trim(),
      quote: $("#quo").val().trim(),
    };

    // Send the POST request.
    $.ajax("/api/quotes", {
      type: "POST",
      data: newQuote,
    }).then(() => {
      console.log("created new quote");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(".update-form").on("submit", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    const updatedQuote = {
      author: $("#auth").val().trim(),
      quote: $("#quo").val().trim(),
    };

    const id = $(this).data("id");

    // Send the POST request.
    $.ajax(`/api/quotes/${id}`, {
      type: "PUT",
      data: updatedQuote,
    }).then(() => {
      console.log("updated quote");
      // Reload the page to get the updated list
      location.assign("/");
    });
  });
});
