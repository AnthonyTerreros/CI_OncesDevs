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

describe("Final Sprint Broadnet: Testing Users Module => /api/usuario", () => {
  var token = "";

  var user = {
    usuario: "jsancho21",
    contrasena: "1234",
    empleadoId: 7,
    rolId: 2,
    rol: "",
    idPadre: 0,
    recibeasignaciones: 0,
    estado: 1,
    intentos: 0,
  };

  beforeAll((done) => {
    request(baseUrl)
      .post("api/auth")
      .send({ usuario: "anavarro", contrasena: "1234" })
      .end((err, res) => {
        token = res.body.data.token;
        done();
      });
  });

  it("Create New User - should return OK", (done) => {
    request(baseUrl)
      .post("api/usuario")
      .set("Authorization", "Bearer " + token)
      .send(user)
      .expect(200, done);
  });

  it("Create New Employee - should return OK", (done) => {
    let empleado = {
      nombre: "JUANA DOLORES".toUpperCase(),
      apellido: "SANCHO PANZA".toUpperCase(),
      cedula: "0932444444",
      fechaNacimiento: new Date().toJSON().replace("T", " ").replace("Z", " "),
      telefono: "0932444444",
      direccion: "Ceibos",
      correo: "anthonyterreros21@gmail.com",
      usuarioId: 2,
      name_user: "jsancho21",
      jefe: 0,
      tipo: "0",
      jefeId: 0,
    };
    request(baseUrl)
      .post("api/empleado")
      .set("Authorization", "Bearer " + token)
      .send(empleado)
      .expect(200, done);
  });

  it("disableUser - should return OK", (done) => {
    request(baseUrl)
      .put("api/usuario/inhabilitar-usuario/jsancho21")
      .set("Authorization", "Bearer " + token)
      .send({ tipo: "I" })
      .expect(200, done);
  });

  it("changeEmail - should return OK", (done) => {
    let empleado = {
      nombre: "JUANA DOLORES".toUpperCase(),
      apellido: "SANCHO PANZA".toUpperCase(),
      cedula: "0932444444",
      fechaNacimiento: new Date().toJSON().replace("T", " ").replace("Z", " "),
      telefono: "0932444444",
      direccion: "Ceibos",
      correo: "danterreros21@gmail.com",
      usuarioId: 24,
      name_user: "jsancho21",
      jefe: 0,
      tipo: "0",
      jefeId: 0,
    };
    request(baseUrl)
      .put("api/usuario/cambiar-correo/jsancho21")
      .set("Authorization", "Bearer " + token)
      .send(empleado)
      .expect(200, done);
  });

  it("changePassword - should return OK", (done) => {
    user.contrasena = "$#$#FEEFEeffe";
    request(baseUrl)
      .put("api/usuario/resetear-constrasena/24")
      .set("Authorization", "Bearer " + token)
      .send(user)
      .expect(200, done);
  });
});