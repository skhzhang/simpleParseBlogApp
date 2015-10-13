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
		signInButton.text('Signing in ...');

		// verify parameters
		if (user.username.length && user.password.length) {
			// sign in the user
			Parse.User.logIn(user.username, user.password, {
				success: function(user) {
					// modify the UI for a signed in user
					adjustUI(Parse.User.current());
					// reset sign up button for later use
					signInButton.text('Already have an account?');
					// get posts by blog author and default postSkip to 0
					getPosts(postSearchLimit, postSkip = 0);
				},
				error: function(user, error) {
					// display error code and message
					console.log(error.code + " " + error.message);
					// reset sign up button
					signInButton.text('Already have an account?');
				}
			});
		}
	}

	// give signUp a user object, which looks like { username : 'some-username' , password : '•••••••••••' }, and a reference to the button that was pressed
	function signUp(user, signUpButton) {
		// notify user of progress
		signUpButton.text('Signing up ...');

		// verify parameters
		if (user.username.length && user.password.length) {
			// create a new user object
			var newUser = new Parse.User();

			// use object literal notation to set the values for this user object
			newUser.signUp({
				username 		: user.username,
				password 		: user.password,
				// can this user publish blog posts?
				postingAbility 	: false
			}, {
				success: function(user) {
					// modify the UI for a signed in user
					adjustUI(Parse.User.current());
					// reset sign up button for later use
					signUpButton.text('Not signed up yet?');
					// get posts by blog author and default postSkip to 0
					getPosts(postSearchLimit, postSkip = 0);
				},
				error: function(user, error) {
					// display error code and message
					console.log(error.code + " " + error.message);
					// reset sign up button
					signUpButton.text('Not signed up yet?');
				}
			});
		}
	}


	// POSTS
	// -----


	// give createPost a post object, which takes the form { title : 'Some Title' , description : 'Some Description' , content : 'Some Content' }, generated from getPostInputs
	function createPost(post, createButton) {
		// notify user of progress
		createButton.val('Creating post ...');

		// create permissions for post
		var ACL = new Parse.ACL();
		// public read
		ACL.setPublicReadAccess(true);
		// public no write
		ACL.setPublicWriteAccess(false);
		// write access for author
		ACL.setWriteAccess(Parse.User.current(), true);

		// create new post object - watch out for post in the function parameters and newPost here
		var newPost = new PostClass();

		// set post properties with .set() notation

		// set author, title, description, content
		newPost.set('author', Parse.User.current());
		newPost.set('title', post.title);
		newPost.set('description', post.description);
		newPost.set('content', post.content);
		// set permissions for post
		newPost.setACL(ACL);
		// create new post
		newPost.save(null, {
			success: function(post) {
				// show the blog post on the page
				displayPost(post);
				// there is now a post on the page
				postsNowOnPage();
				// increment the post skip
				postSkip++;
				// notify user of successful post
				createButton.val('Post Successful! Create Another Post');
			},
			error: function(post, error) {
				// display error code and message
				console.log(error.code + " " + error.message);
				// reset create post button
				createButton.val('Create Post');
			}
		})
	}

	// give getPosts a limit (on the number of posts to retrieve) and a skip (to skip a certain amount of posts, based on how many were retrieved beforehand)
	function getPosts(limit, skip) {
		// query for blog posts
		var getPosts = new Parse.Query(Parse.Object.extend("Post"));
		// set a limit on the amount of post to retrieve, for paginating purposes
		getPosts.limit(limit);
		// set a skip value to skip a certain amount of posts after some have already been displayed
		getPosts.skip(skip);
		// get the posts
		getPosts.find({
			success: function(posts) {
				// add number of posts to skip parameter
				postSkip += posts.length;
				// no posts
				if (!posts.length) {
					// posts already on page
					if (postsOnPage)
						// let the user know there are no more posts
						$('.blog__warning').text('There are no more posts');
					else
						// let the user know there are no posts yet
						$('.blog__warning').text('There is no content yet');
				// at least one post
				} else {
					// less than 5 posts (less than postSearchLimit)
					if (posts.length < postSearchLimit) {
						// display the posts on the screen
						for (var i = posts.length - 1; i >= 0; i--)
							displayPost(posts[i]);
						// let the user know there are no posts yet
						$('.blog__warning').text('There are no more posts');
					// at least 5 posts
					} else {
						// display the posts on the screen
						for (var i = posts.length - 1; i >= 0; i--)
							displayPost(posts[i]);
						// let the user know they can get more posts
						$('.blog__warning').text('Load more posts');
					}
				}
			},
			error: function() {
				// display error code and message
				console.log(error.code + " " + error.message);
			}
		});
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
		likeButton.text('Liking ...');

		// create new post instance and sets its id to the current post that's being liked
		var likedPost = new PostClass();
		likedPost.id = postId;

		// create permissions for like
		var ACL = new Parse.ACL();
		// public read
		ACL.setPublicReadAccess(true);
		// public no write
		ACL.setPublicWriteAccess(false);
		// write access for liking user
		ACL.setWriteAccess(Parse.User.current(), true);

		// create new like object
		var like = new LikeClass();
		// set permissions for like
		like.setACL(ACL);
		like.save({
			// set properties with object literal notation
			user : Parse.User.current(),
			post : likedPost
		}, {
			success: function(like) {
				// notify user of successful liking
				likeButton.text('You liked this post');
			},
			error: function(like, error) {
				// display error code and message
				console.log(error.code + " " + error.message);
				// reset like button
				likeButton.text('Like This Post');
			}
		});
	}

	// give deletePost a postId to delete the blog post, the originalPost dom element to remove it from the page, and a reference to the button that was pressed
	function deletePost(postId, originalPost, deleteButton) {
		// notify user of progress
		deleteButton.text('Deleting post ...');

		// create new post instance and sets its id to the current post that's being deleted
		var deletedPost = new PostClass();
		deletedPost.id = postId;
		// destroy this post
		deletedPost.destroy({
			success: function(post) {
				// remove it from the page
				originalPost.remove();
			},
			error: function(error, post) {
				// display error code and message
				console.log(error.code + " " + error.message);
				// reset delete button
				deleteButton.text('Delete this post');
			}
 		})
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