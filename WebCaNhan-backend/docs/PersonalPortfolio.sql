-- ============================================================
-- PERSONAL PORTFOLIO DATABASE
-- Database: personal_portfolio
-- DBMS: Microsoft SQL Server
-- ============================================================


-- ============================================================
-- 1. TAO DATABASE
-- ============================================================

IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'personal_portfolio') BEGIN CREATE DATABASE personal_portfolio; END
GO


USE personal_portfolio;
GO


-- ============================================================
-- 2. USERS
-- ============================================================
-- Muc dich:
-- Luu tai khoan dang nhap vao trang Admin.
--
-- Vi du:
-- admin / password
--
-- Khong luu password plaintext.
-- password_hash se luu mat khau da hash bang bcrypt/Argon2
-- tu PHP.
-- ============================================================

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,

    username NVARCHAR(50) NOT NULL UNIQUE,

    password_hash NVARCHAR(255) NOT NULL,

    full_name NVARCHAR(100),

    email NVARCHAR(150),

    role NVARCHAR(20) NOT NULL DEFAULT 'ADMIN',

    is_active BIT NOT NULL DEFAULT 1,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        
);


-- ============================================================
-- 3. PROFILE
-- ============================================================
-- Muc dich:
-- Luu thong tin ca nhan cua chu website.
--
-- Du lieu nay duoc dung cho:
-- - Trang Home
-- - Trang About
-- - Thong tin gioi thieu
-- - Avatar
-- - CV
-- - Email
-- - Location
-- ============================================================

CREATE TABLE profile (
    id INT IDENTITY(1,1) PRIMARY KEY,

    full_name NVARCHAR(100) NOT NULL,

    job_title NVARCHAR(150),

    short_description NVARCHAR(MAX),

    about_description NVARCHAR(MAX),

    avatar_url NVARCHAR(500),

    cv_url NVARCHAR(500),

    email NVARCHAR(150),

    phone NVARCHAR(30),

    location NVARCHAR(150),

    dob DATE,

    gender NVARCHAR(20),

    nationality NVARCHAR(100),

    marital_status NVARCHAR(50),

    freelance_status NVARCHAR(50),

    timezone NVARCHAR(50),

    availability_date DATE,

    nickname NVARCHAR(100),

    cover_photo_url NVARCHAR(500),

    career_goal NVARCHAR(MAX),

    languages NVARCHAR(255),

    hobbies NVARCHAR(500),

    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        
);


-- ============================================================
-- 4. SOCIAL_LINKS
-- ============================================================
-- Muc dich:
-- Luu cac link mang xa hoi / kenh lien lac.
--
-- Vi du:
-- GitHub
-- LinkedIn
-- Facebook
-- Email
--
-- display_order dung de sap xep thu tu hien thi tren website.
-- ============================================================

CREATE TABLE social_links (
    id INT IDENTITY(1,1) PRIMARY KEY,

    platform NVARCHAR(50) NOT NULL,

    url NVARCHAR(500) NOT NULL,

    icon NVARCHAR(100),

    display_order INT NOT NULL DEFAULT 0,

    is_active BIT NOT NULL DEFAULT 1
);


-- ============================================================
-- Muc dich:
-- Luu kinh nghiem lam viec.
--
-- Website co the hien thi bang Timeline:
--
-- 2026
-- Software Developer
-- ABC Company
--
-- 2025
-- Intern Developer
-- XYZ Company
--
-- is_current = TRUE neu hien tai van dang lam viec.
-- ============================================================

CREATE TABLE experiences (
    id INT IDENTITY(1,1) PRIMARY KEY,

    company_name NVARCHAR(150) NOT NULL,

    position NVARCHAR(150) NOT NULL,

    start_date DATE,

    end_date DATE,

    is_current BIT NOT NULL DEFAULT 0,

    description NVARCHAR(MAX),

    location NVARCHAR(150),

    display_order INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        
);


-- ============================================================
-- 6. PROJECTS
-- ============================================================
-- Muc dich:
-- Luu cac du an trong Portfolio.
--
-- Co 2 loai:
--
-- REAL_PROJECT
--     Du an thuc te / du an lon
--
-- UNIVERSITY
--     Bai tap lon / do an / project o truong
--
-- Nhung project nay co the co:
-- - Mo ta
-- - Vai tro
-- - Team
-- - Cong nghe
-- - GitHub
-- - Live Demo
-- - Anh screenshot
--
-- slug dung cho URL:
-- /projects/susushop
-- ============================================================

CREATE TABLE projects (
    id INT IDENTITY(1,1) PRIMARY KEY,

    name NVARCHAR(200) NOT NULL,

    slug NVARCHAR(200) NOT NULL UNIQUE,

    project_type NVARCHAR(50) NOT NULL DEFAULT 'REAL_PROJECT',

    short_description NVARCHAR(MAX),

    description NVARCHAR(MAX),

    role NVARCHAR(100),

    team_size INT,

    start_date DATE,

    end_date DATE,

    github_url NVARCHAR(500),

    demo_url NVARCHAR(500),

    thumbnail_url NVARCHAR(500),

    is_featured BIT NOT NULL DEFAULT 0,

    is_published BIT NOT NULL DEFAULT 1,

    display_order INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        
);


-- ============================================================
-- 7. TECHNOLOGIES
-- ============================================================
-- Muc dich:
-- Luu danh sach cong nghe ma ban biet / su dung.
--
-- Vi du:
-- Java
-- C++
-- Python
-- PHP
-- MySQL
-- SQL Server
-- Flutter
-- HTML
-- CSS
-- JavaScript
--
-- category dung de chia nhom:
-- Programming
-- Database
-- Frontend
-- Mobile
-- Tools
-- ...
-- ============================================================

CREATE TABLE technologies (
    id INT IDENTITY(1,1) PRIMARY KEY,

    name NVARCHAR(100) NOT NULL UNIQUE,

    category NVARCHAR(100),

    icon_url NVARCHAR(500),

    display_order INT NOT NULL DEFAULT 0,

    is_active BIT NOT NULL DEFAULT 1
);


-- ============================================================
-- 8. PROJECT_TECHNOLOGIES
-- ============================================================
-- Muc dich:
-- Bang trung gian giua PROJECTS va TECHNOLOGIES.
--
-- Vi du:
--
-- SusuShop
--    |
--    +-- HTML
--    +-- CSS
--    +-- JavaScript
--    +-- PHP
--    +-- MySQL
--
-- Mot project co the co nhieu technology.
-- Mot technology co the duoc dung trong nhieu project.
--
-- Day la quan he N-N.
-- ============================================================

CREATE TABLE project_technologies (
    project_id INT NOT NULL,

    technology_id INT NOT NULL,

    PRIMARY KEY (
        project_id,
        technology_id
    ),

    CONSTRAINT fk_project_technologies_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_project_technologies_technology
        FOREIGN KEY (technology_id)
        REFERENCES technologies(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- 9. PROJECT_IMAGES
-- ============================================================
-- Muc dich:
-- Luu nhieu anh screenshot cho moi project.
--
-- Vi du:
--
-- SusuShop
--    |
--    +-- homepage.png
--    +-- product.png
--    +-- cart.png
--    +-- admin.png
--
-- Mot project co the co nhieu anh.
-- ============================================================

CREATE TABLE project_images (
    id INT IDENTITY(1,1) PRIMARY KEY,

    project_id INT NOT NULL,

    image_url NVARCHAR(500) NOT NULL,

    caption NVARCHAR(255),

    display_order INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT fk_project_images_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- 10. EDUCATION
-- ============================================================
-- Muc dich:
-- Luu thong tin hoc tap / University.
--
-- Vi du:
--
-- Dai hoc ABC
-- Cong nghe thong tin
-- 2022 - 2026
--
-- Co the dung de hien thi timeline hoc tap.
-- ============================================================

CREATE TABLE education (
    id INT IDENTITY(1,1) PRIMARY KEY,

    school_name NVARCHAR(200) NOT NULL,

    major NVARCHAR(200),

    degree NVARCHAR(100),

    start_date DATE,

    end_date DATE,

    description NVARCHAR(MAX),

    display_order INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        
);


-- ============================================================
-- 11. SKILLS
-- ============================================================
-- Muc dich:
-- Luu cac ky nang / cong nghe hien thi trong phan Skills.
--
-- Vi du:
--
-- Programming
--     Java
--     C++
--     Python
--
-- Database
--     MySQL
--     SQL Server
--
-- Web
--     HTML
--     CSS
--     JavaScript
--
-- level co the la:
-- Advanced
-- Intermediate
-- Familiar
--
-- Khong can dung %.
-- ============================================================

CREATE TABLE skills (
    id INT IDENTITY(1,1) PRIMARY KEY,

    name NVARCHAR(100) NOT NULL,

    category NVARCHAR(100),

    level NVARCHAR(50),

    icon_url NVARCHAR(500),

    display_order INT NOT NULL DEFAULT 0,

    is_active BIT NOT NULL DEFAULT 1,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        
);


-- ============================================================
-- 12. LABS
-- ============================================================
-- Muc dich:
-- Luu cac Lab / Experiments / thu nghiem ca nhan.
--
-- Vi du:
-- AI PDF Reader
-- iOS Development
-- Raspberry Pi
-- Data Warehouse
-- Data Mining
--
-- Khac PROJECTS o cho:
-- Projects = san pham / du an
-- Labs = thu nghiem / tu hoc / nghien cuu
-- ============================================================

CREATE TABLE labs (
    id INT IDENTITY(1,1) PRIMARY KEY,

    title NVARCHAR(200) NOT NULL,

    slug NVARCHAR(200) NOT NULL UNIQUE,

    short_description NVARCHAR(MAX),

    content NVARCHAR(MAX),

    thumbnail_url NVARCHAR(500),

    github_url NVARCHAR(500),

    demo_url NVARCHAR(500),

    is_published BIT NOT NULL DEFAULT 1,

    display_order INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        
);


-- ============================================================
-- 13. POSTS
-- ============================================================
-- Muc dich:
-- Luu Blog / Notes / Knowledge Base ca nhan.
--
-- Vi du:
-- Data Warehouse la gi?
-- Data Mining hoat dong nhu the nao?
-- MySQL vs SQL Server
-- Xay dung he thong doc PDF bang AI
-- Ket noi Raspberry Pi bang SSH
--
-- is_published:
-- FALSE = Draft
-- TRUE  = Dang hien thi
--
-- author_id lien ket voi USERS.
-- ============================================================

CREATE TABLE posts (
    id INT IDENTITY(1,1) PRIMARY KEY,

    title NVARCHAR(255) NOT NULL,

    slug NVARCHAR(255) NOT NULL UNIQUE,

    excerpt NVARCHAR(MAX),

    content NVARCHAR(MAX) NOT NULL,

    thumbnail_url NVARCHAR(500),

    category NVARCHAR(100),

    tags NVARCHAR(MAX),

    author_id INT,

    is_published BIT NOT NULL DEFAULT 0,

    published_at DATETIME,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT fk_posts_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- ============================================================
-- 14. CONTACT_MESSAGES
-- ============================================================
-- Muc dich:
-- Luu tin nhan nguoi xem gui qua form Contact.
--
-- Form:
-- Name
-- Email
-- Message
--
-- Admin co the vao:
-- Admin -> Messages
--
-- is_read:
-- FALSE = Chua doc
-- TRUE  = Da doc
-- ============================================================

CREATE TABLE contact_messages (
    id INT IDENTITY(1,1) PRIMARY KEY,

    name NVARCHAR(100) NOT NULL,

    email NVARCHAR(150) NOT NULL,

    message NVARCHAR(MAX) NOT NULL,

    is_read BIT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT GETDATE()
);


-- ============================================================
-- 15. API_KEYS
-- ============================================================
-- Muc dich:
-- Luu tru cac X-API-KEY de xac thuc cac request tu client (Dong bo voi data.sql).
-- ============================================================
CREATE TABLE api_keys (
    api_key_id INT IDENTITY(1,1) PRIMARY KEY,

    [key] NVARCHAR(255) NOT NULL UNIQUE,

    status BIT NOT NULL DEFAULT 1,

    permissions JSON,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        
);


-- ============================================================
-- 16. KEY_TOKENS
-- ============================================================
-- Muc dich:
-- Luu tru key và token de ho tro luong dang nhap JWT (Dong bo voi data.sql).
-- ============================================================
CREATE TABLE key_tokens (
    key_token_id INT IDENTITY(1,1) PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    private_key NVARCHAR(MAX) NOT NULL,

    public_key NVARCHAR(MAX) NOT NULL,

    refresh_token NVARCHAR(MAX),

    refresh_tokens_used JSON,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),

    updated_at DATETIME NOT NULL DEFAULT GETDATE()
        ,

    CONSTRAINT fk_key_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



-- ============================================================
-- SEED DATA
-- ============================================================
SET IDENTITY_INSERT users ON;
INSERT INTO users (id, username, password_hash, full_name, email, role, is_active) 
VALUES (1, 'kien.nd', '$2b$10$Ng1HJ0lZ1CPvjRTZEsJ1Z.JFXSBWKsGiLaubHX3R8gt77ANvM0TWu', 'Kien Nguyen', 'kien.nd@example.com', 'ADMIN', 1);
SET IDENTITY_INSERT users OFF;
GO

SET IDENTITY_INSERT api_keys ON;
INSERT INTO api_keys (api_key_id, [key], status, permissions) 
VALUES (1, 'default-api-key-12345', 1, '["0000"]');
SET IDENTITY_INSERT api_keys OFF;
GO
