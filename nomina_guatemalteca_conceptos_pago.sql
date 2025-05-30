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
-- Table structure for table `conceptos_pago`
--

DROP TABLE IF EXISTS `conceptos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conceptos_pago` (
  `id_concepto` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo` enum('Ingreso','Descuento','Aporte') COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_fijo` tinyint(1) NOT NULL DEFAULT '0',
  `afecta_igss` tinyint(1) NOT NULL DEFAULT '0',
  `afecta_isr` tinyint(1) NOT NULL DEFAULT '0',
  `es_viatico` tinyint(1) NOT NULL DEFAULT '0',
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `monto_fijo` decimal(10,2) DEFAULT NULL,
  `obligatorio` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_concepto`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conceptos_pago`
--

LOCK TABLES `conceptos_pago` WRITE;
/*!40000 ALTER TABLE `conceptos_pago` DISABLE KEYS */;
INSERT INTO `conceptos_pago` VALUES (1,'VIAT','Viáticos','Reembolso de gastos por viáticos','Ingreso',0,0,0,1,NULL,NULL,0,1,'2025-04-28 16:14:34'),(2,'SALB','Salario Base','Salario base mensual','Ingreso',1,1,1,0,NULL,NULL,1,1,'2025-04-29 20:08:59'),(3,'BONIF','Bonificación Incentivo','Bonificación incentivo decreto 78-89','Ingreso',1,0,0,0,NULL,250.00,1,1,'2025-04-29 20:08:59'),(4,'HEXTR','Horas Extra','Pago por horas extraordinarias','Ingreso',0,1,1,0,NULL,NULL,0,1,'2025-04-29 20:08:59'),(5,'IGSS','IGSS Laboral','Descuento por IGSS laboral','Descuento',1,0,0,0,4.83,NULL,1,1,'2025-04-29 20:08:59'),(6,'ISR','ISR','Descuento por Impuesto Sobre la Renta','Descuento',1,0,0,0,NULL,NULL,1,1,'2025-04-29 20:08:59'),(7,'PREST','Préstamo','Descuento por préstamo','Descuento',0,0,0,0,NULL,NULL,0,1,'2025-04-29 20:08:59'),(8,'BONO14','Bono 14','Bono anual decreto 42-92','Ingreso',0,0,0,0,NULL,NULL,1,1,'2025-04-29 20:08:59'),(9,'AGUIN','Aguinaldo','Aguinaldo anual','Ingreso',0,0,0,0,NULL,NULL,1,1,'2025-04-29 20:08:59'),(10,'ANTIC','Anticipo Salarial','Anticipo de salario','Descuento',0,0,0,0,NULL,NULL,0,1,'2025-04-29 20:08:59'),(11,'COMIS','Comisiones','Comisiones por ventas','Ingreso',0,1,1,0,NULL,NULL,0,1,'2025-04-29 20:08:59'),(12,'VACAPAG','Pago de Vacaciones','Pago de vacaciones','Ingreso',0,1,1,0,25.00,NULL,0,1,'2025-05-07 04:03:02');
/*!40000 ALTER TABLE `conceptos_pago` ENABLE KEYS */;
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
