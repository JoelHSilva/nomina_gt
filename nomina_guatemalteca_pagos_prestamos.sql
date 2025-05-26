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
-- Table structure for table `pagos_prestamos`
--

DROP TABLE IF EXISTS `pagos_prestamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos_prestamos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_prestamo` int NOT NULL,
  `id_detalle_nomina` int DEFAULT NULL,
  `monto_pagado` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `tipo_pago` enum('Nómina','Manual') COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_prestamo` (`id_prestamo`),
  KEY `id_detalle_nomina` (`id_detalle_nomina`),
  CONSTRAINT `pagos_prestamos_ibfk_107` FOREIGN KEY (`id_prestamo`) REFERENCES `prestamos` (`id_prestamo`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pagos_prestamos_ibfk_108` FOREIGN KEY (`id_detalle_nomina`) REFERENCES `detalle_nomina` (`id_detalle`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos_prestamos`
--

LOCK TABLES `pagos_prestamos` WRITE;
/*!40000 ALTER TABLE `pagos_prestamos` DISABLE KEYS */;
INSERT INTO `pagos_prestamos` VALUES (1,1,4,500.00,'2024-01-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(2,2,6,500.00,'2024-01-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(3,3,7,1000.00,'2024-01-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(4,4,9,500.00,'2024-01-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(5,5,10,800.00,'2024-03-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(6,6,NULL,1250.00,'2025-05-03','Manual',NULL,1,'2025-05-03 16:58:25'),(7,7,NULL,1666.67,'2025-05-03','Manual',NULL,1,'2025-05-03 17:29:57');
/*!40000 ALTER TABLE `pagos_prestamos` ENABLE KEYS */;
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
