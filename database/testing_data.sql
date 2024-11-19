INSERT INTO Profile (id_profile, mail_profile, name_profile, date_of_birth_profile, img_profile, password_profile)
VALUES 
(1, 'student1@example.com', 'Alice Student', '2002-05-10', 'student1.jpg', 'password123'),
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


INSERT INTO Module (id_module, code_module, name_module)
VALUES 
(1, 'CS101', 'Introduction to Computer Science'),
(2, 'MATH101', 'Calculus I');


INSERT INTO Group_Module (id_student_group, id_module)
VALUES 
(1, 1), -- Le groupe A suit le module CS101
(2, 2); -- Le groupe B suit le module MATH101


INSERT INTO Evaluation (id_evaluation, date_opening, date_closing, title_evaluation, id_student_group)
VALUES 
(1, '2024-01-15', '2024-01-30', 'Midterm Exam', 1),
(2, '2024-02-15', '2024-02-28', 'Final Exam', 2);


INSERT INTO Question (id_question, type_question, title_question, content_question, id_evaluation)
VALUES 
(1, 1, 'What is a variable?', 'Explain what a variable is in programming.', 1),
(2, 2, 'Solve the equation', 'Find x if 2x + 3 = 7.', 2);


INSERT INTO Answer (note_answer, content_answer, is_private, id_question, id_student)
VALUES 
(5, 'A variable is a named storage for data.', FALSE, 1, 1), -- Alice répond à la question 1 avec une note de 5
(NULL, 'x = 2. Solved the equation properly.', TRUE, 2, 2); -- Bob répond à la question 2 sans note



INSERT INTO Comment (id_comment, content_comment, date_comment, id_answer)
VALUES 
(1, 'Good explanation!', '2024-01-16', 1), -- Commentaire sur la réponse d'Alice
(2, 'Double-check the solution.', '2024-02-16', 2); -- Commentaire sur la réponse de Bob





