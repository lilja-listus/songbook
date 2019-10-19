$(document).ready(() => {
  $(".delete-song").on("click", e => {
    $target = $(e.target);
    const id = $target.attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/songs/" + id,
      success: response => {
        alert("Deleting Song");
        window.location.href = "/";
      },
      error: err => {
        console.log(err);
      }
    });
  });
});
