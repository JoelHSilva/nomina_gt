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
-- Table structure for table `historial_salarios`
--

DROP TABLE IF EXISTS `historial_salarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_salarios` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `salario_anterior` decimal(10,2) NOT NULL,
  `salario_nuevo` decimal(10,2) NOT NULL,
  `fecha_cambio` date NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `autorizado_por` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `historial_salarios_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_salarios`
--

LOCK TABLES `historial_salarios` WRITE;
/*!40000 ALTER TABLE `historial_salarios` DISABLE KEYS */;
INSERT INTO `historial_salarios` VALUES (1,1,14000.00,15000.00,'2024-01-01','Ajuste anual','Gerente General',1,'2025-04-29 20:25:24'),(2,2,11000.00,12000.00,'2024-01-01','Ajuste anual','Gerente General',1,'2025-04-29 20:25:24'),(3,3,9500.00,10000.00,'2024-01-01','Ajuste anual','Gerente General',1,'2025-04-29 20:25:24'),(4,5,4000.00,4500.00,'2024-02-01','Promoción','Gerente RRHH',1,'2025-04-29 20:25:24'),(5,8,5500.00,6000.00,'2024-03-01','Ajuste por desempeño','Gerente Producción',1,'2025-04-29 20:25:24');
/*!40000 ALTER TABLE `historial_salarios` ENABLE KEYS */;
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
