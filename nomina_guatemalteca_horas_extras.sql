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
-- Table structure for table `horas_extras`
--

DROP TABLE IF EXISTS `horas_extras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horas_extras` (
  `id_hora_extra` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `fecha` date NOT NULL,
  `horas` decimal(4,2) NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('Pendiente','Aprobada','Rechazada','Pagada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendiente',
  `aprobado_por` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_detalle_nomina` int DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_hora_extra`),
  KEY `id_empleado` (`id_empleado`),
  KEY `id_detalle_nomina` (`id_detalle_nomina`),
  CONSTRAINT `horas_extras_ibfk_125` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `horas_extras_ibfk_126` FOREIGN KEY (`id_detalle_nomina`) REFERENCES `detalle_nomina` (`id_detalle`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_extras`
--

LOCK TABLES `horas_extras` WRITE;
/*!40000 ALTER TABLE `horas_extras` DISABLE KEYS */;
INSERT INTO `horas_extras` VALUES (1,7,'2024-01-10',2.00,'Inventario fin de mes','Pagada','Supervisor',7,1,'2025-04-29 20:25:10'),(2,10,'2024-01-12',3.00,'Preparación de reportes urgentes','Pagada','Supervisor',10,1,'2025-04-29 20:25:10'),(3,7,'2024-02-08',2.00,'Inventario fin de mes','Pagada','Supervisor',NULL,1,'2025-04-29 20:25:10'),(4,9,'2024-03-15',3.00,'Producción extra','Aprobada','Supervisor',NULL,1,'2025-04-29 20:25:10'),(5,10,'2024-03-20',2.00,'Preparación de reportes urgentes','Pendiente',NULL,NULL,1,'2025-04-29 20:25:10');
/*!40000 ALTER TABLE `horas_extras` ENABLE KEYS */;
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
