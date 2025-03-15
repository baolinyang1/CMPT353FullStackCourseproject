-- Create tables for users, channels, messages, replies, and ratings

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  displayName VARCHAR(100),
  role ENUM('admin','user') DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CHANNELS
CREATE TABLE IF NOT EXISTS channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  createdBy INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  channelId INT NOT NULL,
  userId INT NOT NULL,
  content TEXT NOT NULL,
  imageUrl VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (channelId) REFERENCES channels(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- REPLIES
CREATE TABLE IF NOT EXISTS replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  messageId INT NOT NULL,
  userId INT NOT NULL,
  parentReplyId INT NULL,
  content TEXT NOT NULL,
  imageUrl VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (messageId) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parentReplyId) REFERENCES replies(id) ON DELETE CASCADE
);

-- RATINGS
CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  messageId INT NULL,
  replyId INT NULL,
  rating TINYINT NOT NULL, -- +1 or -1
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (messageId) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (replyId) REFERENCES replies(id) ON DELETE CASCADE
);

-- Create an admin user for demonstration (password = 'admin')
INSERT INTO users (username, password, displayName, role)
VALUES ('admin', '$2b$10$dUmbPaSsHaShqXWtXPHKuP.cqzKh1sNXH/IdkC8MuCPpOf8HEiyjsO', 'System Admin', 'admin')
ON DUPLICATE KEY UPDATE username=username;
