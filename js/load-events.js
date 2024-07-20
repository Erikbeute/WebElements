fetch('../data/eventdata.json')
  .then(response => response.json())
  .then(data => {
    posts = data;
    doStuff();  
  })
  .catch(error => console.error('Error loading events:', error));




//   document.addEventListener('DOMContentLoaded', function () {
//     fetch('data/eventdata.json')
//         .then(response => response.json())
//         .then(data => {
//             posts = data;
//             doStuff();
//         })
//         .catch(error => console.error('Error loading events:', error));
// });