-- Employee Management System - MySQL Schema Reference
-- NOTE: Hibernate (spring.jpa.hibernate.ddl-auto=update) will auto-create/update these
-- tables from the JPA entities when the backend starts. This file is a human-readable
-- reference of the resulting schema and is also useful for manual setup or seeding.

CREATE DATABASE IF NOT EXISTS ems_db;
USE ems_db;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(50),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','MANAGER','EMPLOYEE') NOT NULL,
    account_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS departments (
    department_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS positions (
    position_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    department_id BIGINT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    department_id BIGINT,
    position_id BIGINT,
    joined_date DATE,
    status ENUM('ACTIVE','INACTIVE','TERMINATED') DEFAULT 'ACTIVE',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (position_id) REFERENCES positions(position_id)
);

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    `date` DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    work_hours DOUBLE,
    status ENUM('PRESENT','ABSENT','LATE','HALF_DAY','ON_LEAVE') DEFAULT 'PRESENT',
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    UNIQUE KEY uq_employee_date (employee_id, `date`)
);

CREATE TABLE IF NOT EXISTS leave_requests (
    leave_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type ENUM('ANNUAL','SICK','CASUAL','MATERNITY','PATERNITY','UNPAID','OTHER'),
    start_date DATE,
    end_date DATE,
    reason VARCHAR(1000),
    status ENUM('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING',
    approver_comment VARCHAR(255),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS payroll (
    payroll_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    basic_salary DOUBLE,
    allowances DOUBLE,
    deductions DOUBLE,
    net_salary DOUBLE,
    pay_period_start DATE,
    pay_period_end DATE,
    payment_date DATE,
    payment_status ENUM('PENDING','PAID','FAILED') DEFAULT 'PENDING',
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS performance_evaluations (
    performance_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    evaluation_date DATE,
    performance_score DOUBLE,
    comments VARCHAR(2000),
    evaluated_by BIGINT,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (evaluated_by) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    message VARCHAR(1000),
    date DATETIME,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
