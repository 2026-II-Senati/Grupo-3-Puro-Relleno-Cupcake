import "dotenv/config";
import { Sequelize } from "sequelize";

const getRequiredEnvironmentVariable = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable de entorno ${name} es obligatoria.`);
  }

  return value;
};

const databasePort = Number(process.env.DB_PORT ?? "5432");

if (!Number.isInteger(databasePort) || databasePort <= 0) {
  throw new Error("La variable de entorno DB_PORT debe ser un número válido.");
}

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: getRequiredEnvironmentVariable("DB_HOST"),
  port: databasePort,
  database: getRequiredEnvironmentVariable("DB_NAME"),
  username: getRequiredEnvironmentVariable("DB_USER"),
  password: getRequiredEnvironmentVariable("DB_PASSWORD"),
  logging: false
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a PostgreSQL establecida correctamente.");
  } catch (error) {
    const details = error instanceof Error ? error.message : "Error desconocido";

    console.error(`No fue posible conectar a PostgreSQL: ${details}`);
    throw error;
  }
};