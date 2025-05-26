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
-- Table structure for table `nominas`
--

DROP TABLE IF EXISTS `nominas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nominas` (
  `id_nomina` int NOT NULL AUTO_INCREMENT,
  `id_periodo` int NOT NULL,
  `descripcion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_generacion` datetime NOT NULL,
  `estado` enum('Borrador','Verificada','Aprobada','Pagada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Borrador',
  `total_ingresos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_descuentos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_neto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `usuario_generacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_aprobacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_nomina`),
  KEY `id_periodo` (`id_periodo`),
  CONSTRAINT `nominas_ibfk_1` FOREIGN KEY (`id_periodo`) REFERENCES `periodos_pago` (`id_periodo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nominas`
--

LOCK TABLES `nominas` WRITE;
/*!40000 ALTER TABLE `nominas` DISABLE KEYS */;
INSERT INTO `nominas` VALUES (1,1,'Nómina Quincena 1 Enero 2024','2025-04-29 20:12:09','Pagada',53750.00,6750.00,47000.00,'sistema','admin','2024-01-15 12:00:00',1),(2,2,'Nómina Quincena 2 Enero 2024','2025-04-29 20:12:09','Pagada',54250.00,6850.00,47400.00,'sistema','admin','2024-01-31 12:00:00',1),(3,3,'Nómina Quincena 1 Febrero 2024','2025-04-29 20:12:09','Pagada',54750.00,6950.00,47800.00,'sistema','admin','2024-02-15 12:00:00',1),(4,4,'Nómina Quincena 2 Febrero 2024','2025-04-29 20:12:09','Pagada',55250.00,7050.00,48200.00,'sistema','admin','2024-02-29 12:00:00',1),(5,5,'Nómina Quincena 1 Marzo 2024','2025-04-29 20:12:09','Pagada',55750.00,7150.00,48600.00,'sistema','admin','2024-03-15 12:00:00',1),(6,6,'Nómina Quincena 2 Marzo 2024','2025-04-29 20:12:09','Aprobada',56250.00,7250.00,49000.00,'sistema','admin','2024-03-31 12:00:00',1),(7,7,'Nómina Quincena 1 Abril 2024 - Año Desconocido','2025-04-30 22:05:14','Borrador',76250.00,3300.00,72950.00,'Sistema',NULL,NULL,0),(8,9,'Nómina Aguinaldo 2024 - Año Desconocido','2025-05-02 22:46:55','Borrador',76250.00,3300.00,72950.00,'Sistema',NULL,NULL,0),(9,8,'Nómina Bono 14 - 2024 - Año Desconocido','2025-05-03 12:57:35','Borrador',76250.00,3300.00,72950.00,'Sistema',NULL,NULL,0);
/*!40000 ALTER TABLE `nominas` ENABLE KEYS */;
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
