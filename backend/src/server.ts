import app from "./app";
import { connectDatabase } from "./config/database";

const port = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Servidor ejecutándose en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("El servidor no pudo iniciarse por un error de base de datos.");
    process.exit(1);
  }
};

void startServer();