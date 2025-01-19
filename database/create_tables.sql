-- Table `role`
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `name_role` varchar(50) NOT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `name_role` (`name_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `profile`
DROP TABLE IF EXISTS `profile`;
CREATE TABLE `profile` (
  `id_profile` int NOT NULL AUTO_INCREMENT,
  `mail_profile` varchar(255) NOT NULL,
  `date_of_birth_profile` date DEFAULT NULL,
  `img_profile` text,
  `password_profile` varchar(255) NOT NULL,
  `first_name_profile` varchar(255) NOT NULL,
  `last_name_profile` varchar(255) NOT NULL,
  PRIMARY KEY (`id_profile`),
  UNIQUE KEY `mail_profile` (`mail_profile`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `profile_role`
DROP TABLE IF EXISTS `profile_role`;
CREATE TABLE `profile_role` (
  `id_profile` int NOT NULL,
  `id_role` int NOT NULL,
  PRIMARY KEY (`id_profile`, `id_role`),
  KEY `profile_role_id_role_fkey` (`id_role`),
  CONSTRAINT `profile_role_id_profile_fkey` FOREIGN KEY (`id_profile`) REFERENCES `profile` (`id_profile`) ON DELETE CASCADE,
  CONSTRAINT `profile_role_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `student_group`
DROP TABLE IF EXISTS `student_group`;
CREATE TABLE `student_group` (
  `id_student_group` int NOT NULL AUTO_INCREMENT,
  `name_student_group` varchar(255) NOT NULL,
  `year_student_group` int NOT NULL,
  `semester_student_group` int NOT NULL,
  PRIMARY KEY (`id_student_group`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `evaluation`
DROP TABLE IF EXISTS `evaluation`;
CREATE TABLE `evaluation` (
  `id_evaluation` int NOT NULL AUTO_INCREMENT,
  `date_opening` date NOT NULL,
  `date_closing` date NOT NULL,
  `title_evaluation` varchar(255) NOT NULL,
  `id_student_group` int NOT NULL,
  PRIMARY KEY (`id_evaluation`),
  KEY `evaluation_id_student_group_fkey` (`id_student_group`),
  CONSTRAINT `evaluation_id_student_group_fkey` FOREIGN KEY (`id_student_group`) REFERENCES `student_group` (`id_student_group`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `question`
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `id_question` int NOT NULL AUTO_INCREMENT,
  `type_question` int NOT NULL,
  `title_question` varchar(255) NOT NULL,
  `content_question` text NOT NULL,
  `id_evaluation` int NOT NULL,
  PRIMARY KEY (`id_question`),
  KEY `question_id_evaluation_fkey` (`id_evaluation`),
  CONSTRAINT `question_id_evaluation_fkey` FOREIGN KEY (`id_evaluation`) REFERENCES `evaluation` (`id_evaluation`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `module`
DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `id_module` int NOT NULL AUTO_INCREMENT,
  `code_module` varchar(50) NOT NULL,
  `name_module` varchar(255) NOT NULL,
  `professor_module` varchar(255) NOT NULL,
  PRIMARY KEY (`id_module`),
  UNIQUE KEY `code_module` (`code_module`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `group_module`
DROP TABLE IF EXISTS `group_module`;
CREATE TABLE `group_module` (
  `id_student_group` int NOT NULL,
  `id_module` int NOT NULL,
  PRIMARY KEY (`id_student_group`, `id_module`),
  KEY `group_module_id_module_fkey` (`id_module`),
  CONSTRAINT `group_module_id_module_fkey` FOREIGN KEY (`id_module`) REFERENCES `module` (`id_module`) ON DELETE CASCADE,
  CONSTRAINT `group_module_id_student_group_fkey` FOREIGN KEY (`id_student_group`) REFERENCES `student_group` (`id_student_group`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `answer`
DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer` (
  `id_answer` int NOT NULL AUTO_INCREMENT,
  `note_answer` int DEFAULT NULL,
  `content_answer` text,
  `is_private` tinyint(1) NOT NULL,
  `id_question` int NOT NULL,
  `id_student` int NOT NULL,
  PRIMARY KEY (`id_answer`),
  KEY `answer_id_question_fkey` (`id_question`),
  KEY `answer_id_student_fkey` (`id_student`),
  CONSTRAINT `answer_id_question_fkey` FOREIGN KEY (`id_question`) REFERENCES `question` (`id_question`) ON DELETE CASCADE,
  CONSTRAINT `answer_id_student_fkey` FOREIGN KEY (`id_student`) REFERENCES `profile` (`id_profile`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `comment`
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id_comment` int NOT NULL AUTO_INCREMENT,
  `content_comment` text NOT NULL,
  `is_anonymous` tinyint(1) DEFAULT '0',
  `date_comment` date NOT NULL,
  `id_module` int NOT NULL,
  `id_author` int DEFAULT NULL,
  PRIMARY KEY (`id_comment`),
  KEY `comment_id_module_fkey` (`id_module`),
  KEY `comment_id_author_fkey` (`id_author`),
  CONSTRAINT `comment_id_author_fkey` FOREIGN KEY (`id_author`) REFERENCES `profile` (`id_profile`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_id_module_fkey` FOREIGN KEY (`id_module`) REFERENCES `module` (`id_module`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `student_group_association`
DROP TABLE IF EXISTS `student_group_association`;
CREATE TABLE `student_group_association` (
  `id_student` int NOT NULL,
  `id_student_group` int NOT NULL,
  PRIMARY KEY (`id_student`, `id_student_group`),
  KEY `student_group_association_id_student_group_fkey` (`id_student_group`),
  CONSTRAINT `student_group_association_id_student_fkey` FOREIGN KEY (`id_student`) REFERENCES `profile` (`id_profile`) ON DELETE CASCADE,
  CONSTRAINT `student_group_association_id_student_group_fkey` FOREIGN KEY (`id_student_group`) REFERENCES `student_group` (`id_student_group`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `report`
DROP TABLE IF EXISTS `report`;
CREATE TABLE `report` (
  `id_report` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `format` varchar(50) NOT NULL,
  `id_evaluation` int NOT NULL,
  PRIMARY KEY (`id_report`),
  KEY `report_id_evaluation_fkey` (`id_evaluation`),
  CONSTRAINT `report_id_evaluation_fkey` FOREIGN KEY (`id_evaluation`) REFERENCES `evaluation` (`id_evaluation`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
