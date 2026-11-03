import app from "./app";

import {
  sequelize,
  connectDatabase,
} from "./config/database";

import "./models/Client";

import "./models/Product";

import {
  initializeOrderAssociations,
} from "./models/associations";

// Registrar relaciones antes de sincronizar.

initializeOrderAssociations();

const port = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {
  try {
    // Comprobar la conexión con PostgreSQL.

    await connectDatabase();

    // Sincronizar los modelos registrados.

    await sequelize.sync();

    console.log(
        "Modelos sincronizados correctamente."
    );

    // Iniciar el servidor Express.

    app.listen(port, () => {
      console.log(
          `Servidor ejecutándose en http://localhost:${port}`
      );
    });

  } catch (error) {
    console.error(
        "El servidor no pudo iniciarse por un error de base de datos."
    );

    console.error(error);

    process.exit(1);
  }
};

void startServer();