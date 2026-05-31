-- Banco de dados do App de Lembretes

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

-- Cria o banco se não existir
CREATE DATABASE IF NOT EXISTS `app_Lembretes`;

USE `app_Lembretes`;

-- Tabela de usuários
CREATE TABLE `usuarios` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nome` varchar(100) NOT NULL,
    `email` varchar(70) NOT NULL,
    `senha` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

COMMIT;