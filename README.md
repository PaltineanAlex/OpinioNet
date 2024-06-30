# OpinioNet

Social Media/Image Board application made with Node for my Bachelor's Thesis

## Short description

It's a web based application that let's you share opinions, ask questions and inspire other people through communities. Other smaller features include live chat with others, cluster analysis for the userbase and a report sistem.

## Instalation

### Locally:

It is pretty simple if you have Docker installed and running. All you have to do is to write this command in a terminal, __making sure you are in the right directory.__

`cd C:\YOUR\PATH\TO\OpinioNet`

`docker compose up -d --build`

These commands will make sure to get the app up and running. To access the page, go into your favourite browser and type the following.

`http://localhost:3000/`

If you want to stop the containers, and implicitly the app at any given moments, you can run the following command.

`docker compose stop`

__For external use__, you have to either host the app yourself by forwarding a port or by hosting it in a cloud service. But maybe in the future I will host it myself.

## Usage

- Login

    - You can either enter already created credentials (username and password) or press the button for the create account

        ![Login Page!](/assets/images/LoginPage.png)

    - If you don't have an account yet, you ca create one by inserting your email adress, username and password and you'll be all set to enter the app.

        ![Registration Page!](/assets/images/RegisterPage.png)

- Feed

    - This represents the main page that gives the user access to all available functionality in the app (Community access, news letters for different topics, Live chat, Statistics Page and Cluster Analysis).

        ![Feed Page!](/assets/images/FeedPage.png)

    - Community Tab is used for managing and getting access to the communities you want or are already joined and also access to the news letter

        ![Community Tab!](/assets/images/CommunityTab.png)

    - My feed shows all the posts made in the communitites that you have already joined. To see all the contents of a post, you should press the button Shows Description.

    - Live chat is a functionality in which all users can comunicate when they enter the chat room. This is more useful as a starting point to get information and so on.

        ![Live Chat!](/assets/images/LiveChat.png)

    - Show statistics is a simple implementation of a histogram that shows the number of users, communities, posts and comments created on the platform.

        ![Statistics!](/assets/images/Statistics.png)

    - Cluster analysis is a feature that implements a clustering algorithm for the number of posts and comments, creating 3 clusters and represint them with a circle. For now this uses dummy data as well to simulate a comprehensive analysis, but in the future, whith enough data, it will only use real data.

        ![Cluster Analysis!](/assets/images/ClusterAnalysis.png)

- Community

    - Communities are hubs where like-minded individuals can share anything. You can either create one or join one.

    - You can create one by clicking the create button in the Community Tab. From there You only have to provide a name and a short description. I recommend adding at the end of the description this: __Created by @username__.

        ![Create Community Page!](/assets/images/CreateCommunityPage.png)

    - If you want to join one, you can search the name in the Community Tab and go to the page.

        ![Community Page!](/assets/images/CommunityPage.png)

    - Depending if you are the creator or just a subscriber to the community, there are different options that you can use: for subscribers, you can join/leave and create posts, but for the owner of the community, there are also the options of editing, deleting and managing reports. Posts and comments can be report for a valid reason, that will be solved by the owner through the manager by either deleting the reported content or ignoring and deleting the request.

        ![Report Manager!](/assets/images/ReportManager.png)

- Posts

    - Each post can be either created in a community, in which case the user will have to provide a title, a description and optionally an image.

        ![Create Post!](/assets/images/CreatePost.png)

    - Or you can view one by clicking on the title of the post. Just like for the communities, if you are the creator, you have the options to edit, delete and report the post, otherwise, you can just view it or report it.

        ![Post Page!](/assets/images/PostPage.png)

    - THere is also a comment section which lets you interact with the post directly. And just like before, you can report the comment or edit and delete one, if you are the one who created it.

        ![Comment!](/assets/images/Comment.png)


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)