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
-- Table structure for table `conceptos_aplicados`
--

DROP TABLE IF EXISTS `conceptos_aplicados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conceptos_aplicados` (
  `id_concepto_aplicado` int NOT NULL AUTO_INCREMENT,
  `id_detalle` int NOT NULL,
  `id_concepto` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `observacion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_concepto_aplicado`),
  KEY `id_detalle` (`id_detalle`),
  KEY `id_concepto` (`id_concepto`),
  CONSTRAINT `conceptos_aplicados_ibfk_127` FOREIGN KEY (`id_detalle`) REFERENCES `detalle_nomina` (`id_detalle`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `conceptos_aplicados_ibfk_128` FOREIGN KEY (`id_concepto`) REFERENCES `conceptos_pago` (`id_concepto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conceptos_aplicados`
--

LOCK TABLES `conceptos_aplicados` WRITE;
/*!40000 ALTER TABLE `conceptos_aplicados` DISABLE KEYS */;
INSERT INTO `conceptos_aplicados` VALUES (33,1,1,7500.00,'Salario base quincena',1,'2025-04-29 20:14:36'),(34,1,2,125.00,'Bonificación incentivo',1,'2025-04-29 20:14:36'),(35,1,4,362.25,'IGSS laboral',1,'2025-04-29 20:14:36'),(36,1,5,400.00,'ISR',1,'2025-04-29 20:14:36'),(37,2,1,6000.00,'Salario base quincena',1,'2025-04-29 20:14:36'),(38,2,2,125.00,'Bonificación incentivo',1,'2025-04-29 20:14:36'),(39,2,4,289.80,'IGSS laboral',1,'2025-04-29 20:14:36'),(40,2,5,300.00,'ISR',1,'2025-04-29 20:14:36'),(41,7,1,1750.00,'Salario base quincena',1,'2025-04-29 20:14:36'),(42,7,2,125.00,'Bonificación incentivo',1,'2025-04-29 20:14:36'),(43,7,3,87.50,'Pago 2 horas extra',1,'2025-04-29 20:14:36'),(44,7,4,88.84,'IGSS laboral',1,'2025-04-29 20:14:36'),(45,10,1,1750.00,'Salario base quincena',1,'2025-04-29 20:14:36'),(46,10,2,125.00,'Bonificación incentivo',1,'2025-04-29 20:14:36'),(47,10,3,131.25,'Pago 3 horas extra',1,'2025-04-29 20:14:36'),(48,10,4,90.66,'IGSS laboral',1,'2025-04-29 20:14:36');
/*!40000 ALTER TABLE `conceptos_aplicados` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 11:43:27
