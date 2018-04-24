$(document).ready(function(){
   //take the content of the input box and search for a movie
   $('#searchButton').click(function(){
      //take the val of the inputbox
      var itemToSearch  = $('#inputSearch').val();
      // check whether the input is empty
      if(itemToSearch == ''){
         alert('Scrivi nella casella di testo');
      }
      else{
         //make input empty again
         $('#inputSearch').val('');
         searchForMovies(itemToSearch);
      }
   });
});

//make an api call to search for movies
function searchForMovies(searchItem){
   //empty the list of previous movies searched
   $('.list-info').html('');
   //create a var of the list that contains info
   var listInfo = $('.list-info');
   $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
         api_key: 'b0cce258bf9e6a44d4d21a5cd65ffdfb',
         query: searchItem,
         language: 'it-IT'
      },
      success: function(data){
         //take the results of the ajax call
         var response = data.results;
         console.log(response);
         console.log(response.length);
         if(response.length != 0){
            for (var i = 0; i < response.length; i++) {
               listInfo.append('<div class="movie-infos">' +
                               '<div class="list-item">Titolo: <span>' + response[i].title + '</span></div>' +
                               '<div class="list-item">Titolo originale: <span>' + response[i].original_title + '</span></div>' +
                               '<div class="list-item">Lingua: <span>' + response[i].original_language + '</span></div>' +
                               '<div class="list-item">Titolo: <span>' + response[i].vote_average + '</span></div>' +
                               '</div>');
            }
         }
         else{
            alert('Nessun film trovato!');
         }
      },
      error: function(){
         alert('Errore');
      }
   });
}
