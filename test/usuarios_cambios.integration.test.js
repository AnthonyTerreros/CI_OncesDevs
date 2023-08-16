const request = require("supertest");
const sql = require("mssql");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const baseUrl = "https://localhost:5001/";
const config = {
  server: "DANPC",
  database: "broadnetcrm",
  port: 1433,
  user: "Anthony",
  password: "123",
  trustServerCertificate: true,
  options: {
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
      trustServerCertificate: true,
    },
  },
};

async function getDataFromDB(query) {
  await sql.connect(config);
  const result = await sql.query(query);
  sql.close();
  return result.recordset;
}

describe("Integration User and Changes Modules", () => {
  var token = "";

  beforeAll((done) => {
    request(baseUrl)
      .post("api/auth")
      .send({ usuario: "anavarro", contrasena: "1234" })
      .end((err, res) => {
        token = res.body.data.token;
        done();
      });
  });

  it("Registration for new Employee and get Users Crendentials for the System - should return ok", async () => {
    let empleado = {
      nombre: "PEPA OCHACO",
      apellido: "ZAMBRANO ZUMBA",
      cedula: "0932444444",
      fechaNacimiento: new Date().toJSON().replace("T", " ").replace("Z", " "),
      telefono: "0932444444",
      direccion: "32 y la H",
      correo: "anthonyterreros21@gmail.com",
      usuarioId: 2,
      name_user: "pepazambrano3",
      jefe: 0,
      tipo: "0",
      jefeId: 0,
    };

    let resultAPIEmployee = await request(baseUrl)
      .post("api/empleado")
      .set("Authorization", "Bearer " + token)
      .send(empleado);

    expect(resultAPIEmployee.status).toBe(200);
    expect(resultAPIEmployee).not.toBeNull();

    const responseDB = await getDataFromDB(
      `SELECT TOP(1) * FROM Empleados ORDER BY id DESC`
    );
    expect(responseDB[0].cedula).toBe(empleado.cedula);

    let user = {
      usuario: empleado.name_user,
      contrasena: "1234",
      empleadoId: responseDB[0].id,
      rolId: 2,
      rol: "",
      idPadre: 0,
      recibeasignaciones: 0,
      estado: 1,
      intentos: 0,
    };

    let resultAPIUser = await request(baseUrl)
      .post("api/usuario")
      .set("Authorization", "Bearer " + token)
      .send(user);
    expect(resultAPIUser.status).toBe(200);
    expect(resultAPIUser).not.toBeUndefined();

    const response2DB = await getDataFromDB(
      `SELECT TOP(1) * FROM Usuarios ORDER BY id DESC`
    );
    expect(response2DB[0]).not.toBeNull();
    expect(response2DB[0].usuario).toBe(user.usuario);
    expect(response2DB[0].empleadoId).toBe(resultAPIEmployee.body.data.id);
    expect(response2DB[0].estado).toBe(user.estado);
  });

  it("resetPassword and createChange - should return ok", async () => {
    let user = {
      usuario: "miturralde",
      contrasena: "$#$#43434",
      empleadoId: 2,
      rolId: 2,
      rol: "",
      idPadre: 0,
      recibeasignaciones: 0,
      estado: 1,
      intentos: 0,
    };

    const responseAPIUsers = await request(baseUrl)
      .put("api/usuario/resetear-constrasena/24")
      .set("Authorization", "Bearer " + token)
      .send(user);
    expect(responseAPIUsers.status).toBe(200);
    expect(responseAPIUsers.body).not.toBeNull();

    const responseDB = await getDataFromDB(
      `SELECT TOP(1) * FROM Cambios JOIN Usuarios ON idUsuarioCambiado = Usuarios.id ORDER BY fecha DESC`
    );

    expect(responseDB[0].usuario).toBe(user.usuario);
  });
});
