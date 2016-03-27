CREATE TABLE `users` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`username`	TEXT NOT NULL UNIQUE,
	`password_hash`	TEXT NOT NULL,
	`date_created`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`email`	TEXT NOT NULL UNIQUE,
	`is_admin`	INTEGER DEFAULT 0
);
CREATE INDEX usernameIndex ON users(username);


CREATE TABLE `posts` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`title`	TEXT NOT NULL,
	`time`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`body`	TEXT,
	`posted_by`	INTEGER,
	FOREIGN KEY(posted_by) REFERENCES users(id)
);


CREATE TABLE `post_replies` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`time`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`body`	TEXT NOT NULL,
	`posted_by`	INTEGER NOT NULL,
	`reply_to` INTEGER NOT NULL,
	FOREIGN KEY(posted_by) REFERENCES users(id),
	FOREIGN KEY(reply_to) REFERENCES posts(id) ON DELETE CASCADE
);
CREATE INDEX repliesByPost ON post_replies(reply_to);

CREATE TABLE `post_votes` (
	`post_id` INTEGER NOT NULL,
	`user_id` INTEGER NOT NULL,
	`vote` INTEGER CHECK(vote > -2 AND vote < 2),
	`time`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`post_id`, `user_id`),
	FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX votesByPost ON post_votes(post_id);

CREATE TABLE `reply_votes` (
	`reply_id` INTEGER NOT NULL,
	`user_id` INTEGER NOT NULL,
	`vote` INTEGER CHECK(vote > -2 AND vote < 2),
	`time`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`reply_id`, `user_id`),
	FOREIGN KEY(reply_id) REFERENCES replies(id) ON DELETE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX votesByReply ON reply_votes(reply_id);

--Triggers--
CREATE TRIGGER postInsert
AFTER INSERT ON posts 
FOR EACH ROW
BEGIN
INSERT INTO post_votes (post_id, user_id, vote) VALUES (new.id, new.posted_by, 1);
END;

CREATE TRIGGER replyInsert
AFTER INSERT ON post_replies 
FOR EACH ROW
BEGIN
INSERT INTO reply_votes (reply_id, user_id, vote) VALUES (new.id, new.posted_by, 1);
END;

--Users--
INSERT INTO `users`(`username`,`password_hash`,`email`,`is_admin`) 	VALUES ('ADMIN','toaddlater','admin@thissite.com', 1);

INSERT INTO `users`(`username`,`password_hash`,`email`) 	VALUES ('mickey','toaddlater','mickey@gmail.com');
INSERT INTO `users`(`username`,`password_hash`,`email`) 	VALUES ('larence','toaddlater','larence@gmail.com');
INSERT INTO `users`(`username`,`password_hash`,`email`) 	VALUES ('leron','toaddlater','leron@gmail.com');
INSERT INTO `users`(`username`,`password_hash`,`email`) 	VALUES ('linford','toaddlater','linford@gmail.com');

--Posts--
INSERT INTO `posts`(`title`,`body`,`posted_by`) 		VALUES ('Welcome from the admin!','Welcome to this forum, please keep discussions appropriate and users linking to illegal content will be banned',1);

INSERT INTO `posts`(`title`,`body`,`posted_by`) 		VALUES ('Hey guys, anyone need a mix mastered?','I am looking  to get some practice in so feel free to email something to work on!',2);
--INSERT INTO `posts`(`title`,`body`,`posted_by`)	VALUES ('','',3);--

--Post votes--
--INSERT INTO `post_votes`(`post_id`,`user_id`,`vote`) VALUES (NULL,NULL,NULL);--

INSERT INTO `post_votes`(`post_id`,`user_id`,`vote`) VALUES (1,2,1);
INSERT INTO `post_votes`(`post_id`,`user_id`,`vote`) VALUES (1,3,1);
INSERT INTO `post_votes`(`post_id`,`user_id`,`vote`) VALUES (1,4,-1);

INSERT INTO `post_votes`(`post_id`,`user_id`,`vote`) VALUES (2,3,-1);

--Replies--
INSERT INTO `post_replies`(`body`,`posted_by`,`reply_to`)	VALUES ('Glad to be part of it!',4, 1);

--Reply votes--
--INSERT INTO `reply_votes`(`reply_id`,`user_id`,`vote`) VALUES (NULL,NULL,NULL);--
INSERT INTO `reply_votes`(`reply_id`,`user_id`,`vote`) VALUES (1,1,1);
