-- Table Profile
CREATE TABLE Profile (
    id_profile INT PRIMARY KEY AUTO_INCREMENT,
    mail_profile VARCHAR(255) NOT NULL UNIQUE,
    first_name_profile VARCHAR(255) NOT NULL,
    last_name_profile VARCHAR(255) NOT NULL,
    date_of_birth_profile DATE,
    img_profile TEXT,
    password_profile VARCHAR(255) NOT NULL
);

-- Table Role
CREATE TABLE Role (
    id_role INT PRIMARY KEY AUTO_INCREMENT,
    name_role VARCHAR(50) NOT NULL UNIQUE
);

-- Table Profile_Role (association entre Profile et Role)
CREATE TABLE Profile_Role (
    id_profile INT NOT NULL,
    id_role INT NOT NULL,
    PRIMARY KEY (id_profile, id_role),
    FOREIGN KEY (id_profile) REFERENCES Profile(id_profile) ON DELETE CASCADE,
    FOREIGN KEY (id_role) REFERENCES Role(id_role) ON DELETE CASCADE
);

-- Table Student_Group
CREATE TABLE Student_Group (
    id_student_group INT PRIMARY KEY AUTO_INCREMENT,
    name_student_group VARCHAR(255) NOT NULL,
    year_student_group INT NOT NULL,
    semester_student_group INT NOT NULL
);

-- Table Module
CREATE TABLE Module (
    id_module INT PRIMARY KEY AUTO_INCREMENT,
    code_module VARCHAR(50) NOT NULL UNIQUE,
    name_module VARCHAR(255) NOT NULL,
    professor_module VARCHAR(255) NOT NULL
);

-- Table Group_Module (association entre Student_Group et Module)
CREATE TABLE Group_Module (
    id_student_group INT NOT NULL,
    id_module INT NOT NULL,
    PRIMARY KEY (id_student_group, id_module),
    FOREIGN KEY (id_student_group) REFERENCES Student_Group(id_student_group) ON DELETE CASCADE,
    FOREIGN KEY (id_module) REFERENCES Module(id_module) ON DELETE CASCADE
);

-- Table Evaluation
CREATE TABLE Evaluation (
    id_evaluation INT PRIMARY KEY AUTO_INCREMENT,
    date_opening DATE NOT NULL,
    date_closing DATE NOT NULL,
    title_evaluation VARCHAR(255) NOT NULL,
    id_student_group INT NOT NULL,
    FOREIGN KEY (id_student_group) REFERENCES Student_Group(id_student_group) ON DELETE CASCADE
);

-- Table Question
CREATE TABLE Question (
    id_question INT PRIMARY KEY AUTO_INCREMENT,
    type_question INT NOT NULL,
    title_question VARCHAR(255) NOT NULL,
    content_question TEXT NOT NULL,
    id_evaluation INT NOT NULL,
    FOREIGN KEY (id_evaluation) REFERENCES Evaluation(id_evaluation) ON DELETE CASCADE
);

-- Table Answer
CREATE TABLE Answer (
    id_answer INT PRIMARY KEY AUTO_INCREMENT,
    note_answer INT,
    content_answer TEXT,
    is_private BOOLEAN NOT NULL,
    id_question INT NOT NULL,
    id_student INT NOT NULL,
    FOREIGN KEY (id_question) REFERENCES Question(id_question) ON DELETE CASCADE,
    FOREIGN KEY (id_student) REFERENCES Profile(id_profile) ON DELETE CASCADE
);

-- Table Comment
CREATE TABLE Comment (
    id_comment INT PRIMARY KEY AUTO_INCREMENT,
    content_comment TEXT NOT NULL,
    date_comment DATE NOT NULL,
    id_student INT NOT NULL,
    id_module INT NOT NULL,
    FOREIGN KEY (id_student) REFERENCES Profile(id_profile) ON DELETE CASCADE,
    FOREIGN KEY (id_module) REFERENCES Module(id_module) ON DELETE CASCADE
);

-- Table Report
CREATE TABLE Report (
    id_report INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    format VARCHAR(50) NOT NULL,
    id_evaluation INT NOT NULL,
    FOREIGN KEY (id_evaluation) REFERENCES Evaluation(id_evaluation) ON DELETE CASCADE
);


CREATE TABLE Student_Group_Association (
    id_student INT NOT NULL, -- Référence à l'étudiant (Profile avec le rôle Student)
    id_student_group INT NOT NULL, -- Référence au groupe d'étudiants
    PRIMARY KEY (id_student, id_student_group),
    FOREIGN KEY (id_student) REFERENCES Profile(id_profile) ON DELETE CASCADE,
    FOREIGN KEY (id_student_group) REFERENCES Student_Group(id_student_group) ON DELETE CASCADE
);
