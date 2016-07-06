USE `data_base_name`;

create table categories(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name varchar(256)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

create table tests(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	category_id int NOT NULL,
    name varchar(256),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_private BOOLEAN,
	FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

create table blocks(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    test_id int NOT NULL,
    name varchar(256),
    number int,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

create table questions(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    test_id int NOT NULL,
    block_id int,
    name text,
    img varchar(256),
    type varchar(10),
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

create table answers(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    question_id int NOT NULL,
    name varchar(256),
    img varchar(256),
	is_true BOOLEAN,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

create table tests_results(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    test_id int NOT NULL,
    first_name varchar(256),
    last_name varchar(256),
    tel varchar(25),
    email varchar(256),
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

create table tests_results_responses(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    test_result_id int NOT NULL,
	question_id int NOT NULL,
    is_right BOOLEAN,
    FOREIGN KEY (test_result_id) REFERENCES tests_results(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


INSERT INTO `categories` (`name`) VALUES
('HTML'),
('CSS'),
('JavaScript'),
('PHP');