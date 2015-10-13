$(function() {


	// SETUP
	// -----

	
	// initialize Parse
	Parse.initialize("j5f9Aw7ZZ4ISoPnF5PvumVj83Pf5YMdVpSTFPdrX", "M7FwDwNkM3v9IJvKvE9TYCCwRrMzL3QxrLjwBwJf");

	// db custom classes
	var PostClass = Parse.Object.extend('Post');
	var LikeClass = Parse.Object.extend('Like');

	// post search specifications
	var postSearchLimit = 5;
	var postSkip = 0;

	// are there already posts on page? This helps with letting the user what is going on
	var postsOnPage = false;

	// modify the current page setup if the user is cached or not
	adjustUI(Parse.User.current());

	// speaking of which, if the user is cached, load some posts, if there are any
	if (Parse.User.current())
		getPosts(postSearchLimit, postSkip = 0);

	// forms
	var $actionForm = $('#actionForm');
	var $blogForm = $('#blogForm');

	// buttons
	var $signInBtn = $('#signInBtn');
	var $signUpBtn = $('#signUpBtn');
	var $loadMorePostsBtn = $('#loadMorePostsBtn');
	var $actionFormSubmitBtn = $('#actionFormSubmitBtn');
	var $logOutBtn = $('#logOutBtn');

	// form fields
	var $usernameField = $('#usernameField');
	var $passwordField = $('#passwordField');
	var $blogTitle = $('#blogTitle');
	var $blogDescription = $('#blogDescription');
	var $blogContent = $('#blogContent');


	// EVENT HANDLING
	// --------------


	// logout button pressed
	$logOutBtn.click(function(e) {
		// prevent default action, which often is reloading the page for buttons
		e.preventDefault();
		// modify the UI for someone that can't access the blog
		adjustUI(false);
	});

	// signin button is pressed
	$signInBtn.click(function(e) {
		// signin by passing form inputs and a reference to the button that was pressed to notify the user about what is going on
		signIn(getFormInputs(), $(e.currentTarget));
	});

	// signup button is pressed
	$signUpBtn.click(function(e) {
		// signup by passing form inputs and a reference to the button that was pressed to notify the user about what is going on
		signUp(getFormInputs(), $(e.currentTarget));
	});

	// load more posts button is pressed
	$loadMorePostsBtn.click(function() {
		// as long as there are already posts on the page, try and get more posts
		if (postsOnPage)
			getPosts(postSearchLimit, postSkip);
	});

	// blog creation form was submitted
	$blogForm.submit(function(e) {
		// prevent the default action, which for forms is to reload the page
		e.preventDefault();
		// create the post by passing in the post parameters, and also a reference to the button that was pressed to notify the user about what is going on
		createPost(getPostInputs(), $(e.currentTarget).find('#createPostBtn'));
	});

	// delete post button pressed
	$('body').on('click', '#deletePost', function(e) {
		// delete the post by passing in the post id, a reference to the current post, and a reference to the button that was pressed to notify the user about what is going on
		deletePost($(e.currentTarget).attr('data-id'), $(e.currentTarget).closest('article'), $(e.currentTarget));
	});

	// like post button pressed
	$('body').on('click', '#likePost', function(e) {
		// like the post by passing in the post id, and a reference to the button that was pressed to notify the user about what is going on
		likePost($(e.currentTarget).attr('data-id'), $(e.currentTarget));
	});


	// USER ACTIONS
	// ------------


	// give signIn a user object, which looks like { username : 'some-username' , password : '•••••••••••' }, and a reference to the button that was pressed
	function signIn(user, signInButton) {
		// notify the user of progress

		// verify parameters

			// sign in the user


					// modify the UI for a signed in user

					// reset sign up button for later use

					// get posts by blog author and default postSkip to 0



					// display error code and message

					// reset sign up button



	}

	// give signUp a user object, which looks like { username : 'some-username' , password : '•••••••••••' }, and a reference to the button that was pressed
	function signUp(user, signUpButton) {
		// notify user of progress


		// verify parameters

			// create a new user object


			// use object literal notation to set the values for this user object

			

				// can this user publish blog posts?
			


					// modify the UI for a signed in user
			
					// reset sign up button for later use
			
					// get posts by blog author and default postSkip to 0
			


					// display error code and message
			
					// reset sign up button
			



	}


	// POSTS
	// -----


	// give createPost a post object, which takes the form { title : 'Some Title' , description : 'Some Description' , content : 'Some Content' }, generated from getPostInputs
	function createPost(post, createButton) {
		// notify user of progress


		// create permissions for post
		
		// public read
		
		// public no write
		
		// write access for author
		

		// create new post object - watch out for post in the function parameters and newPost here
		

		// set post properties with .set() notation

		// set author, title, description, content
		



		// set permissions for post
		
		// create new post
		

				// show the blog post on the page
		
				// there is now a post on the page
		
				// increment the post skip
		
				// notify user of successful post
		


				// display error code and message
		
				// reset create post button
		


	}

	// give getPosts a limit (on the number of posts to retrieve) and a skip (to skip a certain amount of posts, based on how many were retrieved beforehand)
	function getPosts(limit, skip) {
		// query for blog posts
	
		// set a limit on the amount of post to retrieve, for paginating purposes
	
		// set a skip value to skip a certain amount of posts after some have already been displayed
	
		// get the posts
	

				// add number of posts to skip parameter
	
				// no posts
	
					// posts already on page
	
						// let the user know there are no more posts
	

						// let the user know there are no posts yet
	
				// at least one post
	
					// less than 5 posts (less than postSearchLimit)
	
						// display the posts on the screen
	

						// let the user know there are no posts yet
	
					// at least 5 posts
	
						// display the posts on the screen
	

						// let the user know they can get more posts
	




				// display error code and message
	


	}

	// give displayPost a post object to display on the page
	function displayPost(post) {
		// there is at least one post on the page
		postsNowOnPage();
		// disply post
		$('.blog__content').prepend(_.template($('#blogTemplate').html(), { post : post }));
	}

	// give likePost a postId to like the blog post, and a reference to the button that was pressed
	function likePost(postId, likeButton) {
		// notify the user that the like is in progress


		// create new post instance and sets its id to the current post that's being liked



		// create permissions for like

		// public read

		// public no write

		// write access for liking user


		// create new like object

		// set permissions for like


			// set properties with object literal notation




				// notify user of successful liking



				// display error code and message

				// reset like button



	}

	// give deletePost a postId to delete the blog post, the originalPost dom element to remove it from the page, and a reference to the button that was pressed
	function deletePost(postId, originalPost, deleteButton) {
		// notify user of progress


		// create new post instance and sets its id to the current post that's being deleted


		// destroy this post


				// remove it from the page



				// display error code and message

				// reset delete button



	}


	// HELPERS
	// -------


	// take the inputted values from the post creation form
	function getPostInputs() {
		return { title : $blogTitle.val() , description : $blogDescription.val() , content : $blogContent.val() };
	}

	// take the inputted values from the signup/signin form
	function getFormInputs() {
		return { username : $usernameField.val() , password : $passwordField.val() };
	}

	// modify UI elements based on where the user is logged in or not
	function adjustUI(userIsSignedIn) {
		if (userIsSignedIn) {
			// hide access form
			$('#accessContainer').slideUp(250);
			// now loading posts
			$('.blog__warning').text('Loading Content ...');
			// show the logout button
			$('#logOutBtn')
				.show()
				.text('Logout of ' + Parse.User.current().get('username'));
			// display blog creation form if current user has access
			if (Parse.User.current().get('postingAbility'))
				$('#blogForm').slideDown(250);
		} else {
			// logout
			Parse.User.logOut();
			// show access form
			$('#accessContainer').slideDown(250);
			// signup or signin to view the blog
			$('.blog__warning').text('Sign in or sign up above to view content');
			// hide the logout button
			$('#logOutBtn').hide();
			// hide the blog form
			$('#blogForm').slideUp(250);
			// remove blog content
			$('.blog__content').html('');
			// reset postSkip
			postSkip = 0;
		}
	}

	// modifies the postsOnPage variable to true to let us know when there are posts on the page
	function postsNowOnPage() { postsOnPage = true; }

});