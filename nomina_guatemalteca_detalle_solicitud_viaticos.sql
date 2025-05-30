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
-- Table structure for table `detalle_solicitud_viaticos`
--

DROP TABLE IF EXISTS `detalle_solicitud_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_solicitud_viaticos` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int NOT NULL,
  `id_tipo_viatico` int NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `monto` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_solicitud` (`id_solicitud`),
  KEY `id_tipo_viatico` (`id_tipo_viatico`),
  CONSTRAINT `detalle_solicitud_viaticos_ibfk_125` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_viaticos` (`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `detalle_solicitud_viaticos_ibfk_126` FOREIGN KEY (`id_tipo_viatico`) REFERENCES `tipos_viaticos` (`id_tipo_viatico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_solicitud_viaticos`
--

LOCK TABLES `detalle_solicitud_viaticos` WRITE;
/*!40000 ALTER TABLE `detalle_solicitud_viaticos` DISABLE KEYS */;
INSERT INTO `detalle_solicitud_viaticos` VALUES (1,1,1,'Alimentación 3 días',900.00,1,'2025-04-29 20:26:43'),(2,1,2,'Transporte aéreo ida y vuelta',2000.00,1,'2025-04-29 20:26:43'),(3,1,3,'Hospedaje 3 noches',2100.00,1,'2025-04-29 20:26:43'),(4,2,1,'Alimentación 3 días',750.00,1,'2025-04-29 20:26:43'),(5,2,2,'Transporte terrestre ida y vuelta',600.00,1,'2025-04-29 20:26:43'),(6,2,3,'Hospedaje 3 noches',1200.00,1,'2025-04-29 20:26:43'),(7,2,5,'Materiales para capacitación',950.00,1,'2025-04-29 20:26:43'),(8,3,1,'Alimentación 3 días',750.00,1,'2025-04-29 20:26:43'),(9,3,2,'Transporte terrestre y local',900.00,1,'2025-04-29 20:26:43'),(10,3,3,'Hospedaje 3 noches',1800.00,1,'2025-04-29 20:26:43'),(11,3,4,'Combustible',550.00,1,'2025-04-29 20:26:43'),(12,4,1,'Alimentación 5 días',1250.00,1,'2025-04-29 20:26:43'),(13,4,2,'Transporte aéreo ida y vuelta',2500.00,1,'2025-04-29 20:26:43'),(14,4,3,'Hospedaje 5 noches',2250.00,1,'2025-04-29 20:26:43'),(15,5,1,'Alimentación 2 días',400.00,1,'2025-04-29 20:26:43'),(16,5,2,'Transporte terrestre ida y vuelta',700.00,1,'2025-04-29 20:26:43'),(17,5,3,'Hospedaje 2 noches',900.00,1,'2025-04-29 20:26:43'),(18,5,4,'Combustible',500.00,1,'2025-04-29 20:26:43');
/*!40000 ALTER TABLE `detalle_solicitud_viaticos` ENABLE KEYS */;
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
