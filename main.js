var arrayCountries = [
   {'it': '<img src="flags/italy.jpg>'},
   {'en': '<img src="flags/england.jpg">'},
   {'fr': '<img src="flags/france.jpg">'},
   {'de': '<img src="flags/germany.jpg">'},
   {'es': '<img src="flags/spain.jpg">'},
   {'jp': '<img src="flags/japan.jpg"'}
];
var creditUrlMov = 'https://api.themoviedb.org/3/movie/';
var creditUrlTv = 'https://api.themoviedb.org/3/tv/';
var posterURL = 'https://image.tmdb.org/t/p/w342';
var moviesGenres = [];
var seriesGenres = [];
//make two ajax call to create two genres array
findMoviesGenres();
findTvShowsGenres();

$(document).ready(function(){
   console.log(moviesGenres);
   console.log(seriesGenres);

   //take the content of the input box and search for a movie
   $('#searchButton').click(function(){
      isClicked = false;
      //take the val of the inputbox
      var itemToSearch  = $('#inputSearch').val();
      // check whether the input is empty
      if(itemToSearch == ''){
         alert('Scrivi nella casella di testo');
      }
      else{
         //make input empty again
         $('#inputSearch').val('');
         //search for movies and tv shows
         searchForMoviesAndTvShows(itemToSearch);

      }
   });

   //take the content of the input box if press enter
   $('#inputSearch').keypress(function(e){
      isClicked = false;
      if(e.which === 13){
         //take the val of the inputbox
         var itemToSearch  = $('#inputSearch').val();
         // check whether the input is empty
         if(itemToSearch == ''){
            alert('Scrivi nella casella di testo');
         }
         else{
            //make input empty again
            $('#inputSearch').val('');
            //search for movies and tv series
            searchForMoviesAndTvShows(itemToSearch);
         }
      }
   });

   //when click on image rotate and shows info and search for additional infos
   $(document).on('click', '.poster-img', function(){
      //assign the movie or tv show id to a variable
      var idMovTv = $(this).siblings('.overlay').find('.info-desc').attr('id');
      //take the movie-list because have to append the names of cast
      var listOfData = $(this).siblings('.overlay').children('.movie_tv-infos');
      //check if it's a movie or a tv show
      var typo = $(this).siblings('.overlay').find('.movieOrTvShow').text();
      if(typo == 'Film'){
         //search for the first five cast members
         findCastMember(idMovTv, creditUrlMov, listOfData);
      }
      else{
         findCastMember(idMovTv, creditUrlTv, listOfData);
      }
      $(this).toggleClass('image-rotate');
      $(this).parents('.poster-cnt').children('.overlay').fadeIn(1500);
   });
   //when click on overlay rotate again the image
   $(document).on('click', '.overlay', function(){
      $(this).parents('.poster-cnt').children('.poster-img').toggleClass('image-rotate');
      $(this).hide();
   });
});

//create an array of object of movies genres
function findMoviesGenres(){
   $.ajax({
      url: 'https://api.themoviedb.org/3/genre/movie/list',
      method: 'GET',
      data: {
         api_key: 'b0cce258bf9e6a44d4d21a5cd65ffdfb'
      },
      success: function(data){
        moviesGenres = data.genres;
      },
      error: function(){
         alert('Errore');
      },
   });
}

//create an array
function findTvShowsGenres(){
   $.ajax({
      url: 'https://api.themoviedb.org/3/genre/tv/list',
      method: 'GET',
      data: {
         api_key: 'b0cce258bf9e6a44d4d21a5cd65ffdfb'
      },
      success: function(data){
         seriesGenres = data.genres;
      },
      error: function(){
         alert('Errore');
      }
   });
}
//make an api call to search for movies
function searchForMoviesAndTvShows(searchItem){
   //empty the list of previous movies searched
   $('.list-info').html('');
   //create a var of the list that contains info
   var listInfo = $('.list-info');
   //make an ajax call to find the movies
   $.ajax({
      url: 'https://api.themoviedb.org/3/search/multi',
      method: 'GET',
      data: {
         api_key: 'b0cce258bf9e6a44d4d21a5cd65ffdfb',
         query: searchItem,
         language: 'it',
      },
      success: function(data){
         //take the results of the ajax call
         var response = data.results;
         console.log(response);
         //check if the array is empty
         if(response.length != 0){
            //make a loop through the array to check every element
            for (var i = 0; i < response.length; i++) {
               printResults(listInfo, response[i]);
            }
         }
         else{
            alert('nessun film e/o serie trovati');
         }
      },
      error: function(){
         alert('Errore');
      }
   });
}

//print results
function printResults(infoList, result){
   //convert the vote into a number between 1 and 5
   var vote = (result.vote_average * 5 / 10).toFixed(0);
   //make stars appears instead of vote
   var fullStars = assignStars(vote);
   //take the language of the movie
   var language = result.original_language;
   //assign flag to a variable
   var flag = assignFlag(language, arrayCountries);
   // check for the poster image. If there's none set a default img
   if(result.poster_path == null){
      var poster = '404.jpg';
   }
   else{
      var poster = posterURL + result.poster_path;
   }
   //check if overview is empty. If so write: "no-info"
   if(result.overview == ""){
      var overview = 'no-info';
   }
   else{
      var overview = result.overview;

   }
   var media = result.media_type;
   //check whether it's a film or a tv show and print results
   if(result.media_type == 'movie'){
      infoList.append('<div class="poster-cnt">' +
      '<img class="poster-img" src="' + poster + '">' +
      '<div class="overlay">' +
      '<div class="movie_tv-infos">' +
      '<div class="list-item"><span id="' + result.id + '" class="info-desc">Tipologia: </span><span class="movieOrTvShow">Film</span></div>' +
      '<div class="list-item"><span class="info-desc">Titolo: </span><span>' + result.title + '</span></div>' +
      '<div class="list-item"><span class="info-desc">Titolo originale: </span><span>' + result.original_title + '</span></div>' +
      '<div class="list-item"><span class="info-desc">Lingua: </span> <span class="flags"> ' + flag + '</span></div>' +
      '<div class="list-item"><span class="info-desc">Voto: </span> <span> ' + fullStars + '</span></div>' +
      '<div class="list-item"><span class="info-desc">Trama: </span> <span> ' + overview + '</span></div>' +
      '</div>' +
      '</div>' +
      '</div>');
   }
   else{
      infoList.append('<div class="poster-cnt">' +
      '<img class="poster-img" src="' + poster + '">' +
      '<div class="overlay">' +
      '<div class="movie_tv-infos">' +
      '<div class="list-item"><span id="' + result.id + '" class="info-desc">Tipologia: </span><span class="movieOrTvShow">Serie TV</span></div>' +
      '<div class="list-item"><span class="info-desc">Titolo: </span><span>' + result.name + '</span></div>' +
      '<div class="list-item"><span class="info-desc">Titolo originale: </span><span>' + result.original_name + '</span></div>' +
      '<div class="list-item"><span class="info-desc">Lingua: </span> <span class="flags"> ' + flag + '</span></div>' +
      '<div class="list-item"><span class="info-desc">Voto: </span> <span> ' + fullStars + '</span></div>' +
      '<div class="list-item"><span class="info-desc">Trama: </span> <span> ' + overview + '</span></div>' +
      '</div>' +
      '</div>' +
      '</div>');
   }
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

//search for 5 cast members
function findCastMember(MovTvId, urlToSearch, dataList){
   dataList.children('.cast-name').remove();
   $.ajax({
      url: urlToSearch + MovTvId + '/credits',
      method: 'GET',
      data: {
         api_key: 'b0cce258bf9e6a44d4d21a5cd65ffdfb',
         language: 'it',
      },
      success: function(data){
         var castMembers = data.cast;
         console.log(castMembers);
         if(castMembers.length != 0){
            var i = 0
            do{
               dataList.append('<div class="list-item cast-name"><span class="info-desc">Cast member: </span><span>' + castMembers[i].name +'</span></div>');
               i++;
            }while((i < castMembers.length) && (i <= 5));
         }
         else{
            dataList.append('<div class="list-item"><span class="info-desc">Cast: </span><span> no cast found </span></div>');
         }

      },
      error: function(){
         alert('Error');
      }
   });
}

//search and print genres
function findGenres(){

}
