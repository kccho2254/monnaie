// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
    $(".change-completed").on("click", function(event) {
      var id = $(this).data("id");
      var newCompleted = $(this).data("newCompleted");
  
      var newCompletedState = {
        completed: newCompleted
      };
  
      // Send the PUT request.
      $.ajax("/api/tasks/" + id, {
        type: "PUT",
        data: newCompletedState
      }).then(
        function() {
          console.log("changed Completed to", newCompleted);
          // Reload the page to get the updated list
          location.reload();
        }
      );
    });
  
    $(".create-form").on("submit", function(event) {
      // Make sure to preventDefault on a submit event.
      event.preventDefault();
      console.log("test")
      var newTask = {
        task_name: $("#ca").val().trim(),
        completed: false
      };
  
      // Send the POST request.
      $.ajax("/api/tasks", {
        type: "POST",
        data: newTask
      }).then(
        function() {
          console.log("created new task");
          // Reload the page to get the updated list
          location.reload();
        }
      );
    });
  });
  