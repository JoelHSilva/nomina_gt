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
-- Table structure for table `logs_sistema`
--

DROP TABLE IF EXISTS `logs_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs_sistema` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `accion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tabla_afectada` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_registro` int DEFAULT NULL,
  `datos_anteriores` text COLLATE utf8mb4_unicode_ci,
  `datos_nuevos` text COLLATE utf8mb4_unicode_ci,
  `direccion_ip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_hora` datetime NOT NULL,
  PRIMARY KEY (`id_log`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `logs_sistema_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_sistema`
--

LOCK TABLES `logs_sistema` WRITE;
/*!40000 ALTER TABLE `logs_sistema` DISABLE KEYS */;
INSERT INTO `logs_sistema` VALUES (1,1,'Creación de nómina','nominas',1,NULL,'{\"id_periodo\":1,\"descripcion\":\"Nómina Quincena 1 Enero 2024\"}','192.168.1.100','2025-04-29 20:39:36'),(2,2,'Actualización de empleado','empleados',3,'{\"salario_actual\":9500.00}','{\"salario_actual\":10000.00}','192.168.1.101','2025-04-29 20:39:36'),(3,3,'Aprobación de liquidación de viáticos','liquidacion_viaticos',1,'{\"estado\":\"Pendiente\"}','{\"estado\":\"Aprobada\"}','192.168.1.102','2025-04-29 20:39:36'),(4,1,'Eliminación de concepto de pago','conceptos_pago',12,'{\"codigo\":\"TEST\",\"nombre\":\"Concepto prueba\"}',NULL,'192.168.1.100','2025-04-29 20:39:36'),(5,5,'Aprobación de solicitud de viáticos','solicitudes_viaticos',4,'{\"estado\":\"Solicitada\"}','{\"estado\":\"Aprobada\"}','192.168.1.105','2025-04-29 20:39:36'),(6,2,'Registro de horas extras','horas_extras',5,NULL,'{\"id_empleado\":10,\"horas\":2,\"motivo\":\"Preparación de reportes\"}','192.168.1.101','2025-04-29 20:39:36'),(7,3,'Actualización de política de viáticos','politicas_viaticos_puesto',8,'{\"monto_maximo_diario\":350.00}','{\"monto_maximo_diario\":400.00}','192.168.1.102','2025-04-29 20:39:36');
/*!40000 ALTER TABLE `logs_sistema` ENABLE KEYS */;
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
