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
-- Table structure for table `destinos_viaticos`
--

DROP TABLE IF EXISTS `destinos_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinos_viaticos` (
  `id_destino` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `es_internacional` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_destino`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinos_viaticos`
--

LOCK TABLES `destinos_viaticos` WRITE;
/*!40000 ALTER TABLE `destinos_viaticos` DISABLE KEYS */;
INSERT INTO `destinos_viaticos` VALUES (1,'Ciudad de Guatemala','Capital',0,1,'2025-04-29 20:25:42'),(2,'Quetzaltenango','Segunda ciudad más grande',0,1,'2025-04-29 20:25:42'),(3,'Petén','Zona norte',0,1,'2025-04-29 20:25:42'),(4,'San Salvador','Capital de El Salvador',1,1,'2025-04-29 20:25:42'),(5,'San Pedro Sula','Ciudad de Honduras',1,1,'2025-04-29 20:25:42'),(6,'Escuintla','Zona sur de Guatemala',0,1,'2025-04-29 20:38:00'),(7,'Huehuetenango','Zona noroccidental',0,1,'2025-04-29 20:38:00'),(8,'Izabal','Zona nororiental',0,1,'2025-04-29 20:38:00'),(9,'Ciudad de Panamá','Capital de Panamá',1,1,'2025-04-29 20:38:00'),(10,'Managua','Capital de Nicaragua',1,1,'2025-04-29 20:38:00'),(11,'Belice','Ciudad de Belice',1,1,'2025-04-29 20:38:00');
/*!40000 ALTER TABLE `destinos_viaticos` ENABLE KEYS */;
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
