-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: nomina_guatemalteca
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_completo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('Administrador','RRHH','Contador','Consulta') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ultimo_acceso` datetime DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `nombre_usuario_2` (`nombre_usuario`),
  UNIQUE KEY `correo_2` (`correo`),
  UNIQUE KEY `nombre_usuario_3` (`nombre_usuario`),
  UNIQUE KEY `correo_3` (`correo`),
  UNIQUE KEY `nombre_usuario_4` (`nombre_usuario`),
  UNIQUE KEY `correo_4` (`correo`),
  UNIQUE KEY `nombre_usuario_5` (`nombre_usuario`),
  UNIQUE KEY `correo_5` (`correo`),
  UNIQUE KEY `nombre_usuario_6` (`nombre_usuario`),
  UNIQUE KEY `correo_6` (`correo`),
  UNIQUE KEY `nombre_usuario_7` (`nombre_usuario`),
  UNIQUE KEY `correo_7` (`correo`),
  UNIQUE KEY `nombre_usuario_8` (`nombre_usuario`),
  UNIQUE KEY `correo_8` (`correo`),
  UNIQUE KEY `nombre_usuario_9` (`nombre_usuario`),
  UNIQUE KEY `correo_9` (`correo`),
  UNIQUE KEY `nombre_usuario_10` (`nombre_usuario`),
  UNIQUE KEY `correo_10` (`correo`),
  UNIQUE KEY `nombre_usuario_11` (`nombre_usuario`),
  UNIQUE KEY `correo_11` (`correo`),
  UNIQUE KEY `nombre_usuario_12` (`nombre_usuario`),
  UNIQUE KEY `correo_12` (`correo`),
  UNIQUE KEY `nombre_usuario_13` (`nombre_usuario`),
  UNIQUE KEY `correo_13` (`correo`),
  UNIQUE KEY `nombre_usuario_14` (`nombre_usuario`),
  UNIQUE KEY `correo_14` (`correo`),
  UNIQUE KEY `nombre_usuario_15` (`nombre_usuario`),
  UNIQUE KEY `correo_15` (`correo`),
  UNIQUE KEY `nombre_usuario_16` (`nombre_usuario`),
  UNIQUE KEY `correo_16` (`correo`),
  UNIQUE KEY `nombre_usuario_17` (`nombre_usuario`),
  UNIQUE KEY `correo_17` (`correo`),
  UNIQUE KEY `nombre_usuario_18` (`nombre_usuario`),
  UNIQUE KEY `correo_18` (`correo`),
  UNIQUE KEY `nombre_usuario_19` (`nombre_usuario`),
  UNIQUE KEY `correo_19` (`correo`),
  UNIQUE KEY `nombre_usuario_20` (`nombre_usuario`),
  UNIQUE KEY `correo_20` (`correo`),
  UNIQUE KEY `nombre_usuario_21` (`nombre_usuario`),
  UNIQUE KEY `correo_21` (`correo`),
  UNIQUE KEY `nombre_usuario_22` (`nombre_usuario`),
  UNIQUE KEY `correo_22` (`correo`),
  UNIQUE KEY `nombre_usuario_23` (`nombre_usuario`),
  UNIQUE KEY `correo_23` (`correo`),
  UNIQUE KEY `nombre_usuario_24` (`nombre_usuario`),
  UNIQUE KEY `correo_24` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Administrador del Sistema','admin@empresa.com','Administrador','2024-04-15 09:30:00',1,'2025-04-29 20:38:30'),(2,'rrhh','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','María García - RRHH','rrhh@empresa.com','RRHH','2024-04-15 10:15:00',1,'2025-04-29 20:38:30'),(3,'contador','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Carlos López - Contabilidad','contabilidad@empresa.com','Contador','2024-04-14 16:45:00',1,'2025-04-29 20:38:30'),(4,'consulta1','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Usuario de Consulta','consulta@empresa.com','Consulta','2024-04-12 11:20:00',1,'2025-04-29 20:38:30'),(5,'supervisor','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Luis Martínez - Supervisor','supervisor@empresa.com','RRHH','2024-04-15 08:45:00',1,'2025-04-29 20:38:30');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 11:43:26
