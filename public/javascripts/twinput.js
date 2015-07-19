if (typeof jQuery === 'undefined') { throw new Error('Twinput\'s JavaScript requires jQuery') };

var page = 1
var per_page = 10
var tweet_count = 0;
var total_pages = 0;
var removed = [];

// getTweetCount(String) -> DOM -- check for presence of event_id (via event.jade), then get tweet count for event / all.
//
	
function getTweetCount() {
		if (event_id !== undefined) {
		console.log("def an event id...");
		$.post("/tweets/get_tweet_count", {event_id: event_id}, function(data, status) {
			tweet_count = data.tweet_count;
			total_pages = (tweet_count / per_page) + 1;
			$('.counts').text(page + " / " + total_pages);
		});
	}
	else {
		$.post("/tweets/get_tweet_count", {event: null}, function(data, status) {
			tweet_count = data.tweet_count;
			total_pages = (tweet_count / per_page) + 1;
			$('.counts').text(page + " / " + total_pages);
		});
	}
};

function loadFirstPage() {
	if (event_id !== undefined) {
		console.log("def an event id so should get the page...");
		$.post("/tweets/get_tweet_page", {page: page, per_page: per_page, event_id: event_id}, function(data, status) {
		$('.tweets-panel').html(data);
	});

	}
	else {
		$.post("/tweets/get_tweet_page", {page: page, per_page: per_page}, function(data, status) {
		$('.tweets-panel').html(data);
	});
	}
};

function loadPreviousPage(){
	if (page > 1) {
		--page;
		if (event_id !== undefined) {
			$.post("/tweets/get_tweet_page", {page: page, per_page: per_page, event_id: event_id}, function(data, status){
			$('.tweets-panel').html(data);
				$('.counts').text(page + " / " + total_pages);
			});
		}
		else {
			$.post("/tweets/get_tweet_page", {page: page, per_page: per_page}, function(data, status){
				$('.tweets-panel').html(data);
					$('.counts').text(page + " / " + total_pages);
			});
		};
	}
}

function loadNextPage() {
	if (page < total_pages) {
			++page
			if (event_id !== undefined) {
				$.post("/tweets/get_tweet_page", {page: page, per_page: per_page, event_id: event_id}, function(data, status){
				$('.tweets-panel').html(data);
					$('.counts').text(page + " / " + total_pages);
				});
			}
			else {
				$.post("/tweets/get_tweet_page", {page: page, per_page: per_page}, function(data, status){
				$('.tweets-panel').html(data);
					$('.counts').text(page + " / " + total_pages);
				});
			};
    }
}


$(document).ready(function(){
	// get tweet count for view
	getTweetCount();

	// load page 1
	loadFirstPage();
	
	// load previous page
	$(".prev").click(function(){loadPreviousPage()});
	
	// load next page
	$(".next").click(function(){loadNextPage()});
	
	//remove item from list and add another to page
	//
	
	// $(".remove").click(function(){removeAndAddOne()});
	
});
