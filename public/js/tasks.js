
// add a calendar popup to the due date
$( function() {
  $( "#datepicker" ).datepicker();
} );

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
      taskDesc: $("#ta").val().trim(),
      dueDate: $("#datepicker").val(),
      completed: false
    };
    console.log(newTask);

    // Send the POST request.
    $.ajax("/api/tasks", {
      type: "POST",
      data: newTask
    }).then(
      function() {
      console.log("created new task");
      // Reload the page to get the updated list
      location.reload();
    });
  });
});




// $(document).ready(function() {
//   // Container holds all of our tasks
//   var container = $("#container");
//   var postCategorySelect = $("#category");
//   // Click events for the edit and delete buttons
//   $(document).on("click", "button.delete", handleTaskDelete);
//   $(document).on("click", "button.edit", handleTaskEdit);
//   // Variable to hold our tasks
//   var tasks;

//   $.get("/api/user_data").then(data => {
//     initializeRows();
//   });

// //     $.get("/api/posts" + authorId, function(data) {
// //       console.log("Posts", data);
// //       posts = data;
// //       if (!posts || !posts.length) {
// //         displayEmpty(author);
// //       }
// //       else {
// //         
// //       }
// //     });
// //   }

//   // This function does an API call to delete tasks
//   function deleteTask(id) {
//     $.ajax({
//       method: "DELETE",
//       url: "/api/tasks/" + id
//     })
//       .then(function() {
//         getTasks(postCategorySelect.val());
//       });
//   }

// // InitializeRows handles appending all of our constructed post HTML inside blogContainer
//   function initializeRows() {
//     container.empty();
//     var postsToAdd = [];
//     for (var i = 0; i < posts.length; i++) {
//       postsToAdd.push(createNewRow(posts[i]));
//     }
//     container.append(postsToAdd);
//   }

//   // This function constructs a post's HTML
//   function createNewRow(post) {

//     var taskList = $("<li>");    
//     var completeBtn = $("<button>");
//     var editBtn = $("<button>");
//     var deleteBtn = $("<button>");
//     var newTaskDesc = $("<h3>");
//     var newTaskDate = $("<small>");

//     deleteBtn.text("x");
//     deleteBtn.addClass("delete btn btn-danger");
//     editBtn.text("EDIT");
//     editBtn.addClass("edit btn btn-info");

//     if (completed === false) {
//       $("#incomplete").append(taskList);
//       taskList.append(newTaskDesc);
//       taskList.append(newTaskDate);
//       taskList.append(completeBtn);
//       taskList.append(editBtn);
//     } else {
//       $("complete").append(taskList);
//       taskList.append(newTaskDesc);
//       taskList.append(newTaskDate);
//       taskList.append(deleteBtn);
//     }    

//     newTaskDesc.text(post.desc + " ");
//     newTaskDate.text(formattedDate);
//     newTaskDesc.append(newTaskDate);;
//     newPostCard.data("post", post);
//     return newPostCard;
//   }

//   // This function figures out which post we want to delete and then calls deletePost
//   function handleTaskDelete() {
//     var currentTask = $(this)
//       .parent()
//       .parent()
//       .data("post");
//     deleteTask(currentTask.id);
//   }

//   // This function figures out which post we want to edit and takes it to the appropriate url
//   function handleTaskEdit() {
//     var currentTask = $(this)
//       .parent()
//       .parent()
//       .data("post");
//     window.location.href = "/cms?post_id=" + currentTask.id;
//   }

// //   // This function displays a message when there are no posts
// //   function displayEmpty(id) {
// //     var query = window.location.search;
// //     var partial = "";
// //     if (id) {
// //       partial = " for Author #" + id;
// //     }
// //     blogContainer.empty();
// //     var messageH2 = $("<h2>");
// //     messageH2.css({ "text-align": "center", "margin-top": "50px" });
// //     messageH2.html("No posts yet" + partial + ", navigate <a href='/cms" + query +
// //     "'>here</a> in order to get started.");
// //     blogContainer.append(messageH2);
// //   }

// });
  