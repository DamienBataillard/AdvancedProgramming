-- Création de la base de données
DROP DATABASE IF EXISTS advanced_programming_test;
CREATE DATABASE advanced_programming_test;
USE advanced_programming_test;

-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: advanced_programming
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `evaluation`
--

DROP TABLE IF EXISTS `evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_module`
--

DROP TABLE IF EXISTS `group_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_module` (
  `id_student_group` int NOT NULL,
  `id_module` int NOT NULL,
  PRIMARY KEY (`id_student_group`,`id_module`),
  KEY `group_module_id_module_fkey` (`id_module`),
  CONSTRAINT `group_module_id_module_fkey` FOREIGN KEY (`id_module`) REFERENCES `module` (`id_module`) ON DELETE CASCADE,
  CONSTRAINT `group_module_id_student_group_fkey` FOREIGN KEY (`id_student_group`) REFERENCES `student_group` (`id_student_group`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id_module` int NOT NULL AUTO_INCREMENT,
  `code_module` varchar(50) NOT NULL,
  `name_module` varchar(255) NOT NULL,
  `professor_module` varchar(255) NOT NULL,
  PRIMARY KEY (`id_module`),
  UNIQUE KEY `code_module` (`code_module`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `profile_role`
--

DROP TABLE IF EXISTS `profile_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_role` (
  `id_profile` int NOT NULL,
  `id_role` int NOT NULL,
  PRIMARY KEY (`id_profile`,`id_role`),
  KEY `profile_role_id_role_fkey` (`id_role`),
  CONSTRAINT `profile_role_id_profile_fkey` FOREIGN KEY (`id_profile`) REFERENCES `profile` (`id_profile`) ON DELETE CASCADE,
  CONSTRAINT `profile_role_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `id_report` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `format` varchar(50) NOT NULL,
  `id_evaluation` int NOT NULL,
  PRIMARY KEY (`id_report`),
  KEY `report_id_evaluation_fkey` (`id_evaluation`),
  CONSTRAINT `report_id_evaluation_fkey` FOREIGN KEY (`id_evaluation`) REFERENCES `evaluation` (`id_evaluation`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `name_role` varchar(50) NOT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `name_role` (`name_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_group`
--

DROP TABLE IF EXISTS `student_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_group` (
  `id_student_group` int NOT NULL AUTO_INCREMENT,
  `name_student_group` varchar(255) NOT NULL,
  `year_student_group` int NOT NULL,
  `semester_student_group` int NOT NULL,
  PRIMARY KEY (`id_student_group`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_group_association`
--

DROP TABLE IF EXISTS `student_group_association`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_group_association` (
  `id_student` int NOT NULL,
  `id_student_group` int NOT NULL,
  PRIMARY KEY (`id_student`,`id_student_group`),
  KEY `student_group_association_id_student_group_fkey` (`id_student_group`),
  CONSTRAINT `student_group_association_id_student_fkey` FOREIGN KEY (`id_student`) REFERENCES `profile` (`id_profile`) ON DELETE CASCADE,
  CONSTRAINT `student_group_association_id_student_group_fkey` FOREIGN KEY (`id_student_group`) REFERENCES `student_group` (`id_student_group`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-15 10:50:29
