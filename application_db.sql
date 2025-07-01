CREATE DATABASE IF NOT EXISTS application_db;

USE application_db;

CREATE TABLE application_db (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  dob DATE,
  age INT,
  gender VARCHAR(10),
  email VARCHAR(100),
  position VARCHAR(50),
  languages TEXT,
  password VARCHAR(255)
);


