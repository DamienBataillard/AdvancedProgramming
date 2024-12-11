INSERT INTO Profile (id_profile, mail_profile, first_name_profile,last_name_profile, date_of_birth_profile, img_profile, password_profile)
VALUES 
(1, 'student1@example.com', 'Alice','Student', '2002-05-10', 'student1.jpg', 'password123'),
(2, 'student2@example.com', 'Bob Student', '2003-08-15', 'student2.jpg', 'password123'),
(3, 'teacher1@example.com', 'Prof. Emma', '1980-03-22', 'teacher1.jpg', 'securepass'),
(4, 'admin@example.com', 'Admin John', '1975-01-12', 'admin.jpg', 'adminpass');


INSERT INTO Role (id_role, name_role)
VALUES 
(1, 'Student'),
(2, 'Teacher'),
(3, 'Admin');


INSERT INTO Profile_Role (id_profile, id_role)
VALUES 
(1, 1), -- Alice est étudiante
(2, 1), -- Bob est étudiant
(3, 2), -- Emma est enseignante
(4, 3); -- John est administrateur


INSERT INTO Student_Group (id_student_group, name_student_group, year_student_group, semester_student_group)
VALUES 
(1, 'Group A', 2024, 1),
(2, 'Group B', 2024, 2);


INSERT INTO Student_Group_Association (id_student, id_student_group)
VALUES 
(1, 1), -- Alice est dans le groupe A
(2, 2); -- Bob est dans le groupe B


INSERT INTO Module (code_module, name_module, professor_module)
VALUES 
('CS101', 'Introduction to Computer Science', 'Emma Teacher'),
('MATH101', 'Calculus I', 'Emma Teacher');



INSERT INTO Group_Module (id_student_group, id_module)
VALUES 
(1, 1), -- Le groupe A suit le module CS101
(2, 2); -- Le groupe B suit le module MATH101


INSERT INTO Evaluation (id_evaluation, date_opening, date_closing, title_evaluation, id_student_group)
VALUES 
(1, '2024-01-15', '2024-01-30', 'Feedback on CS101', 1), -- Évaluation du module CS101 pour le groupe A
(2, '2024-02-15', '2024-02-28', 'Feedback on MATH101', 2); -- Évaluation du module MATH101 pour le groupe B


INSERT INTO Question (id_question, type_question, title_question, content_question, id_evaluation)
VALUES 
(1, 1, 'Module Understanding', 'How well did you understand the module content?', 1),
(2, 1, 'Teaching Quality', 'How would you rate the teaching quality?', 1),
(3, 1, 'Material Usefulness', 'Was the provided material helpful?', 2),
(4, 1, 'Overall Satisfaction', 'Are you satisfied with the module overall?', 2);



INSERT INTO Answer (id_answer, note_answer, content_answer, is_private, id_question, id_student)
VALUES 
(1, 8, 'The module was clear and well-structured.', FALSE, 1, 1), -- Alice répond sur la compréhension du module CS101
(2, 9, 'The professor explained very well.', FALSE, 2, 1), -- Alice évalue la qualité de l’enseignement
(3, 7, 'The material could be more detailed.', FALSE, 3, 2), -- Bob répond sur l’utilité des supports dans MATH101
(4, 8, 'Overall, I’m satisfied.', FALSE, 4, 2); -- Bob donne une note globale pour MATH101




INSERT INTO Comment (id_comment, content_comment, date_comment, id_answer, id_student, id_module)
VALUES 
(1, 'Thank you for the feedback. We will improve the materials.', '2024-01-20', 3, 3, 2), -- Emma commente la réponse de Bob sur MATH101
(2, 'Great feedback! Glad you liked it.', '2024-01-21', 1, 3, 1); -- Emma commente la réponse d’Alice sur CS101



INSERT INTO Report (id_report, date, format, id_evaluation)
VALUES 
(1, '2024-02-01', 'PDF', 1), -- Rapport pour le feedback sur CS101
(2, '2024-03-01', 'PDF', 2); -- Rapport pour le feedback sur MATH101
