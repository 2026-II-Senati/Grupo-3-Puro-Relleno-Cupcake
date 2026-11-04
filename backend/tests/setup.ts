/// <reference types="node" />

/*
 * Configuración del entorno de pruebas.
 * No utilizaremos la base de datos real.
 */

process.env.NODE_ENV = "test";

process.env.DB_HOST ??= "127.0.0.1";
process.env.DB_PORT ??= "5432";
process.env.DB_NAME ??= "prc_test";
process.env.DB_USER ??= "prc_test";
process.env.DB_PASSWORD ??= "sin_conexion_real";