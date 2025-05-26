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
-- Table structure for table `periodos_pago`
--

DROP TABLE IF EXISTS `periodos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodos_pago` (
  `id_periodo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `fecha_pago` date NOT NULL,
  `tipo` enum('Quincenal','Mensual','Bono14','Aguinaldo','Otro') COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('Abierto','Procesando','Cerrado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Abierto',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_periodo`),
  UNIQUE KEY `fecha_inicio` (`fecha_inicio`,`fecha_fin`,`tipo`),
  UNIQUE KEY `periodos_pago_fecha_inicio_fecha_fin_tipo` (`fecha_inicio`,`fecha_fin`,`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodos_pago`
--

LOCK TABLES `periodos_pago` WRITE;
/*!40000 ALTER TABLE `periodos_pago` DISABLE KEYS */;
INSERT INTO `periodos_pago` VALUES (1,'Quincena 1 Enero 2024','2024-01-01','2024-01-15','2024-01-15','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(2,'Quincena 2 Enero 2024','2024-01-16','2024-01-31','2024-01-31','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(3,'Quincena 1 Febrero 2024','2024-02-01','2024-02-15','2024-02-15','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(4,'Quincena 2 Febrero 2024','2024-02-16','2024-02-29','2024-02-29','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(5,'Quincena 1 Marzo 2024','2024-03-01','2024-03-15','2024-03-15','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(6,'Quincena 2 Marzo 2024','2024-03-16','2024-03-31','2024-03-31','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(7,'Quincena 1 Abril 2024','2024-04-01','2024-04-15','2024-04-15','Quincenal','Abierto',1,'2025-04-29 20:10:28'),(8,'Bono 14 - 2024','2023-07-01','2024-06-30','2024-07-15','Bono14','Abierto',0,'2025-04-29 20:10:28'),(9,'Aguinaldo 2024','2023-12-01','2024-11-30','2024-12-15','Aguinaldo','Abierto',0,'2025-04-29 20:10:28');
/*!40000 ALTER TABLE `periodos_pago` ENABLE KEYS */;
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
