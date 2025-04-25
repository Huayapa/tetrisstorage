import express from 'express';

const app = express();
app.disable('x-powered-by');

const port = process.env.PORT || 3000;

// VERIFICAR CONEXION
app.get("/" , (req, res) => {
  res.send("Conexion Correcta")
})

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});