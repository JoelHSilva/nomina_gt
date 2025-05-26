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
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `codigo_empleado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dpi` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nit` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_igss` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('M','F','O') COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo_electronico` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_puesto` int NOT NULL,
  `fecha_contratacion` date NOT NULL,
  `fecha_fin_contrato` date DEFAULT NULL,
  `tipo_contrato` enum('Indefinido','Plazo fijo','Por obra') COLLATE utf8mb4_unicode_ci NOT NULL,
  `salario_actual` decimal(10,2) NOT NULL,
  `cuenta_bancaria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banco` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Activo','Inactivo','Suspendido','Vacaciones') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Activo',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `idx_codigo_empleado` (`codigo_empleado`),
  UNIQUE KEY `idx_dpi` (`dpi`),
  UNIQUE KEY `idx_nit` (`nit`),
  KEY `id_puesto` (`id_puesto`),
  KEY `idx_id_puesto` (`id_puesto`),
  CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`id_puesto`) REFERENCES `puestos` (`id_puesto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1,'EMP-001','Juan Carlos','López Méndez','1234567890123','12345678','98765432','1985-05-15','M','4ta Calle 5-23 Zona 10, Guatemala','55551234','jlopez@empresa.com',1,'2015-01-15',NULL,'Indefinido',15000.00,'123456789','Banco Industrial','Activo',1,'2025-04-29 20:05:38'),(2,'EMP-002','María José','García Hernández','2345678901234','23456789','87654321','1990-08-22','F','3ra Avenida 10-25 Zona 4, Guatemala','55552345','mgarcia@empresa.com',3,'2016-03-01',NULL,'Indefinido',12000.00,'234567890','Banrural','Activo',1,'2025-04-29 20:05:38'),(3,'EMP-003','Pedro Antonio','Ramírez Gómez','3456789012345','34567890','76543210','1988-11-10','M','7ma Calle 15-30 Zona 9, Guatemala','55553456','pramirez@empresa.com',5,'2017-05-10',NULL,'Indefinido',10000.00,'345678901','Banco G&T Continental','Activo',1,'2025-04-29 20:05:38'),(4,'EMP-004','Ana Lucía','Morales Paz','4567890123456','45678901','65432109','1992-04-18','F','10ma Avenida 8-15 Zona 1, Guatemala','55554567','amorales@empresa.com',2,'2018-02-15',NULL,'Indefinido',4000.00,'456789012','Banco Industrial','Activo',1,'2025-04-29 20:05:38'),(5,'EMP-005','Carlos Eduardo','Figueroa Torres','5678901234567','56789012','54321098','1986-09-05','M','5ta Calle 20-35 Zona 15, Guatemala','55555678','cfigueroa@empresa.com',4,'2017-10-01',NULL,'Indefinido',4500.00,'567890123','Banrural','Activo',1,'2025-04-29 20:05:38'),(6,'EMP-006','Lucía Fernanda','Vásquez Solís','6789012345678','67890123','43210987','1993-12-12','F','8va Avenida 5-10 Zona 10, Guatemala','55556789','lvasquez@empresa.com',6,'2019-04-01',NULL,'Indefinido',4000.00,'678901234','Banco G&T Continental','Activo',1,'2025-04-29 20:05:38'),(7,'EMP-007','José Manuel','Torres Orellana','7890123456789','78901234','32109876','1990-02-28','M','12va Calle 3-22 Zona 7, Guatemala','55557890','jtorres@empresa.com',7,'2018-06-15',NULL,'Indefinido',3500.00,'789012345','Banco Industrial','Activo',1,'2025-04-29 20:05:38'),(8,'EMP-008','Rosa María','López Sandoval','8901234567890','89012345','21098765','1989-07-19','F','3ra Avenida 15-30 Zona 11, Guatemala','55558901','rlopez@empresa.com',8,'2017-08-01',NULL,'Indefinido',6000.00,'890123456','Banrural','Activo',1,'2025-04-29 20:05:38'),(9,'EMP-009','Miguel Ángel','Gutiérrez López','9012345678901','90123456','10987654','1991-03-25','M','9na Calle 7-15 Zona 6, Guatemala','55559012','mgutierrez@empresa.com',9,'2019-01-10',NULL,'Indefinido',3000.00,'901234567','Banco G&T Continental','Activo',1,'2025-04-29 20:05:38'),(10,'EMP-010','Laura Patricia','Estrada Molina','0123456789012','01234567','09876543','1987-06-30','F','5ta Avenida 9-12 Zona 9, Guatemala','55550123','lestrada@empresa.com',7,'2018-03-15',NULL,'Indefinido',3500.00,'012345678','Banco Industrial','Activo',1,'2025-04-29 20:05:38'),(11,'EMP-011','Margarito Andres','Perez Lopez','3025458758401','6584874','3025458758401','2003-06-18','M','Villa nueva, Villa Nueva, Guatemala','45612378','margarito@empresa.com',7,'2025-04-30',NULL,'Indefinido',8000.00,'1325464','Banrural','Activo',1,'2025-04-30 07:12:35');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
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
