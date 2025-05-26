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
-- Table structure for table `prestamos`
--

DROP TABLE IF EXISTS `prestamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamos` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `saldo_pendiente` decimal(10,2) NOT NULL,
  `cuota_mensual` decimal(10,2) NOT NULL,
  `cantidad_cuotas` int NOT NULL,
  `cuotas_pagadas` int NOT NULL DEFAULT '0',
  `fecha_inicio` date NOT NULL,
  `fecha_fin_estimada` date NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('Aprobado','En Curso','Pagado','Cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Aprobado',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_prestamo`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamos`
--

LOCK TABLES `prestamos` WRITE;
/*!40000 ALTER TABLE `prestamos` DISABLE KEYS */;
INSERT INTO `prestamos` VALUES (1,4,10000.00,7000.00,500.00,20,6,'2023-07-01','2025-02-28','Gastos médicos','En Curso',1,'2025-04-29 20:16:03'),(2,6,6000.00,3000.00,500.00,12,6,'2023-09-01','2024-08-31','Compra de electrodomésticos','En Curso',1,'2025-04-29 20:16:03'),(3,7,12000.00,10000.00,1000.00,12,2,'2024-01-01','2024-12-31','Compra de motocicleta','En Curso',1,'2025-04-29 20:16:03'),(4,9,5000.00,4000.00,500.00,10,2,'2024-01-01','2024-10-31','Gastos educativos','En Curso',1,'2025-04-29 20:16:03'),(5,10,8000.00,6400.00,800.00,10,2,'2024-02-01','2024-11-30','Renovación de vivienda','En Curso',1,'2025-04-29 20:16:03'),(6,7,15000.00,13750.00,1250.00,12,1,'2025-05-15','2026-05-15','Prestamo para Carro','En Curso',1,'2025-05-03 16:58:18'),(7,2,20000.00,18333.33,1666.67,12,1,'2025-05-03','2026-05-03','Prestamo casa','En Curso',1,'2025-05-03 17:29:52');
/*!40000 ALTER TABLE `prestamos` ENABLE KEYS */;
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
