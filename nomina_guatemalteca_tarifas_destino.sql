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
-- Table structure for table `tarifas_destino`
--

DROP TABLE IF EXISTS `tarifas_destino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarifas_destino` (
  `id_tarifa` int NOT NULL AUTO_INCREMENT,
  `id_destino` int NOT NULL,
  `id_tipo_viatico` int NOT NULL,
  `monto_sugerido` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_tarifa`),
  UNIQUE KEY `id_destino` (`id_destino`,`id_tipo_viatico`),
  UNIQUE KEY `tarifas_destino_id_destino_id_tipo_viatico` (`id_destino`,`id_tipo_viatico`),
  KEY `id_tipo_viatico` (`id_tipo_viatico`),
  CONSTRAINT `tarifas_destino_ibfk_107` FOREIGN KEY (`id_destino`) REFERENCES `destinos_viaticos` (`id_destino`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tarifas_destino_ibfk_108` FOREIGN KEY (`id_tipo_viatico`) REFERENCES `tipos_viaticos` (`id_tipo_viatico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarifas_destino`
--

LOCK TABLES `tarifas_destino` WRITE;
/*!40000 ALTER TABLE `tarifas_destino` DISABLE KEYS */;
INSERT INTO `tarifas_destino` VALUES (1,1,1,150.00,1,'2025-04-29 20:25:56'),(2,1,2,100.00,1,'2025-04-29 20:25:56'),(3,1,3,500.00,1,'2025-04-29 20:25:56'),(4,2,1,125.00,1,'2025-04-29 20:25:56'),(5,2,2,150.00,1,'2025-04-29 20:25:56'),(6,2,3,400.00,1,'2025-04-29 20:25:56'),(7,3,1,175.00,1,'2025-04-29 20:25:56'),(8,3,2,300.00,1,'2025-04-29 20:25:56'),(9,3,3,600.00,1,'2025-04-29 20:25:56'),(10,4,1,250.00,1,'2025-04-29 20:25:56'),(11,4,2,350.00,1,'2025-04-29 20:25:56'),(12,4,3,800.00,1,'2025-04-29 20:25:56'),(13,5,1,225.00,1,'2025-04-29 20:25:56'),(14,5,2,325.00,1,'2025-04-29 20:25:56'),(15,5,3,750.00,1,'2025-04-29 20:25:56'),(16,6,1,130.00,1,'2025-04-29 20:38:14'),(17,6,2,120.00,1,'2025-04-29 20:38:14'),(18,6,3,350.00,1,'2025-04-29 20:38:14'),(19,7,1,140.00,1,'2025-04-29 20:38:14'),(20,7,2,180.00,1,'2025-04-29 20:38:14'),(21,7,3,380.00,1,'2025-04-29 20:38:14'),(22,8,1,150.00,1,'2025-04-29 20:38:14'),(23,8,2,250.00,1,'2025-04-29 20:38:14'),(24,8,3,450.00,1,'2025-04-29 20:38:14'),(25,9,1,350.00,1,'2025-04-29 20:38:14'),(26,9,2,500.00,1,'2025-04-29 20:38:14'),(27,9,3,1200.00,1,'2025-04-29 20:38:14'),(28,10,1,280.00,1,'2025-04-29 20:38:14'),(29,10,2,450.00,1,'2025-04-29 20:38:14'),(30,10,3,950.00,1,'2025-04-29 20:38:14'),(31,11,1,320.00,1,'2025-04-29 20:38:14'),(32,11,2,400.00,1,'2025-04-29 20:38:14'),(33,11,3,1100.00,1,'2025-04-29 20:38:14');
/*!40000 ALTER TABLE `tarifas_destino` ENABLE KEYS */;
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
