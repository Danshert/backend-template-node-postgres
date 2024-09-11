# Node template

Instalación de dependencias

```
npm install
```

Configuración de las variables de entorno (.env)

```
PORT=3000
PUBLIC_PATH=public
```

Inicializar la base de datos

```
docker compose up -d
```

Generar migración de la base de datos

```
npx prisma migrate dev --name init
```

Ejecutar proyecto

```
npm run dev
```

Revisar y formatear el código

```
npm run format
```

Ejecutar pruebas

```
npm run test
```
