var arrayCountries = [
   {'it': '<img src="flags/italy.jpg>'},
   {'en': '<img src="flags/england.jpg">'},
   {'fr': '<img src="flags/france.jpg">'},
   {'de': '<img src="flags/germany.jpg">'},
   {'es': '<img src="flags/spain.jpg">'},
   {'jp': '<img src="flag/japan.jpg"'}
];
var movieURL = 'https://api.themoviedb.org/3/search/movie';
var tvURL = 'https://api.themoviedb.org/3/search/tv';
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
         //search for movies
         searchForMoviesAndTvShows(itemToSearch, movieURL);
         //search for tv series
         searchForMoviesAndTvShows(itemToSearch, tvURL);
      }
   });
});

//make an api call to search for movies
function searchForMoviesAndTvShows(searchItem, URLtoSearch){
   //empty the list of previous movies searched
   $('.list-info').html('');
   //create a var of the list that contains info
   var listInfo = $('.list-info');
   //make an ajax call to find the movies
   $.ajax({
      url: URLtoSearch,
      method: 'GET',
      data: {
         api_key: 'b0cce258bf9e6a44d4d21a5cd65ffdfb',
         query: searchItem,
         language: 'it'
      },
      success: function(data){
         //take the results of the ajax call
         var response = data.results;
         console.log(response);
         if(response.length != 0){
            for (var i = 0; i < response.length; i++) {
               //convert the vote into a number between 1 and 5
               var vote = (response[i].vote_average * 5 / 10).toFixed(0);
               //make stars appears instead of vote
               var fullStars = assignStars(vote);
               //take the language of the movie
               var language = response[i].original_language;
               //assign flag to a variable
               var flag = assignFlag(language, arrayCountries);
               //check whether it's a film or a tv show
               if(URLtoSearch === 'https://api.themoviedb.org/3/search/movie'){
                  listInfo.append('<div class="movie_tv-infos">' +
                  '<div class="list-item">Titolo:<span>' + response[i].title + '</span></div>' +
                  '<div class="list-item">Titolo originale:<span>' + response[i].original_title + '</span></div>' +
                  '<div class="list-item">Lingua: <span> ' + flag + '</span></div>' +
                  '<div class="list-item">Voto: <span> ' + fullStars + '</span></div>' +
                  '</div>');
               }
               else{
                  listInfo.append('<div class="movie_tv-infos">' +
                  '<div class="list-item">Titolo:<span>' + response[i].name + '</span></div>' +
                  '<div class="list-item">Titolo originale:<span>' + response[i].original_name + '</span></div>' +
                  '<div class="list-item">Lingua: <span> ' + flag + '</span></div>' +
                  '<div class="list-item">Voto: <span> ' + fullStars + '</span></div>' +
                  '</div>');
               }
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

//convert movie vote into stars
function assignStars(rating){
   var stars = '';
   for (var i = 1; i <= 5; i++) {
      //if the the stars is under the rating value it will be colored;
      if(i <= rating){
         stars += '<span class="stars colored"><i class="fas fa-star"></i></span>';

      }
      else{
         stars += '<span class="stars"><i class="far fa-star"></i></span>';
      }
   }
   return stars;
}
//search if a flag for a specific language exist
function assignFlag(spokenLanguage , arrCountries){
   var isFound = false;
   var count = 0;
   var icon = '';
   do{
      if(arrCountries[count].hasOwnProperty(spokenLanguage)){
         icon = arrCountries[count][spokenLanguage];
         isFound = true;
      }
      else{
         count++;
      }
   }while((!isFound) && (count < arrCountries.length));
   //check if has found something
   if(isFound){
      return icon;
   }
   else{
      return icon = spokenLanguage + ' - no flag found';
   }
}
